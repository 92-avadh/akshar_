const Product = require('../models/Product');

// Get all products (You probably already have this)
// Get all products with Search, Filter, and Pagination
const getProducts = async (req, res) => {
    try {
        // 1. Pagination Setup
        const pageSize = Number(req.query.limit) || 12; // Default to 12 products per page
        const page = Number(req.query.page) || 1;

        // 2. Search by Keyword (matches the title)
        const keyword = req.query.keyword ? {
            title: {
                $regex: req.query.keyword,
                $options: 'i', // Case-insensitive search
            },
        } : {};

        // 3. Filter by Tag (Category)
        const tag = req.query.tag ? { tag: req.query.tag } : {};

        // Combine the search keyword and the tag filter
        const queryFilter = { ...keyword, ...tag };

        // 4. Count total matching products (needed for frontend pagination logic)
        const count = await Product.countDocuments(queryFilter);

        // 5. Fetch the actual products with limits and skips
        const products = await Product.find(queryFilter)
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        // 6. Send back the products PLUS the pagination metadata
        res.json({
            products,
            page,
            pages: Math.ceil(count / pageSize),
            totalProducts: count
        });

    } catch (error) {
        console.error("Fetch Products Error:", error);
        res.status(500).json({ message: "Server Error: Could not fetch products" });
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