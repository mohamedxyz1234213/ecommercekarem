const SiteSettings = require('../models/SiteSettings');

// @desc    Get site settings (public)
// @route   GET /api/settings
const getSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.getSettings();
    res.json(settings);
  } catch (error) {
    console.error('getSettings error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update site settings (admin)
// @route   PUT /api/settings
const updateSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.getSettings();

    const allowedFields = [
      'heroSubtitle',
      'heroTitle',
      'heroTitleHighlight',
      'heroDescription',
      'heroImage',
      'heroPrimaryButtonText',
      'heroPrimaryButtonLink',
      'heroSecondaryButtonText',
      'heroSecondaryButtonLink',
      'socialLinks',
      'siteName',
      'tagline',
      'bannerText',
      'shippingZones',
      // About Us
      'aboutTitle',
      'aboutSubtitle',
      'aboutStory',
      'aboutMission',
      'aboutFoundedYear',
      'aboutImage',
      'aboutValue1Title',
      'aboutValue1Desc',
      'aboutValue2Title',
      'aboutValue2Desc',
      'aboutValue3Title',
      'aboutValue3Desc',
      'aboutStat1Value',
      'aboutStat1Label',
      'aboutStat2Value',
      'aboutStat2Label',
      'aboutStat3Value',
      'aboutStat3Label',
      'aboutStat4Value',
      'aboutStat4Label',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field];
      }
    });

    const updated = await settings.save();
    res.json(updated);
  } catch (error) {
    console.error('updateSettings error:', error.message);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add a social link (admin)
// @route   POST /api/settings/social-links
const addSocialLink = async (req, res) => {
  try {
    const { platform, url, icon, location, enabled } = req.body;

    if (!platform || !url || !icon) {
      return res.status(400).json({ message: 'Platform, URL, and icon are required' });
    }

    const settings = await SiteSettings.getSettings();
    settings.socialLinks.push({
      platform,
      url,
      icon,
      location: location || 'footer',
      enabled: enabled !== false,
    });

    const updated = await settings.save();
    res.status(201).json(updated);
  } catch (error) {
    console.error('addSocialLink error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove a social link (admin)
// @route   DELETE /api/settings/social-links/:linkId
const removeSocialLink = async (req, res) => {
  try {
    const settings = await SiteSettings.getSettings();
    const linkIndex = settings.socialLinks.findIndex(
      (link) => link._id.toString() === req.params.linkId
    );

    if (linkIndex === -1) {
      return res.status(404).json({ message: 'Social link not found' });
    }

    settings.socialLinks.splice(linkIndex, 1);
    const updated = await settings.save();
    res.json(updated);
  } catch (error) {
    console.error('removeSocialLink error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getSettings, updateSettings, addSocialLink, removeSocialLink };
