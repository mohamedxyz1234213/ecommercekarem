const express = require('express');
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const { submitContactMessage } = require('../controllers/contactMessageController');

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  '/',
  contactLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 120 }).withMessage('Name is too long'),
    body('email').trim().isEmail().withMessage('Valid email is required').isLength({ max: 160 }).withMessage('Email is too long'),
    body('subject').optional({ checkFalsy: true }).trim().isLength({ max: 200 }).withMessage('Subject is too long'),
    body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 5000 }).withMessage('Message is too long'),
  ],
  submitContactMessage
);

module.exports = router;
