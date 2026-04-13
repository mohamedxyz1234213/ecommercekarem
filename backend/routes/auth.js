const express = require('express');
const { body } = require('express-validator');
const passport = require('passport');
const { auth } = require('../middleware/auth');
const {
  register,
  login,
  getMe,
  googleCallback,
  logout,
} = require('../controllers/authController');

const router = express.Router();

// @route   POST /api/auth/register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  register
);

// @route   POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

// @route   GET /api/auth/me
router.get('/me', auth, getMe);

// @route   GET /api/auth/google
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// @route   GET /api/auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  googleCallback
);

// @route   POST /api/auth/logout
router.post('/logout', logout);

module.exports = router;
