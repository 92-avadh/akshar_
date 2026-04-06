const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // Link the order to the authenticated user
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    orderItems: [
        {
            title: { type: String }, // Make sure this matches your cart item properties
            qty: { type: Number, required: true },
            img: { type: String },
            price: { type: Number, required: true },
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            }
        }
    ],
    shippingDetails: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        flatNumber: { type: String, required: true },
        street: { type: String, required: true },
        landmark: { type: String }, // Left optional 
        city: { type: String, required: true },
        pincode: { type: String, required: true },
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    currency: {
        type: String,
        default: 'INR'
    },
    paymentMethod: {
        type: String,
        enum: ['razorpay', 'manual'],
        default: 'razorpay'
    },
    orderStatus: {
        type: String,
        enum: ['created', 'pending_payment', 'paid', 'fulfilled', 'refunded', 'cancelled', 'payment_review'],
        default: 'created'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    idempotencyKey: {
        type: String,
        trim: true
    },
    inventoryCommitted: {
        type: Boolean,
        default: false
    },
    inventoryIssue: {
        type: String,
        default: null
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    paidAt: {
        type: Date
    },
    paymentFailureReason: {
        type: String,
        default: null
    },
    razorpay: {
        orderId: { type: String, default: null },
        paymentId: { type: String, default: null },
        signature: { type: String, default: null },
        receipt: { type: String, default: null },
        refundId: { type: String, default: null },
        amount: { type: Number, default: null },
        lastWebhookEvent: { type: String, default: null },
        lastWebhookAt: { type: Date, default: null }
    },
    // NEW FIELDS FOR ADMIN PANEL
    isDelivered: {
        type: Boolean,
        required: true,
        default: false
    },
    deliveredAt: {
        type: Date
    }
}, { timestamps: true });

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ user: 1, idempotencyKey: 1 }, { unique: true, sparse: true });
orderSchema.index({ 'razorpay.orderId': 1 }, { unique: true, sparse: true });
orderSchema.index({ 'razorpay.paymentId': 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Order', orderSchema);
