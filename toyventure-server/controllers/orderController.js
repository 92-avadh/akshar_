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
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            const { status, courierName, trackingLink } = req.body;
            
            // Validate sequence to prevent regressions if needed, though admin has authority
            const validStatuses = ['paid', 'confirmed', 'packed', 'dispatched', 'delivered', 'cancelled'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: 'Invalid order status provided.' });
            }

            // Check if we are freshly dispatching this order to send email
            const isFreshlyDispatched = status === 'dispatched' && order.orderStatus !== 'dispatched';

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

            // SEND DISPATCH EMAIL
            if (isFreshlyDispatched && order.user && order.user.email) {
                const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
                const courierText = order.courier?.name ? `via <strong>${order.courier.name}</strong>` : '';
                const trackingBtn = order.courier?.trackingLink ? `
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="${order.courier.trackingLink}" target="_blank" style="background-color: #f97316; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                            Track Your Order
                        </a>
                    </div>
                ` : '';

                sendEmail({
                    email: order.user.email,
                    subject: `Your ToyBlix Order has been Dispatched! 🚚`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;">
                            <h2 style="color: #18181b;">It's on the way! 🚚</h2>
                            <p style="color: #52525b; font-size: 16px; line-height: 1.5;">
                                Hi ${order.user.name}, your order <strong>#${String(order._id).slice(-8).toUpperCase()}</strong> has been dispatched ${courierText}.
                            </p>
                            <p style="color: #52525b; font-size: 16px;">It will be magically arriving at your doorstep very soon!</p>
                            ${trackingBtn}
                            <div style="text-align: center; margin-top: 20px;">
                                <a href="${clientUrl}/profile" style="color: #f97316; text-decoration: none; font-weight: bold; font-size: 14px;">
                                    View Full Details on ToyBlix
                                </a>
                            </div>
                        </div>
                    `
                }).catch(err => console.error("Failed to send dispatch email:", err));
            }

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update order status' });
    }
};

module.exports = { createOrder, getMyOrders, getOrders, updateOrderStatus };
