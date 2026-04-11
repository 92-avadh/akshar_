const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const variantSchema = mongoose.Schema({
    color: { type: String },
    size: { type: String },
    description: { type: String },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    countInStock: { type: Number, required: true, default: 0 },
    images: [{ type: String }]
});

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    images: [
      { type: String }
    ],
    tag: {
      type: String,
    },
    category: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    oldPrice: {
      type: Number,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    notifyList: [{
      type: String
    }],
    variants: [variantSchema] 
  },
  {
    timestamps: true,
  }
);

// ==========================================
// PRODUCTION PERFORMANCE INDEXES
// ==========================================
// 1. Text Index: Allows lightning-fast full-text search instead of slow $regex
productSchema.index({ title: 'text', description: 'text', tag: 'text', category: 'text' });

// 2. Standard Indexes: Optimizes sorting and filtering by price, rating, and creation date
productSchema.index({ price: 1, rating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ tag: 1, category: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;