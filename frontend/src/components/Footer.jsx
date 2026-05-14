import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiInstagram,
  FiFacebook,
  FiTwitter,
  FiMail,
  FiArrowRight,
  FiYoutube,
  FiLinkedin,
  FiPhone,
  FiGlobe,
  FiMusic,
  FiMessageCircle,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import AnimatedSection from './AnimatedSection';
import API from '../api/axios';

const ICON_MAP = {
  FiInstagram,
  FiFacebook,
  FiTwitter,
  FiMail,
  FiYoutube,
  FiLinkedin,
  FiPhone,
  FiGlobe,
  FiMusic,
  FiMessageCircle,
};

const isRenderableLink = (url) => {
  const raw = String(url || '').trim();
  const normalized = raw.toLowerCase();
  if (!normalized || normalized === '#') return false;

  if (raw.startsWith('/')) return true;

  try {
    const parsed = new URL(raw);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

const Footer = () => {
  const [email, setEmail] = useState('');
  const [socialLinks, setSocialLinks] = useState([]);
  const [siteName, setSiteName] = useState('vybe');
  const [tagline, setTagline] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await API.get('/settings');
        setSiteName(data.siteName || 'vybe');
        setTagline(data.tagline || '');
        const links = (data.socialLinks || []).filter(
          (link) =>
            link.enabled &&
            (link.location === 'footer' || link.location === 'both') &&
            isRenderableLink(link.url)
        );
        setSocialLinks(links);
      } catch {
        setSocialLinks([]);
      }
    };
    fetchSettings();
  }, []);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    toast.success('Subscribed successfully!');
    setEmail('');
  };

  const styles = {
    footer: {
      background: 'linear-gradient(180deg, #dde3d8 0%, #cfd8cc 100%)',
      color: 'var(--text)',
      padding: '5rem 0 2rem',
      marginTop: '4rem',
      borderTop: '1px solid var(--gray-300)',
    },
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 1.5rem',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '3rem',
      marginBottom: '3rem',
    },
    logo: {
      fontFamily: 'var(--font-heading)',
      fontSize: '1.7rem',
      fontWeight: 600,
      color: 'var(--primary)',
      letterSpacing: '1px',
      textTransform: 'lowercase',
      marginBottom: '1rem',
    },
    desc: {
      fontSize: '0.9rem',
      lineHeight: 1.8,
      opacity: 0.92,
      maxWidth: '300px',
    },
    heading: {
      fontFamily: 'var(--font-heading)',
      fontSize: '1.1rem',
      color: 'var(--text)',
      marginBottom: '1.25rem',
      fontWeight: 500,
    },
    linkList: {
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
    },
    link: {
      fontSize: '0.9rem',
      color: 'var(--text-muted)',
      opacity: 0.95,
      transition: 'opacity 0.3s',
    },
    form: {
      display: 'flex',
      gap: '0',
    },
    input: {
      flex: 1,
      padding: '0.75rem 1rem',
      border: '1px solid var(--gray-300)',
      borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)',
      backgroundColor: 'var(--white)',
      color: 'var(--text)',
      fontSize: '0.9rem',
      outline: 'none',
    },
    submitBtn: {
      padding: '0.75rem 1rem',
      backgroundColor: 'var(--primary)',
      color: '#fff',
      border: 'none',
      borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      fontSize: '1rem',
    },
    socials: {
      display: 'flex',
      gap: '1rem',
      marginTop: '1.5rem',
    },
    socialIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      border: '1px solid var(--gray-300)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text)',
      fontSize: '1rem',
      transition: 'all 0.3s',
      cursor: 'pointer',
      backgroundColor: 'transparent',
      textDecoration: 'none',
    },
    divider: {
      borderTop: '1px solid var(--gray-300)',
      paddingTop: '2rem',
      textAlign: 'center',
      fontSize: '0.85rem',
      color: 'var(--text-muted)',
      opacity: 0.9,
    },
    craftedBy: {
      marginTop: '0.6rem',
      fontSize: '0.82rem',
      color: 'var(--text-muted)',
    },
    craftedLink: {
      display: 'inline-block',
      fontWeight: 600,
      background: 'linear-gradient(90deg, #6b8f71, #3d6b44, #6b8f71)',
      backgroundSize: '200% auto',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textDecoration: 'none',
      animation: 'footerShimmer 2.5s linear infinite',
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <AnimatedSection>
          <div style={styles.grid}>
            <div>
              <div style={styles.logo}>{siteName}</div>
              <p style={styles.desc}>
                {tagline || 'Luxury fragrances.'}
              </p>
              <div style={styles.socials}>
                {socialLinks.map((link, i) => {
                  const IconComponent = ICON_MAP[link.icon] || FiGlobe;
                  return (
                    <a
                      key={link._id || i}
                      href={link.url}
                      target={link.url.startsWith('mailto:') ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      style={styles.socialIcon}
                      aria-label={link.platform}
                      title={link.platform}
                    >
                      <IconComponent />
                    </a>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 style={styles.heading}>Quick Links</h4>
              <ul style={styles.linkList}>
                {[
                  { label: 'Shop All', to: '/shop' },
                  { label: 'New Arrivals', to: '/shop?sort=newest' },
                  { label: 'Best Sellers', to: '/shop?sort=rating' },
                  { label: 'On Sale', to: '/shop?sale=true' },
                ].map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} style={styles.link}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={styles.heading}>Help</h4>
              <ul style={styles.linkList}>
                {[
                  { label: 'Contact Us', to: '/contact' },
                  { label: 'Shipping Info', to: '/shipping' },
                  { label: 'Returns', to: '/returns' },
                  { label: 'FAQ', to: '/faq' },
                ].map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} style={styles.link}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={styles.heading}>Newsletter</h4>
              <p style={{ ...styles.desc, marginBottom: '1rem' }}>
                Subscribe for exclusive offers and new arrivals.
              </p>
              <form onSubmit={handleNewsletter} style={styles.form}>
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                />
                <button type="submit" style={styles.submitBtn} aria-label="Subscribe">
                  <FiArrowRight />
                </button>
              </form>
            </div>
          </div>
        </AnimatedSection>

        <div style={styles.divider}>
          <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <p style={styles.craftedBy}>
            Crafted by{' '}
            <a
              href="https://MOHAMEDelfouly.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.craftedLink}
            >
              Mohamed Elfouly
            </a>
          </p>
          <style>{`
            @keyframes footerShimmer {
              0% { background-position: 0% center; }
              100% { background-position: 200% center; }
            }
          `}</style>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
