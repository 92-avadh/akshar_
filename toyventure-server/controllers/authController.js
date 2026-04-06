const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OtpChallenge = require('../models/OtpChallenge');

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
    const { email, mobileNumber, purpose = 'login' } = req.body;

    if (!email && !mobileNumber) {
      res.status(400);
      return next(new Error('Email or mobile number required for OTP'));
    }

    const identifier = email || mobileNumber;
    const otp = generateOtp();

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); 

    await OtpChallenge.findOneAndUpdate(
      { identifier, purpose },
      { identifier, purpose, otp, expiresAt },
      { upsert: true, new: true }
    );

    // FIX: Clean, readable plain text OTP!
    console.log(`\n=========================================`);
    console.log(`🔑 MOCK OTP GENERATED FOR: ${identifier}`);
    console.log(`🔢 YOUR OTP IS: ${otp}`);
    console.log(`=========================================\n`);

    res.status(200).json({
      message: 'OTP sent successfully',
      expiresIn: 600, 
      channel: email ? 'email' : 'mobile',
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
    const { email, mobileNumber, otp, purpose = 'login' } = req.body;

    if (!otp) {
      res.status(400);
      return next(new Error('OTP is required'));
    }

    const identifier = email || mobileNumber;

    if (!identifier) {
      res.status(400);
      return next(new Error('Email or mobile number is required'));
    }

    const challenge = await OtpChallenge.findOne({ identifier, purpose });

    if (!challenge || challenge.otp !== otp || challenge.expiresAt < new Date()) {
      res.status(401);
      return next(new Error('Invalid or expired OTP'));
    }

    await OtpChallenge.deleteOne({ _id: challenge._id });

    let user = await User.findOne({
      $or: [{ email: identifier }, { mobileNumber: identifier }],
    });

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