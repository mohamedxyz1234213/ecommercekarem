const express = require('express');
const { body } = require('express-validator');
const { auth, isAdmin } = require('../middleware/auth');
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
router.get('/', getProducts);

// @route   GET /api/products/:id
router.get('/:id', getProductById);

// @route   POST /api/products (admin)
router.post(
  '/',
  auth,
  isAdmin,
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
    body('category').isIn(['Men', 'Women', 'Unisex']).withMessage('Valid category is required'),
    body('brand').trim().notEmpty().withMessage('Brand is required'),
  ],
  createProduct
);

// @route   PUT /api/products/:id (admin)
router.put('/:id', auth, isAdmin, updateProduct);

// @route   DELETE /api/products/:id (admin)
router.delete('/:id', auth, isAdmin, deleteProduct);

// @route   PUT /api/products/:id/review (authenticated)
router.put(
  '/:id/review',
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
router.get('/:id/reviews', getProductReviews);

module.exports = router;
