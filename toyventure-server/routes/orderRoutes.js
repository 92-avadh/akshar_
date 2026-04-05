const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware'); // Import middleware

// Protect this route!
router.post('/', protect, createOrder);

module.exports = router;