const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    flatNumber: { type: String, required: true },
    street: { type: String, required: true },
    landmark: { type: String },
    city: { type: String, required: true },
    pincode: { type: String, required: true }
});

const userSchema = new mongoose.Schema({
    mobileNumber: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    name: { type: String, default: '' },
    addresses: [addressSchema],
    role: { type: String, default: 'user' }
}, { timestamps: true });

userSchema.pre('validate', function validateIdentity(next) {
    if (!this.mobileNumber && !this.email) {
        this.invalidate('mobileNumber', 'Either mobile number or email is required.');
    }

    next();
});

userSchema.index({ mobileNumber: 1 }, { unique: true, sparse: true });
userSchema.index({ email: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('User', userSchema);
