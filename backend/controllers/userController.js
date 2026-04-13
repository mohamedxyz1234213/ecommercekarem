const User = require('../models/User');
const { sanitize } = require('../utils/sanitize');
const mongoose = require('mongoose');

// @desc    Get all users (admin)
// @route   GET /api/users
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));

    const query = {};
    if (search) {
      const cleanSearch = sanitize(search);
      query.$or = [
        { name: { $regex: cleanSearch, $options: 'i' } },
        { email: { $regex: cleanSearch, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .sort('-createdAt')
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      User.countDocuments(query),
    ]);

    res.json({ users, page: pageNum, pages: Math.ceil(total / limitNum), total });
  } catch (error) {
    console.error('getUsers error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single user (admin)
// @route   GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'User not found' });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user (admin)
// @route   PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'User not found' });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email, role, phone, address } = req.body;

    if (name !== undefined) user.name = sanitize(name);
    if (email !== undefined) user.email = email; // Email validated by mongoose
    if (role !== undefined && ['user', 'admin'].includes(role)) user.role = role;
    if (phone !== undefined) user.phone = sanitize(phone);
    if (address !== undefined) user.address = address;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      address: updatedUser.address,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    console.error('updateUser error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'User not found' });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin user' });
    }

    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User removed' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUsers, getUserById, updateUser, deleteUser };
