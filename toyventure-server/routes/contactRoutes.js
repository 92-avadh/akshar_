const express = require('express');
const Contact = require('../models/Contact');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/contact - Public route for users to submit messages
router.post('/', async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = await Contact.create({ name, email, message });
    res.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
});

// GET /api/contact - Admin ONLY route to read messages
router.get('/', protect, admin, async (req, res, next) => {
  try {
    const messages = await Contact.find({}).sort({ createdAt: -1 }); // Newest first
    res.json(messages);
  } catch (error) {
    next(error);
  }
});

module.exports = router;