const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    res.status(400).json({
        message: 'Direct order creation is disabled. Start checkout through Razorpay order creation.',
    });
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error("Fetch Orders Error:", error);
        res.status(500).json({ message: 'Server error: Failed to fetch orders' });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        // Fetch all orders and attach the user's basic info
        const orders = await Order.find({}).populate('user', 'name mobileNumber').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch all orders' });
    }
};

// @desc    Update order status progressively
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            const { status, courierName, trackingLink } = req.body;
            
            // Validate sequence to prevent regressions if needed, though admin has authority
            const validStatuses = ['paid', 'confirmed', 'packed', 'dispatched', 'delivered', 'cancelled'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: 'Invalid order status provided.' });
            }

            order.orderStatus = status;

            // Record status timestamps
            if (!order.statusTimestamps) order.statusTimestamps = {};
            const timestampMap = {
                confirmed: 'confirmedAt',
                packed: 'packedAt',
                dispatched: 'dispatchedAt',
                delivered: 'deliveredAt',
            };
            if (timestampMap[status]) {
                order.statusTimestamps[timestampMap[status]] = new Date();
            }

            // Save courier details on dispatch
            if (status === 'dispatched' && (courierName || trackingLink)) {
                order.courier = {
                    name: courierName || null,
                    trackingLink: trackingLink || null,
                };
            }

            // Deliver triggers final flags
            if (status === 'delivered') {
                order.isDelivered = true;
                order.deliveredAt = Date.now();
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update order status' });
    }
};

module.exports = { createOrder, getMyOrders, getOrders, updateOrderStatus };
