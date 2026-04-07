const express = require('express');
const router = express.Router();
const { 
    getProducts, 
    getProductById, 
    createProductReview,
    deleteProductReview,
    notifyMeWhenAvailable, // Import new hook
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Route to get all products (Public) AND create a new product (Admin Only)
router.route('/')
    .get(getProducts)
    .post(protect, admin, createProduct);

// Route to get single product (Public), Update (Admin Only), and Delete (Admin Only)
router.route('/:id')
    .get(getProductById)
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);

// Route to add a review (Must be Logged In to Verify)
router.route('/:id/reviews').post(protect, createProductReview);

// Route to delete a review (Admin Moderation)
router.route('/:id/reviews/:reviewId').delete(protect, admin, deleteProductReview);

// NEW: Notify Me Waitlist Route (Public)
router.route('/:id/notify').post(notifyMeWhenAvailable);

module.exports = router;