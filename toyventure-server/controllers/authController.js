const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ==========================================
// IN-MEMORY OTP STORE (Perfect for testing!)
// ==========================================
const otpStore = new Map();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Send OTP to mobile number or email
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res) => {
    const { mobileNumber, email } = req.body;

    const identifier = mobileNumber || email;

    if (!identifier) {
        return res.status(400).json({ message: 'Please provide an email or mobile number.' });
    }

    if (mobileNumber) {
        const strMobile = String(mobileNumber);
        if (strMobile.length !== 10) {
            return res.status(400).json({ message: 'Please provide a valid 10-digit number.' });
        }
    }

    // NEW: Check if this user already exists in the database
    let query = {};
    if (mobileNumber) query.mobileNumber = String(mobileNumber);
    if (email) query.email = email;
    const existingUser = await User.findOne(query);

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(identifier, generatedOtp);

    console.log(`\n=========================================`);
    console.log(`🔔 OTP MOCK DELIVERY`);
    console.log(`To: ${mobileNumber ? '+91 ' + mobileNumber : email}`);
    console.log(`Message: Your ToyVenture verification code is: ${generatedOtp}`);
    console.log(`=========================================\n`);

    res.json({ 
        message: `OTP successfully sent to ${identifier}`,
        isNewUser: !existingUser // <-- Tells the frontend if we need to ask for their name!
    });
};

// @desc    Verify OTP & Login/Register User
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
    const { mobileNumber, email, otp, name } = req.body;
    
    const identifier = mobileNumber || email;
    const storedOtp = otpStore.get(identifier);

    if (!storedOtp || storedOtp !== String(otp)) {
        return res.status(401).json({ message: 'Invalid or expired OTP code.' });
    }

    otpStore.delete(identifier);

    try {
        let query = {};
        if (mobileNumber) query.mobileNumber = String(mobileNumber);
        if (email) query.email = email;

        let user = await User.findOne(query);

        // If they don't exist, create an account WITH their newly provided name
        if (!user) {
            user = await User.create({ 
                mobileNumber: mobileNumber ? String(mobileNumber) : undefined,
                email: email || undefined,
                name: name || 'ToyVenture User' 
            });
        }

        res.status(200).json({
            _id: user._id,
            name: user.name, // Returning the captured name back to Redux/LocalStorage
            email: user.email,
            mobileNumber: user.mobileNumber,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error("Auth Error:", error);
        res.status(500).json({ message: 'Server error during authentication.' });
    }
};

module.exports = { sendOtp, verifyOtp };