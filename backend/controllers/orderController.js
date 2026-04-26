const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const SiteSettings = require('../models/SiteSettings');
const {
  sendOrderConfirmation,
  sendInstapayApproval,
  sendInstapayRejection,
  sendStatusUpdate,
  sendAdminNotification,
} = require('../utils/email');
const { uploadImageBuffer, hasCloudinaryConfig } = require('../utils/cloudinary');
const { sanitize } = require('../utils/sanitize');

// Safe email validation without ReDoS vulnerability
const isValidEmail = (value) => {
  const str = String(value || '').trim();
  if (str.length > 254) return false;
  const atIdx = str.lastIndexOf('@');
  if (atIdx < 1) return false;
  const local = str.slice(0, atIdx);
  const domain = str.slice(atIdx + 1);
  if (!local || !domain) return false;
  const dotIdx = domain.lastIndexOf('.');
  if (dotIdx < 1 || dotIdx >= domain.length - 1) return false;
  return true;
};

const normalizeArea = (value) => String(value || '').trim().toLowerCase();

const resolveShippingFee = (zones, governorate, area) => {
  const normalizedGovernorate = normalizeArea(governorate);
  const normalizedArea = normalizeArea(area);

  const enabledZones = Array.isArray(zones) ? zones.filter((zone) => zone?.enabled !== false) : [];
  const exactMatch = enabledZones.find(
    (zone) =>
      normalizeArea(zone.governorate) === normalizedGovernorate &&
      normalizeArea(zone.area) === normalizedArea
  );
  if (exactMatch) return Number(exactMatch.fee || 0);

  const governorateFallback = enabledZones.find(
    (zone) =>
      normalizeArea(zone.governorate) === normalizedGovernorate &&
      ['all', '*'].includes(normalizeArea(zone.area))
  );
  if (governorateFallback) return Number(governorateFallback.fee || 0);

  return null;
};

// @desc    Create new order (supports both authenticated and guest users)
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
      guestName,
      guestPhone,
    } = req.body;

    const isGuest = !req.user;

    const normalizedEmail = String(email || req.user?.email || '').trim().toLowerCase();
    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: 'A valid email is required for order confirmation' });
    }

    // For authenticated users, email must match account email
    if (!isGuest && normalizedEmail !== String(req.user.email || '').trim().toLowerCase()) {
      return res.status(400).json({ message: 'Email verification failed. Please use your account email.' });
    }

    // Guest orders require name and phone
    if (isGuest) {
      if (!guestName || !String(guestName).trim()) {
        return res.status(400).json({ message: 'Full name is required for guest orders' });
      }
      if (!guestPhone || !String(guestPhone).trim()) {
        return res.status(400).json({ message: 'Phone number is required for guest orders' });
      }
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

    if (String(shippingAddress.country || '').trim().toLowerCase() !== 'egypt') {
      return res.status(400).json({ message: 'Shipping is available only inside Egypt' });
    }

    const settings = await SiteSettings.getSettings();
    const shippingFee = resolveShippingFee(
      settings.shippingZones,
      shippingAddress.city,
      shippingAddress.state
    );
    if (shippingFee === null) {
      return res.status(400).json({
        message: 'Shipping fee is not configured for this governorate/area. Please contact support.',
      });
    }

    const orderData = {
      user: isGuest ? null : req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      instapayProof: instapayProof || '',
      instapayUsername: instapayUsername || '',
      itemsPrice: totalPrice,
      shippingPrice: shippingFee,
      totalPrice: totalPrice + shippingFee,
      email: normalizedEmail,
    };

    if (isGuest) {
      orderData.guestInfo = {
        name: String(guestName).trim(),
        email: normalizedEmail,
        phone: String(guestPhone).trim(),
      };
    }

    const order = await Order.create(orderData);

    const populatedOrder = await Order.findById(order._id).populate('user', 'name email');

    // Build a user-like object for email purposes
    const emailRecipient = isGuest
      ? { name: String(guestName).trim(), email: normalizedEmail }
      : req.user;

    sendOrderConfirmation(populatedOrder, emailRecipient).catch(() => {});
    sendAdminNotification(populatedOrder, emailRecipient).catch(() => {});

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

    // For authenticated users, ensure only owner (or admin) can submit payment proof
    if (req.user) {
      if (order.user && order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to update this order' });
      }
    }

    if (order.paymentMethod !== 'instapay') {
      return res.status(400).json({ message: 'This order does not use InstaPay payment' });
    }

    const submittedEmail = String(req.body.email || '').trim().toLowerCase();
    if (!isValidEmail(submittedEmail)) {
      return res.status(400).json({ message: 'A valid email is required' });
    }

    // Verify submitted email matches order email (works for both guest and authenticated)
    const orderEmail = String(order.email || order.guestInfo?.email || '').trim().toLowerCase();
    let ownerEmail = orderEmail;
    if (order.user) {
      const owner = await User.findById(order.user).select('email name');
      ownerEmail = String(owner?.email || '').trim().toLowerCase();
    }
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
    const emailRecipient = order.user
      ? await User.findById(order.user).select('name email')
      : { name: order.guestInfo?.name || 'Guest', email: order.email };
    sendAdminNotification(order, emailRecipient).catch(() => {});

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

// @desc    Track an order by ID — public endpoint, requires email verification
// @route   GET /api/orders/track/:id
const trackOrder = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const email = String(req.query.email || '').trim().toLowerCase();
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'A valid email is required to track your order' });
    }

    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const orderEmail = String(order.email || order.guestInfo?.email || '').trim().toLowerCase();
    const userEmail = String(order.user?.email || '').trim().toLowerCase();

    if (email !== orderEmail && email !== userEmail) {
      return res.status(403).json({ message: 'Email does not match this order. Please check your email and try again.' });
    }

    res.json(order);
  } catch (error) {
    console.error('trackOrder error:', error.message);
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

    // Allow access for admin or the order owner; guest orders accessible only via trackOrder
    if (order.user) {
      if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to view this order' });
      }
    } else if (req.user.role !== 'admin') {
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

    const user = order.user ? await User.findById(order.user) : null;
    const emailRecipient = user || { name: order.guestInfo?.name || 'Customer', email: order.email };
    if (emailRecipient.email) {
      sendStatusUpdate(order, emailRecipient).catch(() => {});
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

    const user = order.user ? await User.findById(order.user) : null;
    const emailRecipient = user || { name: order.guestInfo?.name || 'Customer', email: order.email };
    if (emailRecipient.email) {
      sendInstapayApproval(order, emailRecipient).catch(() => {});
      sendStatusUpdate(order, emailRecipient).catch(() => {});
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

    const user = order.user ? await User.findById(order.user) : null;
    const emailRecipient = user || { name: order.guestInfo?.name || 'Customer', email: order.email };
    if (emailRecipient.email) {
      sendInstapayRejection(order, emailRecipient).catch(() => {});
      sendStatusUpdate(order, emailRecipient).catch(() => {});
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
  trackOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  approveInstapay,
  rejectInstapay,
};
