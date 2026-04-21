const { v2: cloudinary } = require('cloudinary');

const hasCloudinaryConfig = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );

if (hasCloudinaryConfig()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const ensureConfigured = () => {
  if (!hasCloudinaryConfig()) {
    throw new Error('Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
  }
};

const uploadImageBuffer = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    try {
      ensureConfigured();
      const uploadOptions = {
        folder: options.folder || 'vybe',
        resource_type: 'image',
      };
      const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      });
      stream.end(buffer);
    } catch (error) {
      reject(error);
    }
  });

module.exports = {
  uploadImageBuffer,
  hasCloudinaryConfig,
};
