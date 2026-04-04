import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    mobileNumber: {
        type: String,
        required: [true, 'Please provide a mobile number'],
        unique: true, // No two users can have the same number
        trim: true,
        match: [/^\d{10}$/, 'Please provide a valid 10-digit mobile number'] // Ensures exactly 10 digits
    },
    // We can add more fields later (like name, addresses) during checkout!
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt dates
});

const User = mongoose.model('User', userSchema);

export default User;