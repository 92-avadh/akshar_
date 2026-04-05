const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { orderItems, shippingDetails, totalPrice } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items provided' });
        }

        // 1. Validate Stock Before Proceeding
        for (const item of orderItems) {
            const product = await Product.findById(item._id || item.product);
            
            if (!product) {
                return res.status(404).json({ message: `Product ${item.title} not found.` });
            }
            
            if (product.countInStock < item.qty) {
                return res.status(400).json({ 
                    message: `Insufficient stock for ${product.title}. Only ${product.countInStock} left.` 
                });
            }
        }

        // 2. Deduct Stock from Inventory
        for (const item of orderItems) {
            const product = await Product.findById(item._id || item.product);
            product.countInStock -= item.qty;
            await product.save();
        }

        // 3. Create the Order
        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingDetails,
            totalPrice,
            isPaid: true 
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);

    } catch (error) {
        console.error("Order Error:", error);
        res.status(500).json({ message: 'Server error: Failed to create order' });
    }
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

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update order status' });
    }
};

module.exports = { createOrder, getMyOrders, getOrders, updateOrderToDelivered };