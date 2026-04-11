const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OtpChallenge = require('../models/OtpChallenge');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// @desc    Register a new user (Email/Password)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, mobileNumber, password } = req.body;

    if (!email && !mobileNumber) {
      res.status(400);
      return next(new Error('Please provide an email or mobile number'));
    }

    const query = [];
    if (email) query.push({ email });
    if (mobileNumber) query.push({ mobileNumber });

    const userExists = await User.findOne({ $or: query });

    if (userExists) {
      res.status(400);
      return next(new Error('User already exists'));
    }

    const user = await User.create({
      name,
      email,
      mobileNumber,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      next(new Error('Invalid user data'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token (Email/Password)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      res.status(400);
      return next(new Error('Please provide identifier and password'));
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { mobileNumber: identifier }],
    }).select('+password');

    if (user && user.isBanned) {
      res.status(403);
      return next(new Error('Your account has been banned. Please contact support.'));
    }

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      next(new Error('Invalid credentials'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Initiate OTP login/registration
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res, next) => {
  try {
    const { email, mobileNumber } = req.body;

    if (!email && !mobileNumber) {
      res.status(400);
      return next(new Error('Email or mobile number required for OTP'));
    }

    const identifierKey = email || mobileNumber;
    const channel = email ? 'email' : 'mobile';
    const otp = generateOtp();

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    const resendAvailableAt = new Date();
    resendAvailableAt.setMinutes(resendAvailableAt.getMinutes() + 1);

    const maskedRecipient = email
      ? email.replace(/(.{2})(.*)(?=@)/, (gp1, gp2, gp3) => gp2 + '*'.repeat(gp3.length))
      : mobileNumber.replace(/.(?=.{4})/g, '*');

    const otpHash = otp;

    await OtpChallenge.findOneAndUpdate(
      { identifierKey },
      {
        identifierKey,
        channel,
        otpHash,
        expiresAt,
        resendAvailableAt,
        maskedRecipient,
        isUsed: false,
        attempts: 0,
      },
      { upsert: true, new: true }
    );

    if (channel === 'email') {
      try {
        await sendEmail({
          email: identifierKey,
          subject: 'Your ToyBlix Verification Code',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;">
              <h2 style="color: #18181b;">ToyBlix Verification</h2>
              <p style="color: #52525b; font-size: 16px;">Here is your One-Time Password (OTP) to access your account:</p>
              <div style="background-color: #f4f4f5; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
                <strong style="font-size: 32px; letter-spacing: 5px; color: #f97316;">${otp}</strong>
              </div>
              <p style="color: #52525b; font-size: 14px;">This code will expire in 10 minutes.</p>
            </div>
          `,
        });
        console.log(`📧 OTP Email successfully sent to: ${identifierKey}`);
      } catch (emailError) {
        console.error('Failed to send OTP email:', emailError);
        return next(new Error('Failed to send OTP email. Please check your email configuration.'));
      }
    } else {
      // Disabled 2Factor implementation, outputting to terminal instead
      console.log(`\n========================================`);
      console.log(`📱 DEVELOPMENT SMS OTP SIMULATION`);
      console.log(`To: ${identifierKey}`);
      console.log(`OTP: ${otp}`);
      console.log(`========================================\n`);
    }

    res.status(200).json({
      message: channel === 'email' ? 'OTP sent to your email' : 'OTP sent successfully',
      expiresIn: 600,
      channel,
      env: process.env.NODE_ENV,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP and issue token
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res, next) => {
  try {
    const { email, mobileNumber, otp } = req.body;

    if (!otp) {
      res.status(400);
      return next(new Error('OTP is required'));
    }

    const identifierKeyRaw = email || mobileNumber;

    if (!identifierKeyRaw) {
      res.status(400);
      return next(new Error('Email or mobile number is required'));
    }

    const identifierKey = String(identifierKeyRaw).trim();
    const incomingOtp = String(otp).trim();

    const challenge = await OtpChallenge.findOne({ identifierKey });

    console.log(`\n--- OTP Verification Check ---`);
    console.log(`Looking for user: "${identifierKey}"`);
    if (!challenge) {
      console.log(`❌ Challenge not found in DB`);
    } else {
      console.log(`DB OTP: "${challenge.otpHash}"`);
      console.log(`Req OTP: "${incomingOtp}"`);
      console.log(`Expired?: ${challenge.expiresAt < new Date()}`);
    }
    console.log(`------------------------------\n`);

    if (!challenge || challenge.otpHash !== incomingOtp || challenge.expiresAt < new Date()) {
      res.status(401);
      return next(new Error('Invalid or expired OTP'));
    }

    await OtpChallenge.deleteOne({ _id: challenge._id });

    let user = await User.findOne({
      $or: [{ email: identifierKey }, { mobileNumber: identifierKey }],
    });

    if (user && user.isBanned) {
      res.status(403);
      return next(new Error('Your account has been banned. Please contact support.'));
    }

    if (!user) {
      user = await User.create({
        email: email || undefined,
        mobileNumber: mobileNumber || undefined,
        role: 'user',
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber,
      role: user.role,
      token: generateToken(user._id),
      isNewUser: !user.name,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  sendOtp,
  verifyOtp,
};