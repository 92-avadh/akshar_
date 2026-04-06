const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OtpChallenge = require('../models/OtpChallenge');

const OTP_TTL_MINUTES = Number(process.env.OTP_TTL_MINUTES || 5);
const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS || 5);
const OTP_RESEND_COOLDOWN_SECONDS = Number(process.env.OTP_RESEND_COOLDOWN_SECONDS || 45);

const normalizePhoneNumber = (value) => String(value || '').replace(/\D/g, '');

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

const normalizeIdentifier = ({ mobileNumber, email }) => {
  const normalizedPhone = normalizePhoneNumber(mobileNumber);
  const normalizedEmail = normalizeEmail(email);

  if (normalizedPhone) {
    if (!/^\d{10}$/.test(normalizedPhone)) {
      throw new Error('Please provide a valid 10-digit mobile number.');
    }

    return {
      channel: 'mobile',
      value: normalizedPhone,
      query: { mobileNumber: normalizedPhone },
    };
  }

  if (normalizedEmail) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw new Error('Please provide a valid email address.');
    }

    return {
      channel: 'email',
      value: normalizedEmail,
      query: { email: normalizedEmail },
    };
  }

  throw new Error('Please provide an email or mobile number.');
};

const maskIdentifier = ({ channel, value }) => {
  if (channel === 'mobile') {
    return `${value.slice(0, 2)}******${value.slice(-2)}`;
  }

  const [localPart, domain = ''] = value.split('@');
  const visibleLocal = localPart.length > 2 ? `${localPart.slice(0, 2)}***` : `${localPart.charAt(0) || '*'}***`;
  return `${visibleLocal}@${domain}`;
};

const getOtpSecret = () => {
  const secret = process.env.OTP_SECRET || process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('Missing OTP_SECRET (or JWT_SECRET) environment variable');
  }

  return secret;
};

const hashOtp = ({ identifierKey, otp }) =>
  crypto.createHmac('sha256', getOtpSecret()).update(`${identifierKey}:${otp}`).digest('hex');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

const deliverOtp = async ({ otp, maskedRecipient, channel, requestId }) => {
  const provider = (process.env.OTP_PROVIDER || 'mock').toLowerCase();

  if (provider === 'mock') {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Mock OTP delivery is not allowed in production. Configure a real OTP provider.');
    }

    console.log(
      JSON.stringify({
        level: 'info',
        type: 'otp_delivery',
        requestId,
        provider,
        channel,
        recipient: maskedRecipient,
        otp,
        note: 'Mock OTP delivery is enabled. Replace this in production.',
      })
    );

    return provider;
  }

  throw new Error(`OTP provider "${provider}" is not implemented yet.`);
};

const sendOtp = async (req, res, next) => {
  try {
    const { channel, value, query } = normalizeIdentifier(req.body);
    const identifierKey = `${channel}:${value}`;
    const maskedRecipient = maskIdentifier({ channel, value });
    const now = new Date();

    const existingChallenge = await OtpChallenge.findOne({
      identifierKey,
      isUsed: false,
      expiresAt: { $gt: now },
    }).sort({ createdAt: -1 });

    if (existingChallenge && existingChallenge.resendAvailableAt > now) {
      const cooldownSeconds = Math.ceil((existingChallenge.resendAvailableAt.getTime() - now.getTime()) / 1000);
      return res.status(429).json({
        message: `Please wait ${cooldownSeconds} seconds before requesting another OTP.`,
        retryAfterSeconds: cooldownSeconds,
      });
    }

    const existingUser = await User.findOne(query);
    const otp = crypto.randomInt(100000, 1000000).toString();
    const expiresAt = new Date(now.getTime() + OTP_TTL_MINUTES * 60 * 1000);
    const resendAvailableAt = new Date(now.getTime() + OTP_RESEND_COOLDOWN_SECONDS * 1000);

    await OtpChallenge.deleteMany({ identifierKey, isUsed: false });

    const provider = await deliverOtp({
      otp,
      maskedRecipient,
      channel,
      requestId: req.requestId,
    });

    await OtpChallenge.create({
      identifierKey,
      channel,
      otpHash: hashOtp({ identifierKey, otp }),
      expiresAt,
      resendAvailableAt,
      maxAttempts: OTP_MAX_ATTEMPTS,
      lastRequestIp: req.ip,
      maskedRecipient,
      provider,
    });

    res.json({
      message: `OTP sent successfully to ${maskedRecipient}`,
      isNewUser: !existingUser,
      expiresInSeconds: OTP_TTL_MINUTES * 60,
    });
  } catch (error) {
    if (error.message.includes('Please provide') || error.message.includes('valid')) {
      return res.status(400).json({ message: error.message });
    }

    next(error);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { otp, name } = req.body;
    const { channel, value, query } = normalizeIdentifier(req.body);

    if (!/^\d{6}$/.test(String(otp || ''))) {
      return res.status(400).json({ message: 'OTP must be a 6-digit code.' });
    }

    const identifierKey = `${channel}:${value}`;
    const challenge = await OtpChallenge.findOne({
      identifierKey,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!challenge) {
      return res.status(401).json({ message: 'Invalid or expired OTP code.' });
    }

    const otpHash = hashOtp({ identifierKey, otp: String(otp) });

    if (challenge.otpHash !== otpHash) {
      challenge.attempts += 1;

      if (challenge.attempts >= challenge.maxAttempts) {
        challenge.isUsed = true;
      }

      await challenge.save();

      return res.status(challenge.isUsed ? 429 : 401).json({
        message: challenge.isUsed
          ? 'Maximum OTP attempts reached. Please request a new code.'
          : 'Invalid OTP code.',
        attemptsRemaining: Math.max(challenge.maxAttempts - challenge.attempts, 0),
      });
    }

    challenge.isUsed = true;
    await challenge.save();

    let user = await User.findOne(query);

    if (!user) {
      user = await User.create({
        mobileNumber: channel === 'mobile' ? value : undefined,
        email: channel === 'email' ? value : undefined,
        name: name?.trim() || 'ToyVenture User',
      });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    if (error.message.includes('Please provide') || error.message.includes('valid')) {
      return res.status(400).json({ message: error.message });
    }

    next(error);
  }
};

module.exports = { sendOtp, verifyOtp };
