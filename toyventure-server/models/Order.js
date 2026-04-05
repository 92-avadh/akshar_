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
    isPaid: {
        type: Boolean,
        required: true,
        default: false
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

module.exports = mongoose.model('Order', orderSchema);