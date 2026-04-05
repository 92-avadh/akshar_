const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProductReview } = require('../controllers/productController');

// Route to get all products
router.route('/').get(getProducts);

// Route to get a single product by ID
router.route('/:id').get(getProductById);

// NEW: Route to add a review
router.route('/:id/reviews').post(createProductReview);

module.exports = router;