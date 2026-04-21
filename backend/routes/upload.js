const express = require('express');
const rateLimit = require('express-rate-limit');
const { auth } = require('../middleware/auth');
const { uploadSingle, uploadProductImages } = require('../middleware/upload');
const { uploadImageBuffer, hasCloudinaryConfig } = require('../utils/cloudinary');

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
router.post('/', uploadLimiter, auth, (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Maximum size is 15MB per image.' });
      }
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded. Please choose a JPG, PNG, GIF, or WebP file.' });
    }

    if (!hasCloudinaryConfig()) {
      return res.status(500).json({ message: 'Image storage is not configured on server' });
    }

    try {
      const result = await uploadImageBuffer(req.file.buffer, { folder: 'vybe/products' });
      return res.json({
        url: result.secure_url,
        filename: result.public_id,
      });
    } catch (uploadError) {
      return res.status(500).json({ message: `Image upload failed: ${uploadError.message}` });
    }
  });
});

// @route   POST /api/upload/multiple
// @desc    Upload multiple images
router.post('/multiple', uploadLimiter, auth, (req, res) => {
  uploadProductImages(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Maximum size is 15MB per image.' });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ message: 'Maximum 10 files allowed.' });
      }
      return res.status(400).json({ message: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded. Please choose image files first.' });
    }

    if (!hasCloudinaryConfig()) {
      return res.status(500).json({ message: 'Image storage is not configured on server' });
    }

    try {
      const uploaded = await Promise.all(
        req.files.map((file) => uploadImageBuffer(file.buffer, { folder: 'vybe/products' }))
      );
      const urls = uploaded.map((item) => ({
        url: item.secure_url,
        filename: item.public_id,
      }));
      return res.json(urls);
    } catch (uploadError) {
      return res.status(500).json({ message: `Image upload failed: ${uploadError.message}` });
    }
  });
});

module.exports = router;
