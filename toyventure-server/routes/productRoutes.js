const express = require('express');
const router = express.Router();
const { getProducts, getProductById } = require('../controllers/productController');

// Route to get all products
router.route('/').get(getProducts);

// Route to get a single product by ID
router.route('/:id').get(getProductById);

module.exports = router;