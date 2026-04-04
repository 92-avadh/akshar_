const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: String, required: true }, // e.g., "₹1,199.00"
  oldPrice: { type: String }, // e.g., "₹1,999.00"
  discount: { type: String }, // e.g., "[40% OFF]"
  clubPrice: { type: String }, // e.g., "₹1,139.00"
  img: { type: String, required: true },
  tag: { type: String }, // e.g., "Diecast"
  category: { type: String, required: true },
  countInStock: { type: Number, required: true, default: 0 },
  description: { type: String },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;