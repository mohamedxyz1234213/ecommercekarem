const express = require('express');
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const { auth, isAdmin } = require('../middleware/auth');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
  getProductReviews,
} = require('../controllers/productController');

const router = express.Router();

// @route   GET /api/products
router.get('/', apiLimiter, getProducts);

// @route   GET /api/products/:id
router.get('/:id', apiLimiter, getProductById);

// @route   POST /api/products (admin)
router.post(
  '/',
  apiLimiter,
  auth,
  isAdmin,
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
    body('category')
      .trim()
      .customSanitizer((value) => {
        const normalized = String(value || '').toLowerCase();
        if (normalized === 'men') return 'Men';
        if (normalized === 'women') return 'Women';
        if (normalized === 'unisex') return 'Unisex';
        return value;
      })
      .isIn(['Men', 'Women', 'Unisex'])
      .withMessage('Category must be Men, Women, or Unisex'),
    body('brand').trim().notEmpty().withMessage('Brand is required'),
  ],
  createProduct
);

// @route   PUT /api/products/:id (admin)
router.put('/:id', apiLimiter, auth, isAdmin, updateProduct);

// @route   DELETE /api/products/:id (admin)
router.delete('/:id', apiLimiter, auth, isAdmin, deleteProduct);

// @route   PUT /api/products/:id/review (authenticated)
router.put(
  '/:id/review',
  apiLimiter,
  auth,
  [
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('comment').trim().notEmpty().withMessage('Comment is required'),
  ],
  addProductReview
);

// @route   GET /api/products/:id/reviews
router.get('/:id/reviews', apiLimiter, getProductReviews);

module.exports = router;
