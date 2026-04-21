const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const {
  sendOrderConfirmation,
  sendInstapayApproval,
  sendInstapayRejection,
  sendStatusUpdate,
  sendAdminNotification,
} = require('../utils/email');
const { uploadImageBuffer, hasCloudinaryConfig } = require('../utils/cloudinary');
const { sanitize } = require('../utils/sanitize');

const isValidEmail = (value) => /^\S+@\S+\.\S+$/.test(String(value || '').trim());

// @desc    Create new order
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      items,
      shippingAddress,
      paymentMethod,
      instapayProof,
      instapayUsername,
      email,
    } = req.body;

    const normalizedEmail = String(email || req.user.email || '').trim().toLowerCase();
    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: 'A valid email is required for payment verification' });
    }
    if (normalizedEmail !== String(req.user.email || '').trim().toLowerCase()) {
      return res.status(400).json({ message: 'Email verification failed. Please use your account email.' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Validate items and calculate total
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        return res.status(400).json({ message: `Invalid product ID: ${item.product}` });
      }
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      const requestedSize = typeof item.size === 'string' ? item.size.trim() : '';
      const hasSizeStocks = Array.isArray(product.sizeStocks) && product.sizeStocks.length > 0;

      if (hasSizeStocks) {
        if (!requestedSize) {
          return res.status(400).json({
            message: `Please select a size for ${product.name}`,
          });
        }
        const sizeEntry = product.sizeStocks.find((entry) => entry.size === requestedSize);
        if (!sizeEntry) {
          return res.status(400).json({
            message: `Size ${requestedSize} is not available for ${product.name}`,
          });
        }
        if (sizeEntry.quantity < item.quantity) {
          return res.status(400).json({
            message: `Insufficient stock for ${product.name} (${requestedSize}). Available: ${sizeEntry.quantity}`,
          });
        }
      } else if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        });
      }

      const itemPrice = product.onSale && product.salePrice ? product.salePrice : product.price;
      totalPrice += itemPrice * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: itemPrice,
        quantity: item.quantity,
        size: requestedSize || '',
        image: product.images[0] || '',
      });

      // Decrement stock
      if (hasSizeStocks) {
        product.sizeStocks = product.sizeStocks.map((entry) =>
          entry.size === requestedSize
            ? { ...entry, quantity: entry.quantity - item.quantity }
            : entry
        );
      }
      product.stock = Math.max(0, (product.stock || 0) - item.quantity);
      await product.save();
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      instapayProof: instapayProof || '',
      instapayUsername: instapayUsername || '',
      totalPrice,
      email: normalizedEmail,
    });

    const populatedOrder = await Order.findById(order._id).populate('user', 'name email');

    // For InstaPay, send emails normally
    sendOrderConfirmation(populatedOrder, req.user).catch(() => {});
    sendAdminNotification(populatedOrder).catch(() => {});

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('createOrder error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Submit instapay payment proof for an order
// @route   POST /api/orders/:id/instapay-proof
const submitInstapayProof = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure only owner (or admin) can submit payment proof
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    if (order.paymentMethod !== 'instapay') {
      return res.status(400).json({ message: 'This order does not use InstaPay payment' });
    }

    const submittedEmail = String(req.body.email || '').trim().toLowerCase();
    if (!isValidEmail(submittedEmail)) {
      return res.status(400).json({ message: 'A valid email is required' });
    }

    // Verify submitted email matches order/user email for payment proof verification
    const owner = await User.findById(order.user).select('email name');
    const ownerEmail = String(owner?.email || '').trim().toLowerCase();
    const orderEmail = String(order.email || '').trim().toLowerCase();
    if (submittedEmail !== ownerEmail && submittedEmail !== orderEmail) {
      return res.status(400).json({ message: 'Email verification failed for this order' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Payment proof image is required' });
    }
    if (!hasCloudinaryConfig()) {
      return res.status(500).json({ message: 'Image storage is not configured on server' });
    }

    const instapayUsername = String(req.body.instapayUsername || '').trim();
    if (!instapayUsername) {
      return res.status(400).json({ message: 'InstaPay username is required' });
    }

    const proofUpload = await uploadImageBuffer(req.file.buffer, { folder: 'vybe/instapay' });
    order.instapayProof = proofUpload.secure_url;
    order.instapayUsername = instapayUsername;
    order.email = submittedEmail;
    order.paymentStatus = 'pending';
    await order.save();

    // Notify admin that payment proof is submitted and pending verification
    sendAdminNotification(order).catch(() => {});

    return res.json({ message: 'Payment proof submitted successfully', order });
  } catch (error) {
    console.error('submitInstapayProof error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my
const getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));

    const [orders, total] = await Promise.all([
      Order.find({ user: req.user._id })
        .sort('-createdAt')
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Order.countDocuments({ user: req.user._id }),
    ]);

    res.json({ orders, page: pageNum, pages: Math.ceil(total / limitNum), total });
  } catch (error) {
    console.error('getMyOrders error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, paymentStatus, paymentMethod, search } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));

    const query = {};
    if (status) query.status = sanitize(status);
    if (paymentStatus) query.paymentStatus = sanitize(paymentStatus);
    if (paymentMethod) query.paymentMethod = sanitize(paymentMethod);

    // Search by order ID suffix or email
    if (search) {
      const cleanSearch = sanitize(search);
      query.$or = [
        { email: { $regex: cleanSearch, $options: 'i' } },
      ];
      // Try exact ObjectId match if it's a valid 24-char hex string
      if (/^[a-fA-F0-9]{24}$/.test(cleanSearch)) {
        try {
          query.$or.push({ _id: new mongoose.Types.ObjectId(cleanSearch) });
        } catch {
          // Not a valid ObjectId, skip
        }
      }
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email')
        .sort('-createdAt')
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Order.countDocuments(query),
    ]);

    res.json({ orders, page: pageNum, pages: Math.ceil(total / limitNum), total });
  } catch (error) {
    console.error('getAllOrders error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Allow access for admin or the order owner
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const previousStatus = order.status;
    order.status = status;
    await order.save();

    // Restore stock if cancelled (only once, tracked by stockRestored flag)
    if (status === 'cancelled' && !order.stockRestored) {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (!product) continue;

        product.stock = (product.stock || 0) + item.quantity;
        if (item.size && Array.isArray(product.sizeStocks) && product.sizeStocks.length > 0) {
          product.sizeStocks = product.sizeStocks.map((entry) =>
            entry.size === item.size
              ? { ...entry, quantity: entry.quantity + item.quantity }
              : entry
          );
        }
        await product.save();
      }
      order.stockRestored = true;
      await order.save();
    }

    const user = await User.findById(order.user);
    if (user) {
      sendStatusUpdate(order, user).catch(() => {});
    }

    res.json(order);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    console.error('updateOrderStatus error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Approve instapay payment (admin)
// @route   PUT /api/orders/:id/approve-instapay
const approveInstapay = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.paymentMethod !== 'instapay') {
      return res.status(400).json({ message: 'This order does not use InstaPay payment' });
    }

    if (order.paymentStatus === 'approved') {
      return res.status(400).json({ message: 'Payment is already approved' });
    }

    order.paymentStatus = 'approved';
    order.status = 'processing';
    order.paidAt = new Date();
    await order.save();

    const user = await User.findById(order.user);
    if (user) {
      sendInstapayApproval(order, user).catch(() => {});
      sendStatusUpdate(order, user).catch(() => {});
    }

    res.json({ message: 'InstaPay payment approved', order });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    console.error('approveInstapay error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Reject instapay payment (admin)
// @route   PUT /api/orders/:id/reject-instapay
const rejectInstapay = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.paymentMethod !== 'instapay') {
      return res.status(400).json({ message: 'This order does not use InstaPay payment' });
    }

    if (order.paymentStatus === 'rejected') {
      return res.status(400).json({ message: 'Payment is already rejected' });
    }

    order.paymentStatus = 'rejected';
    order.rejectionReason = req.body.reason || '';
    order.status = 'cancelled';

    // Restore stock (only once)
    if (!order.stockRestored) {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (!product) continue;

        product.stock = (product.stock || 0) + item.quantity;
        if (item.size && Array.isArray(product.sizeStocks) && product.sizeStocks.length > 0) {
          product.sizeStocks = product.sizeStocks.map((entry) =>
            entry.size === item.size
              ? { ...entry, quantity: entry.quantity + item.quantity }
              : entry
          );
        }
        await product.save();
      }
      order.stockRestored = true;
    }
    await order.save();

    const user = await User.findById(order.user);
    if (user) {
      sendInstapayRejection(order, user).catch(() => {});
      sendStatusUpdate(order, user).catch(() => {});
    }

    res.json({ message: 'InstaPay payment rejected', order });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    console.error('rejectInstapay error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createOrder,
  submitInstapayProof,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  approveInstapay,
  rejectInstapay,
};
