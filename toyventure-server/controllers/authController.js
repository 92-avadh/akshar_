const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate the secure JWT token
const generateToken = (id) => {
    // Uses the secret key you added to your .env file!
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Send OTP to mobile number
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res) => {
    const { mobileNumber } = req.body;

    if (!mobileNumber || mobileNumber.length !== 10) {
        return res.status(400).json({ message: 'Please provide a valid 10-digit number.' });
    }

    // In a real production app, you would call Twilio or MSG91 API here to send an SMS.
    // For now, we simulate success.
    res.json({ message: `OTP successfully sent to ${mobileNumber}` });
};

// @desc    Verify OTP & Login/Register User
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
    const { mobileNumber, otp } = req.body;

    // Simulated OTP check (For development, the magical code is 1234)
    if (otp !== '1234') {
        return res.status(401).json({ message: 'Invalid OTP code.' });
    }

    try {
        // 1. Check if the user already exists in the database
        let user = await User.findOne({ mobileNumber });

        // 2. If they don't exist, create a brand new account for them!
        if (!user) {
            user = await User.create({ mobileNumber });
        }

        // 3. Send back the user data AND the secure token
        res.status(200).json({
            _id: user._id,
            mobileNumber: user.mobileNumber,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during authentication.' });
    }
};

module.exports = { sendOtp, verifyOtp };