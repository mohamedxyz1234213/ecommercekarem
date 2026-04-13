const mongoose = require('mongoose');

const socialLinkSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: [true, 'Platform name is required'],
      trim: true,
      maxlength: [50, 'Platform name cannot exceed 50 characters'],
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true,
      maxlength: [500, 'URL cannot exceed 500 characters'],
    },
    icon: {
      type: String,
      required: [true, 'Icon name is required'],
      trim: true,
      maxlength: [50, 'Icon name cannot exceed 50 characters'],
    },
    location: {
      type: String,
      enum: ['navbar', 'footer', 'both'],
      default: 'footer',
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true }
);

const siteSettingsSchema = new mongoose.Schema(
  {
    // Hero section
    heroSubtitle: {
      type: String,
      default: 'Luxury Fragrances',
      trim: true,
      maxlength: [200, 'Hero subtitle cannot exceed 200 characters'],
    },
    heroTitle: {
      type: String,
      default: 'Discover Your',
      trim: true,
      maxlength: [200, 'Hero title cannot exceed 200 characters'],
    },
    heroTitleHighlight: {
      type: String,
      default: 'Signature Scent',
      trim: true,
      maxlength: [200, 'Hero title highlight cannot exceed 200 characters'],
    },
    heroDescription: {
      type: String,
      default:
        "Curated collection of the world's finest perfumes, each telling a unique story of elegance and sophistication.",
      trim: true,
      maxlength: [500, 'Hero description cannot exceed 500 characters'],
    },
    heroImage: {
      type: String,
      default: '',
      trim: true,
    },
    heroPrimaryButtonText: {
      type: String,
      default: 'Shop Now',
      trim: true,
      maxlength: [50, 'Button text cannot exceed 50 characters'],
    },
    heroPrimaryButtonLink: {
      type: String,
      default: '/shop',
      trim: true,
    },
    heroSecondaryButtonText: {
      type: String,
      default: 'View Collection',
      trim: true,
      maxlength: [50, 'Button text cannot exceed 50 characters'],
    },
    heroSecondaryButtonLink: {
      type: String,
      default: '/shop',
      trim: true,
    },

    // Social links
    socialLinks: {
      type: [socialLinkSchema],
      default: [
        { platform: 'Instagram', url: '#', icon: 'FiInstagram', location: 'both', enabled: true },
        { platform: 'Facebook', url: '#', icon: 'FiFacebook', location: 'both', enabled: true },
        { platform: 'Twitter', url: '#', icon: 'FiTwitter', location: 'footer', enabled: true },
        { platform: 'Email', url: 'mailto:info@example.com', icon: 'FiMail', location: 'footer', enabled: true },
      ],
    },

    // Site branding (for completeness)
    siteName: {
      type: String,
      default: 'KARÉME',
      trim: true,
      maxlength: [100, 'Site name cannot exceed 100 characters'],
    },
    tagline: {
      type: String,
      default: 'Luxury Fragrances for Everyone',
      trim: true,
      maxlength: [200, 'Tagline cannot exceed 200 characters'],
    },
    bannerText: {
      type: String,
      default: '',
      trim: true,
      maxlength: [300, 'Banner text cannot exceed 300 characters'],
    },
  },
  { timestamps: true }
);

// Singleton pattern — always get/update the one settings document
siteSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
