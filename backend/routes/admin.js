const express = require('express');
const rateLimit = require('express-rate-limit');
const { auth, isAdmin } = require('../middleware/auth');
const { getDashboardStats, getReviews, deleteReview } = require('../controllers/adminController');
const {
  getContactMessages,
  updateContactMessageReadStatus,
} = require('../controllers/contactMessageController');

const router = express.Router();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// @route   GET /api/admin/dashboard
router.get('/dashboard', apiLimiter, auth, isAdmin, getDashboardStats);

// @route   GET /api/admin/reviews
router.get('/reviews', apiLimiter, auth, isAdmin, getReviews);

// @route   DELETE /api/admin/reviews/:id
router.delete('/reviews/:id', apiLimiter, auth, isAdmin, deleteReview);

// @route   GET /api/admin/contact-messages
router.get('/contact-messages', apiLimiter, auth, isAdmin, getContactMessages);

// @route   PUT /api/admin/contact-messages/:id/read
router.put('/contact-messages/:id/read', apiLimiter, auth, isAdmin, updateContactMessageReadStatus);

module.exports = router;
