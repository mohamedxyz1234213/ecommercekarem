const express = require('express');
const rateLimit = require('express-rate-limit');
const { auth } = require('../middleware/auth');
const { uploadSingle, uploadProductImages } = require('../middleware/upload');

const router = express.Router();

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { message: 'Too many upload requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// @route   POST /api/upload
// @desc    Upload single image
router.post('/', auth, uploadLimiter, (req, res) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
      }
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    res.json({
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
    });
  });
});

// @route   POST /api/upload/multiple
// @desc    Upload multiple images
router.post('/multiple', auth, uploadLimiter, (req, res) => {
  uploadProductImages(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ message: 'Maximum 10 files allowed.' });
      }
      return res.status(400).json({ message: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const urls = req.files.map((file) => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename,
    }));

    res.json(urls);
  });
});

module.exports = router;
