const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware'); 

// Protect these routes so only logged-in users can access them
router.post('/', protect, createOrder);

// NEW: Route to get user's orders
router.get('/myorders', protect, getMyOrders);

module.exports = router;