const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ==========================================
// IN-MEMORY OTP STORE (Perfect for testing!)
// ==========================================
// Note: In a massive production app, you would use Redis or save this to MongoDB 
// so the OTPs survive if the server restarts. But Map() is perfect for now.
const otpStore = new Map();

// Helper function to generate the secure JWT token
const generateToken = (id) => {
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

    // 1. Generate a random 4-digit OTP (e.g., 5839)
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // 2. Save it in our temporary store linked to their mobile number
    otpStore.set(mobileNumber, generatedOtp);

    // 3. LOG TO TERMINAL FOR LOCAL TESTING
    console.log(`\n=========================================`);
    console.log(`🔔 SMS / WHATSAPP MOCK DELIVERY`);
    console.log(`To: +91 ${mobileNumber}`);
    console.log(`Message: Your ToyVenture verification code is: ${generatedOtp}`);
    console.log(`=========================================\n`);

    // 4. REAL SMS/WHATSAPP INTEGRATION GOES HERE
    // When you are ready for real messages, you will use a service like Twilio:
    /*
    const twilioClient = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
    
    try {
        await twilioClient.messages.create({
            body: `Your ToyVenture verification code is ${generatedOtp}`,
            from: process.env.TWILIO_PHONE_NUMBER, // Or 'whatsapp:+14155238886' for WhatsApp
            to: `+91${mobileNumber}`               // Or `whatsapp:+91${mobileNumber}` for WhatsApp
        });
    } catch (error) {
        console.error("Failed to send real SMS:", error);
        return res.status(500).json({ message: "Failed to send SMS." });
    }
    */

    res.json({ message: `OTP successfully sent to ${mobileNumber}` });
};

// @desc    Verify OTP & Login/Register User
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
    const { mobileNumber, otp } = req.body;

    // 1. Retrieve the saved OTP from our temporary store
    const storedOtp = otpStore.get(mobileNumber);

    // 2. Check if the OTP exists and matches what the user typed
    if (!storedOtp || storedOtp !== otp) {
        return res.status(401).json({ message: 'Invalid or expired OTP code.' });
    }

    // 3. OTP is correct! Delete it from memory so it cannot be reused.
    otpStore.delete(mobileNumber);

    try {
        // 4. Check if the user already exists in the database
        let user = await User.findOne({ mobileNumber });

        // 5. If they don't exist, create a brand new account for them
        if (!user) {
            user = await User.create({ mobileNumber });
        }

        // 6. Send back the user data AND the secure token
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