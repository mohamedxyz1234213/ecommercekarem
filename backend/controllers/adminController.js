const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Review = require('../models/Review');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalOrders, totalProducts, revenueResult, recentOrders, ordersByStatus] =
      await Promise.all([
        User.countDocuments(),
        Order.countDocuments(),
        Product.countDocuments(),
        Order.aggregate([
          { $match: { paymentStatus: 'approved' } },
          { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ]),
        Order.find()
          .populate('user', 'name email')
          .sort('-createdAt')
          .limit(10),
        Order.aggregate([
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
      ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    const statusCounts = {};
    ordersByStatus.forEach((s) => {
      statusCounts[s._id] = s.count;
    });

    res.json({
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue,
      recentOrders,
      ordersByStatus: statusCounts,
    });
  } catch (error) {
    console.error('getDashboardStats error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all reviews (admin)
// @route   GET /api/admin/reviews
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('product', 'name')
      .sort('-createdAt');

    res.json(reviews);
  } catch (error) {
    console.error('getReviews error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a review (admin) and recalculate product rating
// @route   DELETE /api/admin/reviews/:id
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const productId = review.product;
    await Review.deleteOne({ _id: review._id });

    // Recalculate rating on the associated product
    const product = await Product.findById(productId);
    if (product) {
      const [agg] = await Review.aggregate([
        { $match: { product: product._id } },
        { $group: { _id: null, count: { $sum: 1 }, avg: { $avg: '$rating' } } },
      ]);
      product.numReviews = agg ? agg.count : 0;
      product.rating = agg ? agg.avg : 0;
      await product.save();
    }

    res.json({ message: 'Review removed' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Review not found' });
    }
    console.error('deleteReview error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDashboardStats, getReviews, deleteReview };
