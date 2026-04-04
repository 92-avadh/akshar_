const Product = require('../models/Product');

// Get all products (You probably already have this)
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Get single product (You probably already have this)
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// ==========================================
// NEW: Create a Review
// @route POST /api/products/:id/reviews
// ==========================================
const createProductReview = async (req, res) => {
    try {
        const { rating, comment, name } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            // Create the new review object
            const review = {
                name: name || 'Anonymous Guest',
                rating: Number(rating),
                comment,
            };

            // Add it to the array
            product.reviews.push(review);

            // Update the total number of reviews
            product.numReviews = product.reviews.length;

            // Calculate the new average rating
            product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

            // Save to database
            await product.save();
            res.status(201).json({ message: 'Review added successfully!' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add review' });
    }
};

module.exports = { getProducts, getProductById, createProductReview };