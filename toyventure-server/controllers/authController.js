const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ==========================================
// IN-MEMORY OTP STORE (Perfect for testing!)
// ==========================================
const otpStore = new Map();

// Helper function to generate the secure JWT token
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

    // Figure out which identifier the user is using
    const identifier = mobileNumber || email;

    if (!identifier) {
        return res.status(400).json({ message: 'Please provide an email or mobile number.' });
    }

    // Safely check length by forcing it to a String first (fixes the undefined length bug!)
    if (mobileNumber) {
        const strMobile = String(mobileNumber);
        if (strMobile.length !== 10) {
            return res.status(400).json({ message: 'Please provide a valid 10-digit number.' });
        }
    }

    // 1. Generate a random 6-digit OTP to match the frontend (e.g., 583921)
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Save it in our temporary store linked to their email or phone
    otpStore.set(identifier, generatedOtp);

    // 3. LOG TO TERMINAL FOR LOCAL TESTING
    console.log(`\n=========================================`);
    console.log(`🔔 OTP MOCK DELIVERY`);
    console.log(`To: ${mobileNumber ? '+91 ' + mobileNumber : email}`);
    console.log(`Message: Your ToyVenture verification code is: ${generatedOtp}`);
    console.log(`=========================================\n`);

    res.json({ message: `OTP successfully sent to ${identifier}` });
};

// @desc    Verify OTP & Login/Register User
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
    const { mobileNumber, email, otp, name, isRegister } = req.body;
    
    const identifier = mobileNumber || email;

    // 1. Retrieve the saved OTP from our temporary store
    const storedOtp = otpStore.get(identifier);

    // 2. Check if the OTP exists and matches what the user typed (force both to strings to be safe)
    if (!storedOtp || storedOtp !== String(otp)) {
        return res.status(401).json({ message: 'Invalid or expired OTP code.' });
    }

    // 3. OTP is correct! Delete it from memory so it cannot be reused.
    otpStore.delete(identifier);

    try {
        // 4. Build the query to check if user exists by either phone or email
        let query = {};
        if (mobileNumber) query.mobileNumber = String(mobileNumber);
        if (email) query.email = email;

        let user = await User.findOne(query);

        // 5. If they don't exist, create a brand new account for them
        if (!user) {
            user = await User.create({ 
                mobileNumber: mobileNumber ? String(mobileNumber) : undefined,
                email: email || undefined,
                name: name || 'ToyVenture User' // Fallback name if they didn't provide one
            });
        }

        // 6. Send back the user data AND the secure token
        res.status(200).json({
            _id: user._id,
            name: user.name,
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