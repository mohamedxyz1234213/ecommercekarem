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
  sendPaymobPaymentConfirmation,
} = require('../utils/email');
const { initiatePaymobPayment, verifyPaymobHMAC } = require('../utils/paymob');
const { sanitize } = require('../utils/sanitize');

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
      if (product.stock < item.quantity) {
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
        image: product.images[0] || '',
      });

      // Decrement stock
      product.stock -= item.quantity;
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
      email: email || req.user.email,
    });

    const populatedOrder = await Order.findById(order._id).populate('user', 'name email');

    // If Paymob payment, initiate payment and return redirect URL
    if (paymentMethod === 'paymob') {
      try {
        const { paymentUrl, paymobOrderId } = await initiatePaymobPayment(
          populatedOrder,
          req.user
        );
        order.paymobOrderId = String(paymobOrderId);
        await order.save();

        // Send order confirmation email (payment pending)
        sendOrderConfirmation(populatedOrder, req.user).catch(() => {});
        sendAdminNotification(populatedOrder).catch(() => {});

        return res.status(201).json({ ...populatedOrder.toObject(), paymentUrl });
      } catch (paymobError) {
        console.error('Paymob payment initiation error:', paymobError.message);
        // Order is still created, just no redirect URL — user can retry
        sendOrderConfirmation(populatedOrder, req.user).catch(() => {});
        sendAdminNotification(populatedOrder).catch(() => {});
        return res.status(201).json(populatedOrder);
      }
    }

    // For InstaPay, send emails normally
    sendOrderConfirmation(populatedOrder, req.user).catch(() => {});
    sendAdminNotification(populatedOrder).catch(() => {});

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('createOrder error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Paymob webhook callback
// @route   POST /api/orders/paymob-callback
const paymobCallback = async (req, res) => {
  try {
    // Verify HMAC signature for security
    const hmac = req.query.hmac || req.body.hmac;
    if (!verifyPaymobHMAC(req.body, hmac)) {
      console.error('Paymob HMAC verification failed');
      return res.status(403).json({ message: 'Invalid HMAC signature' });
    }

    const obj = req.body.obj || req.body;
    const success = obj.success === true || obj.success === 'true';
    const paymobOrderId = String(obj.order?.id || obj.order);
    const transactionId = String(obj.id);

    // Find order by paymobOrderId
    const order = await Order.findOne({ paymobOrderId });
    if (!order) {
      console.error(`Paymob callback: Order not found for paymobOrderId ${paymobOrderId}`);
      return res.status(404).json({ message: 'Order not found' });
    }

    if (success) {
      order.paymentStatus = 'approved';
      order.status = 'processing';
      order.paymobTransactionId = transactionId;
      order.paidAt = new Date();
      await order.save();

      // Send payment confirmation email
      const user = await User.findById(order.user);
      if (user) {
        sendPaymobPaymentConfirmation(order, user).catch(() => {});
      }
    } else {
      order.paymentStatus = 'rejected';
      order.paymobTransactionId = transactionId;

      // Restore stock on failed payment (only once)
      if (!order.stockRestored) {
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity },
          });
        }
        order.stockRestored = true;
      }
      await order.save();
    }

    res.status(200).json({ message: 'Callback processed' });
  } catch (error) {
    console.error('paymobCallback error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Paymob payment redirect (after iframe)
// @route   GET /api/orders/paymob-redirect
const paymobRedirect = async (req, res) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const success = req.query.success === 'true';
  const orderId = req.query.merchant_order_id || req.query.order;

  if (success) {
    res.redirect(`${clientUrl}/profile?payment=success&order=${orderId || ''}`);
  } else {
    res.redirect(`${clientUrl}/profile?payment=failed&order=${orderId || ''}`);
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
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
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
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
      order.stockRestored = true;
    }
    await order.save();

    const user = await User.findById(order.user);
    if (user) {
      sendInstapayRejection(order, user).catch(() => {});
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
  paymobCallback,
  paymobRedirect,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  approveInstapay,
  rejectInstapay,
};
