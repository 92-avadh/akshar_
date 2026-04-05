const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrders, updateOrderToDelivered } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware'); 

// Protect these routes so only logged-in users can access them
// NEW: GET '/' now fetches all orders for the admin
router.route('/')
    .post(protect, createOrder)
    .get(protect, admin, getOrders); 

router.get('/myorders', protect, getMyOrders);

// NEW: Route for admin to mark order as delivered
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

module.exports = router;