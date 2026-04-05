const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                mobileNumber: user.mobileNumber,
                role: user.role, // <-- ADDED: Now the frontend knows the role
                addresses: user.addresses,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            
            if (req.body.addresses) {
                if (req.body.addresses.length > 3) {
                    return res.status(400).json({ message: 'Maximum of 3 addresses allowed.' });
                }
                user.addresses = req.body.addresses;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                mobileNumber: updatedUser.mobileNumber,
                role: updatedUser.role, // <-- ADDED: Keep role synced on update
                addresses: updatedUser.addresses,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error updating profile' });
    }
};

module.exports = { getUserProfile, updateUserProfile };