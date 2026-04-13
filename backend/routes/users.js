const express = require('express');
const { auth, isAdmin } = require('../middleware/auth');
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const router = express.Router();

// All routes require auth + admin
router.use(auth, isAdmin);

// @route   GET /api/users
router.get('/', getUsers);

// @route   GET /api/users/:id
router.get('/:id', getUserById);

// @route   PUT /api/users/:id
router.put('/:id', updateUser);

// @route   DELETE /api/users/:id
router.delete('/:id', deleteUser);

module.exports = router;
