const express = require('express');
const { body } = require('express-validator');
const passport = require('passport');
const rateLimit = require('express-rate-limit');
const { auth } = require('../middleware/auth');
const {
  register,
  login,
  getMe,
  googleCallback,
  logout,
} = require('../controllers/authController');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { message: 'Too many attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// @route   POST /api/auth/register
router.post(
  '/register',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/[a-z]/)
      .withMessage('Password must contain at least one lowercase letter')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/\d/)
      .withMessage('Password must contain at least one number')
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage('Password must contain at least one special character'),
  ],
  register
);

// @route   POST /api/auth/login
router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

// @route   GET /api/auth/me
router.get('/me', authLimiter, auth, getMe);

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
