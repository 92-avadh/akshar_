const Product = require('../models/Product');

// @desc    Fetch all products with Search, Filter, and Pagination
// @route   GET /api/products
// @access  Public
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

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
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

// @desc    Create a Review
// @route   POST /api/products/:id/reviews
// @access  Public / Private (Depends on your auth flow)
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

// ==========================================
// ADMIN ONLY ROUTES
// ==========================================

// @desc    Create a product (Generates a blank template)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const product = new Product({
            title: 'New Magical Toy',
            price: 0,
            user: req.user._id,
            img: 'https://via.placeholder.com/400x400?text=Upload+Image',
            images: [], // NEW: Initialize blank images array
            tag: 'General',
            countInStock: 0,
            numReviews: 0,
            description: 'Enter a magical description here...',
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create product template', error });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const { title, price, description, img, tag, oldPrice, countInStock, images } = req.body; // Added images
        const product = await Product.findById(req.params.id);

        if (product) {
            product.title = title || product.title;
            product.price = price || product.price;
            product.description = description || product.description;
            product.tag = tag || product.tag;
            product.oldPrice = oldPrice || product.oldPrice;
            product.countInStock = countInStock || product.countInStock;
            
            // NEW: Handle images array and fallback main img
            if (images && images.length > 0) {
                product.images = images;
                product.img = images[0]; // Set cover image to first uploaded
            } else {
                product.img = img || product.img;
            }

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update product', error });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await Product.deleteOne({ _id: product._id });
            res.json({ message: 'Product completely removed from store' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete product', error });
    }
};

module.exports = { 
    getProducts, 
    getProductById, 
    createProductReview,
    createProduct, 
    updateProduct, 
    deleteProduct 
};