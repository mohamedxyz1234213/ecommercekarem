const express = require('express');
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const { auth, isAdmin } = require('../middleware/auth');
const {
  getSettings,
  updateSettings,
  addSocialLink,
  removeSocialLink,
} = require('../controllers/siteSettingsController');

const router = express.Router();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// @route   GET /api/settings (public)
router.get('/', apiLimiter, getSettings);

// @route   PUT /api/settings (admin)
router.put(
  '/',
  apiLimiter,
  auth,
  isAdmin,
  [
    body('heroSubtitle')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Hero subtitle too long'),
    body('heroTitle')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Hero title too long'),
    body('heroTitleHighlight')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Hero title highlight too long'),
    body('heroDescription')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Hero description too long'),
    body('siteName')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Site name too long'),
  ],
  updateSettings
);

// @route   POST /api/settings/social-links (admin)
router.post(
  '/social-links',
  apiLimiter,
  auth,
  isAdmin,
  [
    body('platform').trim().notEmpty().withMessage('Platform is required'),
    body('url').trim().notEmpty().withMessage('URL is required'),
    body('icon').trim().notEmpty().withMessage('Icon is required'),
    body('location').optional().isIn(['navbar', 'footer', 'both']).withMessage('Invalid location'),
  ],
  addSocialLink
);

// @route   DELETE /api/settings/social-links/:linkId (admin)
router.delete('/social-links/:linkId', apiLimiter, auth, isAdmin, removeSocialLink);

module.exports = router;
