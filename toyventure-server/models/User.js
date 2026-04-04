const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    mobileNumber: {
        type: String,
        required: [true, 'Please provide a mobile number'],
        unique: true, 
        trim: true,
        match: [/^\d{10}$/, 'Please provide a valid 10-digit mobile number']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true 
});

const User = mongoose.model('User', userSchema);
module.exports = User;