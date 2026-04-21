const multer = require('multer');
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB
  },
});

// Product images (multiple)
const uploadProductImages = upload.array('images', 10);

// Instapay proof (single)
const uploadInstapayProof = upload.single('instapayProof');

// Single image upload
const uploadSingle = upload.single('image');

module.exports = { upload, uploadProductImages, uploadInstapayProof, uploadSingle };
