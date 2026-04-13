const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

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

module.exports = { getDashboardStats };
