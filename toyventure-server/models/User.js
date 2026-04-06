const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [false, 'Name is optional initially'],
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
  },
  mobileNumber: {
    type: String,
    unique: true,
    sparse: true,
    match: [/^[0-9]{10,15}$/, 'Please use a valid mobile number'],
  },
  password: {
    type: String,
    select: false, 
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  addresses: [{
    flatNumber: String,
    street: String,
    landmark: String,
    city: String,
    pincode: String,
    isDefault: { type: Boolean, default: false }
  }]
}, {
  timestamps: true,
});

// FIX: Added 'next' into the function parameters so it doesn't crash!
userSchema.pre('validate', function validateIdentity(next) {
  if (!this.email && !this.mobileNumber) {
    return next(new Error('Either email or mobile number is required'));
  }
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    next();
  } else {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;