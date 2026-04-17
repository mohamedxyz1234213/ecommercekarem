const { validationResult } = require('express-validator');
const Product = require('../models/Product');
const Review = require('../models/Review');
const { sanitize } = require('../utils/sanitize');

const normalizeSizeStocks = (rawSizeStocks) => {
  if (rawSizeStocks === undefined || rawSizeStocks === null || rawSizeStocks === '') return undefined;

  let parsed = rawSizeStocks;
  if (typeof rawSizeStocks === 'string') {
    try {
      parsed = JSON.parse(rawSizeStocks);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(parsed)) return [];

  return parsed
    .map((entry) => ({
      size: typeof entry?.size === 'string' ? entry.size.trim() : '',
      quantity: Number(entry?.quantity) || 0,
    }))
    .filter((entry) => ['50ml', '75ml', '100ml'].includes(entry.size));
};

const getTotalSizeStock = (sizeStocks) =>
  sizeStocks.reduce((sum, entry) => sum + Math.max(0, Number(entry.quantity) || 0), 0);

// @desc    Get all products with search/filter/pagination
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      onSale,
      featured,
      sort = '-createdAt',
    } = req.query;

    const query = {};

    if (search) {
      const cleanSearch = sanitize(search);
      query.$or = [
        { name: { $regex: cleanSearch, $options: 'i' } },
        { description: { $regex: cleanSearch, $options: 'i' } },
        { brand: { $regex: cleanSearch, $options: 'i' } },
      ];
    }

    if (category) query.category = sanitize(category);
    if (brand) query.brand = sanitize(brand);
    if (onSale === 'true') query.onSale = true;
    if (featured === 'true') query.featured = true;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sort)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Product.countDocuments(query),
    ]);

    res.json({
      products,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    console.error('getProducts error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create product (admin)
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const details = errors.array();
      console.error('createProduct validation error:', details);
      return res.status(400).json({
        message: details[0]?.msg || 'Invalid product data',
        errors: details,
      });
    }

    const {
      name,
      description,
      price,
      salePrice,
      onSale,
      saleTape,
      category,
      brand,
      images,
      stock,
      featured,
      sizeStocks,
    } = req.body;

    const normalizedSizeStocks = normalizeSizeStocks(sizeStocks);
    const computedStockFromSizes =
      normalizedSizeStocks !== undefined ? getTotalSizeStock(normalizedSizeStocks) : null;

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      salePrice: salePrice || null,
      onSale: onSale || false,
      saleTape: saleTape || '',
      category,
      brand,
      images: images || [],
      stock:
        computedStockFromSizes !== null ? computedStockFromSizes : Number(stock) || 0,
      ...(normalizedSizeStocks !== undefined ? { sizeStocks: normalizedSizeStocks } : {}),
      featured: featured || false,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('createProduct error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update product (admin)
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const allowedFields = [
      'name',
      'description',
      'price',
      'salePrice',
      'onSale',
      'saleTape',
      'category',
      'brand',
      'images',
      'stock',
      'featured',
      'sizeStocks',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    if (req.body.sizeStocks !== undefined) {
      const normalizedSizeStocks = normalizeSizeStocks(req.body.sizeStocks);
      product.sizeStocks = normalizedSizeStocks;
      product.stock = getTotalSizeStock(normalizedSizeStocks);
    } else if (req.body.stock !== undefined) {
      product.stock = Number(req.body.stock) || 0;
    }

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    console.error('updateProduct error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete product (admin)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.deleteOne({ _id: product._id });
    await Review.deleteMany({ product: product._id });

    res.json({ message: 'Product removed' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add or update product review
// @route   PUT /api/products/:id/review
const addProductReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const numericRating = Number(rating);
    const cleanComment = sanitize(comment);

    // Upsert review
    const review = await Review.findOneAndUpdate(
      { user: req.user._id, product: product._id },
      { rating: numericRating, comment: cleanComment, user: req.user._id, product: product._id },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    );

    // Recalculate product rating
    const reviews = await Review.find({ product: product._id });
    product.numReviews = reviews.length;
    product.rating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    await product.save();

    res.status(201).json({ message: 'Review submitted', review });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    console.error('addProductReview error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get reviews for a product
// @route   GET /api/products/:id/reviews
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.id })
      .populate('user', 'name avatar')
      .sort('-createdAt');

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
  getProductReviews,
};
