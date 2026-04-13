const express = require('express');
const rateLimit = require('express-rate-limit');
const { auth, isAdmin } = require('../middleware/auth');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const router = express.Router();

// @route   GET /api/users
router.get('/', apiLimiter, auth, isAdmin, getUsers);

// @route   GET /api/users/:id
router.get('/:id', apiLimiter, auth, isAdmin, getUserById);

// @route   PUT /api/users/:id
router.put('/:id', apiLimiter, auth, isAdmin, updateUser);

// @route   DELETE /api/users/:id
router.delete('/:id', apiLimiter, auth, isAdmin, deleteUser);

module.exports = router;
