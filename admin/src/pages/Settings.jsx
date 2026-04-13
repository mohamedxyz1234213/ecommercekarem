import { useState } from 'react';
import { motion } from 'framer-motion';
import { MdSave, MdImage, MdStore, MdCampaign } from 'react-icons/md';
import ImageUpload from '../components/ImageUpload';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Perfume Store',
    tagline: 'Luxury Fragrances for Everyone',
    bannerText: 'Free shipping on orders over $100',
    saleEnabled: false,
    salePercentage: '',
    saleMessage: '',
  });
  const [logo, setLogo] = useState([]);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Placeholder - would save to API
    setTimeout(() => {
      toast.success('Settings saved successfully!');
      setSaving(false);
    }, 1000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="page-title">Settings</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Site Info */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <MdStore size={22} style={{ color: '#2D5016' }} />
            <h3 style={{ fontSize: '1.1rem' }}>Site Information</h3>
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

        {/* Logo */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <MdImage size={22} style={{ color: '#2D5016' }} />
            <h3 style={{ fontSize: '1.1rem' }}>Logo</h3>
          </div>
          <ImageUpload images={logo} onChange={setLogo} maxImages={1} />
        </div>

        {/* Banner */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <MdCampaign size={22} style={{ color: '#2D5016' }} />
            <h3 style={{ fontSize: '1.1rem' }}>Banner & Announcements</h3>
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

        {/* Sale Config */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <h3 style={{ fontSize: '1.1rem' }}>Sale Configuration</h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Enable Global Sale</label>
            <label className="toggle-switch">
              <input type="checkbox" name="saleEnabled" checked={settings.saleEnabled} onChange={handleChange} />
              <span className="toggle-slider" />
            </label>
          </div>

          {settings.saleEnabled && (
            <>
              <div className="form-group">
                <label>Sale Percentage (%)</label>
                <input
                  type="number"
                  className="form-control"
                  name="salePercentage"
                  value={settings.salePercentage}
                  onChange={handleChange}
                  placeholder="e.g. 20"
                  min="0"
                  max="100"
                />
              </div>
              <div className="form-group">
                <label>Sale Message</label>
                <input
                  className="form-control"
                  name="saleMessage"
                  value={settings.saleMessage}
                  onChange={handleChange}
                  placeholder="e.g. Summer Sale - Up to 20% off!"
                />
              </div>
            </>
          )}
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
          {saving ? 'Saving...' : 'Save Settings'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Settings;
