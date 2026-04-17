const mongoose = require('mongoose');

const sizeStockSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      enum: ['50ml', '75ml', '100ml'],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, 'Size quantity cannot be negative'],
      default: 0,
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  salePrice: {
    type: Number,
    default: null,
    min: [0, 'Sale price cannot be negative'],
  },
  onSale: {
    type: Boolean,
    default: false,
  },
  saleTape: {
    type: String,
    default: '',
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Men', 'Women', 'Unisex'],
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true,
  },
  images: {
    type: [String],
    default: [],
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  sizeStocks: {
    type: [sizeStockSchema],
    default: [],
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be below 0'],
    max: [5, 'Rating cannot exceed 5'],
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for search and filtering
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, brand: 1, price: 1 });

module.exports = mongoose.model('Product', productSchema);
