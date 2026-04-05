const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Changed from Public)
const createOrder = async (req, res) => {
    try {
        const { orderItems, shippingDetails, totalPrice } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items provided' });
        }

        const order = new Order({
            user: req.user._id, // NEW: Attach the logged-in user's ID
            orderItems,
            shippingDetails,
            totalPrice,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);

    } catch (error) {
        console.error("Order Error:", error);
        res.status(500).json({ message: 'Server error: Failed to create order' });
    }
};

module.exports = { createOrder };