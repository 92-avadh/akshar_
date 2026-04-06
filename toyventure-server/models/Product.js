const mongoose = require('mongoose');

// 1. Create a Schema specifically for individual reviews
const reviewSchema = mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
}, { timestamps: true });

// 2. Update your main Product Schema
const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    discount: { type: String },
    clubPrice: { type: Number },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    img: { type: String, required: true },
    images: [{ type: String }], // NEW: Added images array for max 7 files
    tag: { type: String },
    category: { type: String },
    countInStock: { type: Number, required: true, default: 0, min: 0 },
    
    // NEW REVIEW FIELDS:
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    
}, { timestamps: true });

productSchema.index({ title: 'text', tag: 1, category: 1 });

module.exports = mongoose.model('Product', productSchema);
