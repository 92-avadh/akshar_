const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  createDemoOrder,
  verifyRazorpayPayment,
  handleRazorpayWebhook,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/razorpay/order', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);
router.post('/razorpay/webhook', handleRazorpayWebhook);

// NEW: Demo Payment Route for testing bypassing Razorpay
router.post('/demo', protect, createDemoOrder);

module.exports = router;
