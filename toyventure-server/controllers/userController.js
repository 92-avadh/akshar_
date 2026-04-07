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
                email: user.email,
                mobileNumber: user.mobileNumber,
                role: user.role, // <-- ADDED: Now the frontend knows the role
                addresses: user.addresses,
                cart: user.cart,         // <-- ADDED: Return Cloud Cart
                wishlist: user.wishlist  // <-- ADDED: Return Cloud Wishlist
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

            // SILENT SYNC: Save Cart & Wishlist to Database
            if (req.body.cart !== undefined) user.cart = req.body.cart;
            if (req.body.wishlist !== undefined) user.wishlist = req.body.wishlist;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                mobileNumber: updatedUser.mobileNumber,
                role: updatedUser.role, // <-- ADDED: Keep role synced on update
                addresses: updatedUser.addresses,
                cart: updatedUser.cart,
                wishlist: updatedUser.wishlist
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error updating profile' });
    }
};

// @desc    Get all users (with order stats)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.aggregate([
            {
                $lookup: {
                    from: 'orders',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'orders'
                }
            },
            {
                $addFields: {
                    orderCount: { $size: "$orders" },
                    totalSpend: { 
                        $reduce: { 
                            input: "$orders", 
                            initialValue: 0, 
                            in: { 
                                $add: [
                                    "$$value", 
                                    { $cond: [
                                        { $or: [
                                            { $eq: ["$$this.paymentStatus", "paid"] },
                                            { $eq: ["$$this.paymentMethod", "cod"] }
                                        ]}, 
                                        "$$this.totalPrice", 
                                        0
                                    ]}
                                ] 
                            }
                        } 
                    }
                }
            },
            {
                $project: {
                    password: 0,
                    cart: 0,
                    wishlist: 0,
                    orders: 0
                }
            },
            { $sort: { createdAt: -1 } }
        ]);
        res.json(users);
    } catch (error) {
        console.error('Fetch All Users Error:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};

// @desc    Toggle User Ban Status
// @route   PUT /api/users/:id/ban
// @access  Private/Admin
const toggleUserBanStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            // Protect against banning yourself
            if (user._id.toString() === req.user._id.toString()) {
                return res.status(400).json({ message: 'You cannot ban yourself.' });
            }
            user.isBanned = !user.isBanned;
            await user.save();
            res.json({ message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully.` });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error updating user ban status' });
    }
};

// @desc    Update User Role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            // Protect against demoting yourself to prevent an empty admin dashboard lock
            if (user._id.toString() === req.user._id.toString()) {
                return res.status(400).json({ message: 'You cannot change your own role.' });
            }
            user.role = user.role === 'admin' ? 'user' : 'admin';
            await user.save();
            res.json({ message: `User promoted to ${user.role}.` });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error updating user role' });
    }
};

module.exports = { getUserProfile, updateUserProfile, getAllUsers, toggleUserBanStatus, updateUserRole };