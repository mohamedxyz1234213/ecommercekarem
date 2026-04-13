const express = require('express');
const { auth, isAdmin } = require('../middleware/auth');
const { getDashboardStats } = require('../controllers/adminController');

const router = express.Router();

// All routes require auth + admin
router.use(auth, isAdmin);

// @route   GET /api/admin/dashboard
router.get('/dashboard', getDashboardStats);

module.exports = router;
