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

// All routes require auth + admin
router.use(auth, isAdmin, apiLimiter);

// @route   GET /api/admin/dashboard
router.get('/dashboard', getDashboardStats);

module.exports = router;
