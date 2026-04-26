const express = require('express');
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const { auth, isAdmin, optionalAuth } = require('../middleware/auth');
const { uploadInstapayProof } = require('../middleware/upload');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const {
  createOrder,
  submitInstapayProof,
  trackOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  approveInstapay,
  rejectInstapay,
} = require('../controllers/orderController');

const router = express.Router();

// @route   POST /api/orders (supports both authenticated and guest users)
router.post(
  '/',
  apiLimiter,
  optionalAuth,
  [
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.product').notEmpty().withMessage('Product ID is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('shippingAddress.street').trim().notEmpty().withMessage('Street is required'),
    body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
    body('shippingAddress.zipCode').trim().notEmpty().withMessage('Zip code is required'),
    body('shippingAddress.country').trim().notEmpty().withMessage('Country is required'),
    body('paymentMethod').isIn(['instapay', 'cod']).withMessage('Valid payment method is required'),
    body('email').trim().isEmail().withMessage('Valid email is required'),
  ],
  createOrder
);

// @route   POST /api/orders/:id/instapay-proof (optionalAuth — guests verify by email)
router.post('/:id/instapay-proof', apiLimiter, optionalAuth, (req, res) => {
  uploadInstapayProof(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
      }
      return res.status(400).json({ message: err.message });
    }
    return submitInstapayProof(req, res);
  });
});

// @route   GET /api/orders/track/:id (public — verifies by email query param)
router.get('/track/:id', apiLimiter, trackOrder);

// @route   GET /api/orders/my
router.get('/my', apiLimiter, auth, getMyOrders);

// @route   GET /api/orders (admin)
router.get('/', apiLimiter, auth, isAdmin, getAllOrders);

// @route   GET /api/orders/:id
router.get('/:id', apiLimiter, auth, getOrderById);

// @route   PUT /api/orders/:id/status (admin)
router.put('/:id/status', apiLimiter, auth, isAdmin, updateOrderStatus);

// @route   PUT /api/orders/:id/approve-instapay (admin)
router.put('/:id/approve-instapay', apiLimiter, auth, isAdmin, approveInstapay);

// @route   PUT /api/orders/:id/reject-instapay (admin)
router.put('/:id/reject-instapay', apiLimiter, auth, isAdmin, rejectInstapay);

module.exports = router;
