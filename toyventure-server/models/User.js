const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    flatNumber: { type: String, required: true },
    street: { type: String, required: true },
    landmark: { type: String },
    city: { type: String, required: true },
    pincode: { type: String, required: true }
});

const userSchema = new mongoose.Schema({
    mobileNumber: { type: String, required: true, unique: true },
    name: { type: String, default: '' },
    addresses: [addressSchema],
    role: { type: String, default: 'user' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);