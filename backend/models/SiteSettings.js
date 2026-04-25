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

const shippingZoneSchema = new mongoose.Schema(
  {
    governorate: {
      type: String,
      required: [true, 'Governorate is required'],
      trim: true,
      maxlength: [80, 'Governorate cannot exceed 80 characters'],
    },
    area: {
      type: String,
      required: [true, 'Area is required'],
      trim: true,
      maxlength: [80, 'Area cannot exceed 80 characters'],
    },
    fee: {
      type: Number,
      required: [true, 'Shipping fee is required'],
      min: [0, 'Shipping fee cannot be negative'],
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
    shippingZones: {
      type: [shippingZoneSchema],
      default: [],
    },

    // About Us page
    aboutTitle: {
      type: String,
      default: 'Our Story',
      trim: true,
      maxlength: [200, 'About title cannot exceed 200 characters'],
    },
    aboutSubtitle: {
      type: String,
      default: 'A Luxury Egyptian Perfume House',
      trim: true,
      maxlength: [300, 'About subtitle cannot exceed 300 characters'],
    },
    aboutStory: {
      type: String,
      default:
        'Born from the ancient art of Egyptian perfumery, KARÉME blends centuries-old traditions with modern luxury. Our master perfumers source the finest raw materials — rare oud from the heart of Arabia, fresh florals from the Nile Delta, and precious resins carried by camel across desert trade routes — to craft fragrances that tell the story of Egypt\'s rich heritage.',
      trim: true,
      maxlength: [2000, 'About story cannot exceed 2000 characters'],
    },
    aboutMission: {
      type: String,
      default:
        'To celebrate the art of Egyptian perfumery by creating exceptional, hand-crafted fragrances that connect people to the timeless beauty and mystique of the ancient East.',
      trim: true,
      maxlength: [500, 'About mission cannot exceed 500 characters'],
    },
    aboutFoundedYear: {
      type: String,
      default: '2020',
      trim: true,
      maxlength: [10, 'Founded year cannot exceed 10 characters'],
    },
    aboutImage: {
      type: String,
      default: '',
      trim: true,
    },
    // Brand values (3)
    aboutValue1Title: { type: String, default: 'Authenticity', trim: true, maxlength: [100, 'Value title too long'] },
    aboutValue1Desc: { type: String, default: 'Every bottle carries the genuine soul of Egyptian perfumery — never synthetic, never artificial.', trim: true, maxlength: [300, 'Value description too long'] },
    aboutValue2Title: { type: String, default: 'Craftsmanship', trim: true, maxlength: [100, 'Value title too long'] },
    aboutValue2Desc: { type: String, default: 'Each fragrance is meticulously blended by hand, aged to perfection, and poured with care in small batches.', trim: true, maxlength: [300, 'Value description too long'] },
    aboutValue3Title: { type: String, default: 'Heritage', trim: true, maxlength: [100, 'Value title too long'] },
    aboutValue3Desc: { type: String, default: 'Rooted in 5,000 years of Egyptian civilisation, our scents are a living tribute to the pharaohs\' love of fragrance.', trim: true, maxlength: [300, 'Value description too long'] },
    // Stats (4)
    aboutStat1Value: { type: String, default: '5+', trim: true, maxlength: [20, 'Stat value too long'] },
    aboutStat1Label: { type: String, default: 'Years of Excellence', trim: true, maxlength: [100, 'Stat label too long'] },
    aboutStat2Value: { type: String, default: '200+', trim: true, maxlength: [20, 'Stat value too long'] },
    aboutStat2Label: { type: String, default: 'Unique Fragrances', trim: true, maxlength: [100, 'Stat label too long'] },
    aboutStat3Value: { type: String, default: '10K+', trim: true, maxlength: [20, 'Stat value too long'] },
    aboutStat3Label: { type: String, default: 'Happy Customers', trim: true, maxlength: [100, 'Stat label too long'] },
    aboutStat4Value: { type: String, default: '100%', trim: true, maxlength: [20, 'Stat value too long'] },
    aboutStat4Label: { type: String, default: 'Natural Ingredients', trim: true, maxlength: [100, 'Stat label too long'] },
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
