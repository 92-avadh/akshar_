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
    img: { type: String, required: true },
    tag: { type: String },
    
    // NEW REVIEW FIELDS:
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);