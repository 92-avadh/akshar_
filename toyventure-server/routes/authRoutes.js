const express = require('express');
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const router = express.Router();
const { sendOtp, verifyOtp } = require('../controllers/authController');

const buildRateLimitKey = (req) => {
  const identifier = String(req.body?.mobileNumber || req.body?.email || 'unknown').trim().toLowerCase();
  return `${ipKeyGenerator(req.ip)}:${identifier}`;
};

const otpSendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: buildRateLimitKey,
  message: { message: 'Too many OTP requests. Please try again later.' },
});

const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: buildRateLimitKey,
  message: { message: 'Too many OTP verification attempts. Please try again later.' },
});

router.post('/send-otp', otpSendLimiter, sendOtp);
router.post('/verify-otp', otpVerifyLimiter, verifyOtp);
router.post('/otp/send', otpSendLimiter, sendOtp);
router.post('/otp/verify', otpVerifyLimiter, verifyOtp);

module.exports = router;
