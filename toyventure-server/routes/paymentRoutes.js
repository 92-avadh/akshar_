const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  handleRazorpayWebhook,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/razorpay/order', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);
router.post('/razorpay/webhook', handleRazorpayWebhook);

module.exports = router;
