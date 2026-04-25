import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdSave, MdImage, MdStore, MdCampaign, MdLink, MdAdd, MdDelete, MdLocalShipping, MdInfo } from 'react-icons/md';
import ImageUpload from '../components/ImageUpload';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { resolveMediaUrl } from '../utils/resolveMediaUrl';

const ICON_OPTIONS = [
  { label: 'Instagram', value: 'FiInstagram' },
  { label: 'Facebook', value: 'FiFacebook' },
  { label: 'Twitter / X', value: 'FiTwitter' },
  { label: 'Email', value: 'FiMail' },
  { label: 'YouTube', value: 'FiYoutube' },
  { label: 'LinkedIn', value: 'FiLinkedin' },
  { label: 'Phone', value: 'FiPhone' },
  { label: 'Globe (Website)', value: 'FiGlobe' },
  { label: 'TikTok', value: 'FiMusic' },
  { label: 'WhatsApp', value: 'FiMessageCircle' },
];

const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: '',
    tagline: '',
    bannerText: '',
    heroSubtitle: '',
    heroTitle: '',
    heroTitleHighlight: '',
    heroDescription: '',
    heroImage: '',
    heroPrimaryButtonText: '',
    heroPrimaryButtonLink: '',
    heroSecondaryButtonText: '',
    heroSecondaryButtonLink: '',
    socialLinks: [],
    shippingZones: [],
    // About Us
    aboutTitle: '',
    aboutSubtitle: '',
    aboutStory: '',
    aboutMission: '',
    aboutFoundedYear: '',
    aboutImage: '',
    aboutValue1Title: '',
    aboutValue1Desc: '',
    aboutValue2Title: '',
    aboutValue2Desc: '',
    aboutValue3Title: '',
    aboutValue3Desc: '',
    aboutStat1Value: '',
    aboutStat1Label: '',
    aboutStat2Value: '',
    aboutStat2Label: '',
    aboutStat3Value: '',
    aboutStat3Label: '',
    aboutStat4Value: '',
    aboutStat4Label: '',
  });
  const [heroImages, setHeroImages] = useState([]);
  const [aboutImages, setAboutImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newLink, setNewLink] = useState({ platform: '', url: '', icon: 'FiInstagram', location: 'both', enabled: true });
  const [showAddLink, setShowAddLink] = useState(false);
  const [newShippingZone, setNewShippingZone] = useState({ governorate: '', area: '', fee: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await API.get('/settings');
      setSettings({
        siteName: data.siteName || '',
        tagline: data.tagline || '',
        bannerText: data.bannerText || '',
        heroSubtitle: data.heroSubtitle || '',
        heroTitle: data.heroTitle || '',
        heroTitleHighlight: data.heroTitleHighlight || '',
        heroDescription: data.heroDescription || '',
        heroImage: data.heroImage || '',
        heroPrimaryButtonText: data.heroPrimaryButtonText || '',
        heroPrimaryButtonLink: data.heroPrimaryButtonLink || '',
        heroSecondaryButtonText: data.heroSecondaryButtonText || '',
        heroSecondaryButtonLink: data.heroSecondaryButtonLink || '',
        socialLinks: data.socialLinks || [],
        shippingZones: data.shippingZones || [],
        // About Us
        aboutTitle: data.aboutTitle || '',
        aboutSubtitle: data.aboutSubtitle || '',
        aboutStory: data.aboutStory || '',
        aboutMission: data.aboutMission || '',
        aboutFoundedYear: data.aboutFoundedYear || '',
        aboutImage: data.aboutImage || '',
        aboutValue1Title: data.aboutValue1Title || '',
        aboutValue1Desc: data.aboutValue1Desc || '',
        aboutValue2Title: data.aboutValue2Title || '',
        aboutValue2Desc: data.aboutValue2Desc || '',
        aboutValue3Title: data.aboutValue3Title || '',
        aboutValue3Desc: data.aboutValue3Desc || '',
        aboutStat1Value: data.aboutStat1Value || '',
        aboutStat1Label: data.aboutStat1Label || '',
        aboutStat2Value: data.aboutStat2Value || '',
        aboutStat2Label: data.aboutStat2Label || '',
        aboutStat3Value: data.aboutStat3Value || '',
        aboutStat3Label: data.aboutStat3Label || '',
        aboutStat4Value: data.aboutStat4Value || '',
        aboutStat4Label: data.aboutStat4Label || '',
      });
      if (data.heroImage) {
        setHeroImages([data.heroImage]);
      }
      if (data.aboutImage) {
        setAboutImages([data.aboutImage]);
      }
    } catch {
      // Use defaults if no settings exist yet
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...settings };
      // If hero image was uploaded
      if (heroImages.length > 0 && heroImages[0] !== settings.heroImage) {
        payload.heroImage = heroImages[0];
      } else if (heroImages.length === 0) {
        payload.heroImage = '';
      }
      // If about image was uploaded
      if (aboutImages.length > 0 && aboutImages[0] !== settings.aboutImage) {
        payload.aboutImage = aboutImages[0];
      } else if (aboutImages.length === 0) {
        payload.aboutImage = '';
      }
      await API.put('/settings', payload);
      toast.success('Settings saved successfully!');
      fetchSettings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSocialLink = async () => {
    if (!newLink.platform || !newLink.url) {
      toast.error('Platform and URL are required');
      return;
    }
    try {
      await API.post('/settings/social-links', newLink);
      toast.success('Social link added!');
      setNewLink({ platform: '', url: '', icon: 'FiInstagram', location: 'both', enabled: true });
      setShowAddLink(false);
      fetchSettings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add social link');
    }
  };

  const handleRemoveSocialLink = async (linkId) => {
    if (!window.confirm('Remove this social link?')) return;
    try {
      await API.delete(`/settings/social-links/${linkId}`);
      toast.success('Social link removed');
      fetchSettings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove social link');
    }
  };

  const handleToggleSocialLink = (linkId) => {
    setSettings((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link) =>
        link._id === linkId ? { ...link, enabled: !link.enabled } : link
      ),
    }));
  };

  const handleShippingZoneChange = (zoneIndex, key, value) => {
    setSettings((prev) => ({
      ...prev,
      shippingZones: prev.shippingZones.map((zone, index) =>
        index === zoneIndex ? { ...zone, [key]: key === 'fee' ? Number(value) || 0 : value } : zone
      ),
    }));
  };

  const handleAddShippingZone = () => {
    const governorate = newShippingZone.governorate.trim();
    const area = newShippingZone.area.trim();
    const fee = Number(newShippingZone.fee);
    if (!governorate || !area || Number.isNaN(fee) || fee < 0) {
      toast.error('Governorate, area, and valid fee are required');
      return;
    }

    setSettings((prev) => ({
      ...prev,
      shippingZones: [
        ...prev.shippingZones,
        {
          governorate,
          area,
          fee,
          enabled: true,
        },
      ],
    }));
    setNewShippingZone({ governorate: '', area: '', fee: '' });
  };

  const handleRemoveShippingZone = (zoneIndex) => {
    setSettings((prev) => ({
      ...prev,
      shippingZones: prev.shippingZones.filter((_, index) => index !== zoneIndex),
    }));
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="page-title">Settings</h1>
        <p>Loading settings...</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="page-title">Settings</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Site Info */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <MdStore size={22} style={{ color: '#2D5016' }} />
            <h3 style={{ fontSize: '1.1rem', color: '#142016' }}>Site Information</h3>
          </div>

          <div className="form-group">
            <label>Site Name</label>
            <input
              className="form-control"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Tagline</label>
            <input
              className="form-control"
              name="tagline"
              value={settings.tagline}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Banner */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <MdCampaign size={22} style={{ color: '#2D5016' }} />
            <h3 style={{ fontSize: '1.1rem', color: '#142016' }}>Banner & Announcements</h3>
          </div>

          <div className="form-group">
            <label>Banner Text</label>
            <input
              className="form-control"
              name="bannerText"
              value={settings.bannerText}
              onChange={handleChange}
              placeholder="Announcement text shown on site"
            />
          </div>

          {settings.bannerText && (
            <div
              style={{
                background: '#1A2E0A',
                color: '#C4A265',
                padding: '10px 16px',
                borderRadius: 8,
                fontSize: '0.85rem',
                textAlign: 'center',
                fontWeight: 600,
              }}
            >
              Preview: {settings.bannerText}
            </div>
          )}
        </div>

        {/* Hero Section Settings */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <MdImage size={22} style={{ color: '#2D5016' }} />
            <h3 style={{ fontSize: '1.1rem', color: '#142016' }}>Hero Section</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#4d564a', marginBottom: 16 }}>
            Customize the main hero section that appears on the homepage.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label>Subtitle (above title)</label>
              <input
                className="form-control"
                name="heroSubtitle"
                value={settings.heroSubtitle}
                onChange={handleChange}
                placeholder="e.g. Luxury Fragrances"
              />
            </div>

            <div className="form-group">
              <label>Title (main heading)</label>
              <input
                className="form-control"
                name="heroTitle"
                value={settings.heroTitle}
                onChange={handleChange}
                placeholder="e.g. Discover Your"
              />
            </div>

            <div className="form-group">
              <label>Title Highlight (italic gold text)</label>
              <input
                className="form-control"
                name="heroTitleHighlight"
                value={settings.heroTitleHighlight}
                onChange={handleChange}
                placeholder="e.g. Signature Scent"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-control"
                name="heroDescription"
                value={settings.heroDescription}
                onChange={handleChange}
                rows={2}
                placeholder="Description text below the title"
              />
            </div>

            <div className="form-group">
              <label>Primary Button Text</label>
              <input
                className="form-control"
                name="heroPrimaryButtonText"
                value={settings.heroPrimaryButtonText}
                onChange={handleChange}
                placeholder="Shop Now"
              />
            </div>

            <div className="form-group">
              <label>Primary Button Link</label>
              <input
                className="form-control"
                name="heroPrimaryButtonLink"
                value={settings.heroPrimaryButtonLink}
                onChange={handleChange}
                placeholder="/shop"
              />
            </div>

            <div className="form-group">
              <label>Secondary Button Text</label>
              <input
                className="form-control"
                name="heroSecondaryButtonText"
                value={settings.heroSecondaryButtonText}
                onChange={handleChange}
                placeholder="View Collection"
              />
            </div>

            <div className="form-group">
              <label>Secondary Button Link</label>
              <input
                className="form-control"
                name="heroSecondaryButtonLink"
                value={settings.heroSecondaryButtonLink}
                onChange={handleChange}
                placeholder="/shop"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: 16 }}>
            <label>Hero Background Image (optional)</label>
            <p style={{ fontSize: '0.8rem', color: '#4d564a', marginBottom: 8 }}>
              Upload an image to use as the hero background. Leave empty for the default gradient.
            </p>
            <ImageUpload images={heroImages} onChange={setHeroImages} maxImages={1} />
          </div>

          {/* Hero Preview */}
          <div
            style={{
              marginTop: 16,
              background: heroImages[0]
                ? `url(${resolveMediaUrl(heroImages[0])}) center/cover no-repeat`
                : 'linear-gradient(135deg, #1A2E0A 0%, #2D5016 50%, #3D6B1E 100%)',
              borderRadius: 12,
              padding: '40px 32px',
              textAlign: 'center',
              color: '#fff',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {heroImages[0] && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
            )}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ fontSize: '0.7rem', letterSpacing: '4px', color: '#C4A265', marginBottom: 8, textTransform: 'uppercase' }}>
                {settings.heroSubtitle || 'Subtitle'}
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.5rem',
                  fontWeight: 400,
                  marginBottom: 8,
                  color: '#FAF8F5',
                }}
              >
                {settings.heroTitle || 'Title'} <br />
                <span style={{ fontStyle: 'italic', color: '#C4A265' }}>{settings.heroTitleHighlight || 'Highlight'}</span>
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'rgba(250,248,245,0.88)', maxWidth: 400, margin: '0 auto' }}>
                {settings.heroDescription || 'Description text'}
              </p>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <MdLink size={22} style={{ color: '#2D5016' }} />
              <h3 style={{ fontSize: '1.1rem', color: '#142016' }}>Social Links</h3>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowAddLink(!showAddLink)}
            >
              <MdAdd size={16} /> Add Link
            </button>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#4d564a', marginBottom: 16 }}>
            Manage social media links shown in the navbar and/or footer.
          </p>

          {/* Add New Link Form */}
          {showAddLink && (
            <div style={{ background: '#FAF8F5', borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.8rem' }}>Platform</label>
                  <input
                    className="form-control"
                    value={newLink.platform}
                    onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                    placeholder="e.g. Instagram"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.8rem' }}>URL</label>
                  <input
                    className="form-control"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.8rem' }}>Icon</label>
                  <select
                    className="form-control"
                    value={newLink.icon}
                    onChange={(e) => setNewLink({ ...newLink, icon: e.target.value })}
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.8rem' }}>Show In</label>
                  <select
                    className="form-control"
                    value={newLink.location}
                    onChange={(e) => setNewLink({ ...newLink, location: e.target.value })}
                  >
                    <option value="both">Both</option>
                    <option value="navbar">Navbar Only</option>
                    <option value="footer">Footer Only</option>
                  </select>
                </div>
                <button className="btn btn-primary" onClick={handleAddSocialLink} style={{ height: 42 }}>
                  <MdAdd size={16} /> Add
                </button>
              </div>
            </div>
          )}

          {/* Social Links List */}
          {settings.socialLinks.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#4d564a', padding: '20px 0' }}>No social links configured</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {settings.socialLinks.map((link) => (
                <div
                  key={link._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '12px 16px',
                    background: link.enabled ? '#fff' : '#f5f5f5',
                    border: '1px solid #e0d8cc',
                    borderRadius: 8,
                    opacity: link.enabled ? 1 : 0.6,
                  }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#2D5016', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>
                    {(link.platform || '?')[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{link.platform}</div>
                    <div style={{ fontSize: '0.75rem', color: '#4d564a', wordBreak: 'break-all' }}>{link.url}</div>
                  </div>
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: '#F5F0E8',
                    color: '#8B7355',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}>
                    {link.location}
                  </span>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={link.enabled}
                      onChange={() => handleToggleSocialLink(link._id)}
                    />
                    <span style={{ fontSize: '0.75rem' }}>Enabled</span>
                  </label>
                  <button
                    onClick={() => handleRemoveSocialLink(link._id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#e74c3c',
                      cursor: 'pointer',
                      padding: 4,
                      display: 'flex',
                    }}
                    title="Remove"
                  >
                    <MdDelete size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <MdLocalShipping size={22} style={{ color: '#2D5016' }} />
            <h3 style={{ fontSize: '1.1rem', color: '#142016' }}>Egypt Shipping Zones</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#4d564a', marginBottom: 16 }}>
            Set shipping fee per governorate and area. Use area <strong>all</strong> (or *) as a governorate-wide default.
          </p>

          <div style={{ background: '#FAF8F5', borderRadius: 8, padding: 16, marginBottom: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 180px auto', gap: 12, alignItems: 'end' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.8rem' }}>Governorate</label>
                <input
                  className="form-control"
                  value={newShippingZone.governorate}
                  onChange={(e) => setNewShippingZone({ ...newShippingZone, governorate: e.target.value })}
                  placeholder="e.g. Cairo"
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.8rem' }}>Area</label>
                <input
                  className="form-control"
                  value={newShippingZone.area}
                  onChange={(e) => setNewShippingZone({ ...newShippingZone, area: e.target.value })}
                  placeholder="e.g. Nasr City or all"
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.8rem' }}>Fee (EGP)</label>
                <input
                  className="form-control"
                  type="number"
                  min="0"
                  value={newShippingZone.fee}
                  onChange={(e) => setNewShippingZone({ ...newShippingZone, fee: e.target.value })}
                />
              </div>
              <button className="btn btn-primary" onClick={handleAddShippingZone} style={{ height: 42 }}>
                <MdAdd size={16} /> Add Zone
              </button>
            </div>
          </div>

          {settings.shippingZones.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#4d564a', padding: '14px 0' }}>No shipping zones configured</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {settings.shippingZones.map((zone, index) => (
                <div
                  key={zone._id || `${zone.governorate}-${zone.area}-${index}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 160px auto auto',
                    gap: 10,
                    alignItems: 'center',
                    padding: 12,
                    border: '1px solid #e0d8cc',
                    borderRadius: 8,
                  }}
                >
                  <input
                    className="form-control"
                    value={zone.governorate}
                    onChange={(e) => handleShippingZoneChange(index, 'governorate', e.target.value)}
                  />
                  <input
                    className="form-control"
                    value={zone.area}
                    onChange={(e) => handleShippingZoneChange(index, 'area', e.target.value)}
                  />
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    value={zone.fee}
                    onChange={(e) => handleShippingZoneChange(index, 'fee', e.target.value)}
                  />
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '0.82rem' }}>
                    <input
                      type="checkbox"
                      checked={zone.enabled !== false}
                      onChange={(e) => handleShippingZoneChange(index, 'enabled', e.target.checked)}
                    />
                    Enabled
                  </label>
                  <button
                    onClick={() => handleRemoveShippingZone(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#e74c3c',
                      cursor: 'pointer',
                      padding: 4,
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                    title="Remove zone"
                  >
                    <MdDelete size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── About Us Section ── */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <MdInfo size={22} style={{ color: '#2D5016' }} />
            <h3 style={{ fontSize: '1.1rem', color: '#142016' }}>About Us Page</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#4d564a', marginBottom: 20 }}>
            Customize the About Us page — your brand story, mission, statistics, and core values.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label>Page Title</label>
              <input className="form-control" name="aboutTitle" value={settings.aboutTitle} onChange={handleChange} placeholder="e.g. Our Story" />
            </div>
            <div className="form-group">
              <label>Page Subtitle</label>
              <input className="form-control" name="aboutSubtitle" value={settings.aboutSubtitle} onChange={handleChange} placeholder="e.g. A Luxury Egyptian Perfume House" />
            </div>
            <div className="form-group">
              <label>Founded Year</label>
              <input className="form-control" name="aboutFoundedYear" value={settings.aboutFoundedYear} onChange={handleChange} placeholder="e.g. 2020" />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: 8 }}>
            <label>Brand Story</label>
            <textarea className="form-control" name="aboutStory" value={settings.aboutStory} onChange={handleChange} rows={4} placeholder="Write your brand story..." />
          </div>
          <div className="form-group">
            <label>Mission Statement</label>
            <textarea className="form-control" name="aboutMission" value={settings.aboutMission} onChange={handleChange} rows={3} placeholder="Your brand mission..." />
          </div>

          <div className="form-group">
            <label>About Page Background Image (optional)</label>
            <ImageUpload images={aboutImages} onChange={setAboutImages} maxImages={1} />
          </div>

          {/* Brand Values */}
          <div style={{ marginTop: 20, marginBottom: 8, fontWeight: 600, color: '#142016', fontSize: '0.95rem' }}>Brand Values (3)</div>
          <p style={{ fontSize: '0.8rem', color: '#4d564a', marginBottom: 12 }}>These appear as cards on the About Us page.</p>
          {[1, 2, 3].map((n) => (
            <div key={n} style={{ background: '#FAF8F5', borderRadius: 8, padding: 16, marginBottom: 12 }}>
              <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#4a6741', marginBottom: 10 }}>Value {n}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.8rem' }}>Title</label>
                  <input
                    className="form-control"
                    name={`aboutValue${n}Title`}
                    value={settings[`aboutValue${n}Title`]}
                    onChange={handleChange}
                    placeholder="e.g. Authenticity"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.8rem' }}>Description</label>
                  <input
                    className="form-control"
                    name={`aboutValue${n}Desc`}
                    value={settings[`aboutValue${n}Desc`]}
                    onChange={handleChange}
                    placeholder="Short description..."
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Stats */}
          <div style={{ marginTop: 20, marginBottom: 8, fontWeight: 600, color: '#142016', fontSize: '0.95rem' }}>Stats / Numbers (4)</div>
          <p style={{ fontSize: '0.8rem', color: '#4d564a', marginBottom: 12 }}>Bold statistics shown in the dark band on the About Us page.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[1, 2, 3, 4].map((n) => (
              <div key={n} style={{ background: '#FAF8F5', borderRadius: 8, padding: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.75rem' }}>Value</label>
                  <input
                    className="form-control"
                    name={`aboutStat${n}Value`}
                    value={settings[`aboutStat${n}Value`]}
                    onChange={handleChange}
                    placeholder="e.g. 5+"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.75rem' }}>Label</label>
                  <input
                    className="form-control"
                    name={`aboutStat${n}Label`}
                    value={settings[`aboutStat${n}Label`]}
                    onChange={handleChange}
                    placeholder="e.g. Years of Excellence"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div style={{ marginTop: 24 }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving}
          style={{ padding: '14px 32px', fontSize: '1rem' }}
        >
          <MdSave size={20} />
          {saving ? 'Saving...' : 'Save All Settings'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Settings;
