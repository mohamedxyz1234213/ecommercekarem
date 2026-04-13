const express = require('express');
const { body } = require('express-validator');
const { auth, isAdmin } = require('../middleware/auth');
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  approveInstapay,
} = require('../controllers/orderController');

const router = express.Router();

// @route   POST /api/orders
router.post(
  '/',
  auth,
  [
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.product').notEmpty().withMessage('Product ID is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('shippingAddress.street').trim().notEmpty().withMessage('Street is required'),
    body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
    body('shippingAddress.zipCode').trim().notEmpty().withMessage('Zip code is required'),
    body('shippingAddress.country').trim().notEmpty().withMessage('Country is required'),
    body('paymentMethod').isIn(['paymob', 'instapay']).withMessage('Valid payment method is required'),
  ],
  createOrder
);

// @route   GET /api/orders/my
router.get('/my', auth, getMyOrders);

// @route   GET /api/orders (admin)
router.get('/', auth, isAdmin, getAllOrders);

// @route   GET /api/orders/:id
router.get('/:id', auth, getOrderById);

// @route   PUT /api/orders/:id/status (admin)
router.put('/:id/status', auth, isAdmin, updateOrderStatus);

// @route   PUT /api/orders/:id/approve-instapay (admin)
router.put('/:id/approve-instapay', auth, isAdmin, approveInstapay);

module.exports = router;
