const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getAllUsers, toggleUserBanStatus, updateUserRole } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Protect these routes so only logged-in users can view/edit their profile
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// Admin Routes
router.route('/').get(protect, admin, getAllUsers);
router.route('/:id/ban').put(protect, admin, toggleUserBanStatus);
router.route('/:id/role').put(protect, admin, updateUserRole);

module.exports = router;