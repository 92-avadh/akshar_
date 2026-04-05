const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { orderItems, shippingDetails, totalPrice } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items provided' });
        }

        const order = new Order({
            user: req.user._id, // Attach the logged-in user's ID
            orderItems,
            shippingDetails,
            totalPrice,
            isPaid: true // Assuming paid for now via checkout
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);

    } catch (error) {
        console.error("Order Error:", error);
        res.status(500).json({ message: 'Server error: Failed to create order' });
    }
};

// ==========================================
// NEW: Fetch user's order history
// ==========================================
// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        // Find all orders where the 'user' matches the logged-in user's ID
        // .sort({ createdAt: -1 }) ensures the newest orders show up first
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error("Fetch Orders Error:", error);
        res.status(500).json({ message: 'Server error: Failed to fetch orders' });
    }
};

module.exports = { createOrder, getMyOrders };