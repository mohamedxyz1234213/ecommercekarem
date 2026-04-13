const express = require('express');
const rateLimit = require('express-rate-limit');
const { auth, isAdmin } = require('../middleware/auth');
const { getDashboardStats } = require('../controllers/adminController');

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

module.exports = router;
