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
          (link) => link.enabled && (link.location === 'footer' || link.location === 'both')
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
      backgroundColor: '#2a0c0c',
      color: 'rgba(242,235,227,0.86)',
      padding: '5rem 0 2rem',
      marginTop: '4rem',
      borderTop: '1px solid rgba(242,235,227,0.15)',
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
      color: '#F2EBE3',
      letterSpacing: '1px',
      textTransform: 'lowercase',
      marginBottom: '1rem',
    },
    desc: {
      fontSize: '0.9rem',
      lineHeight: 1.8,
      opacity: 0.7,
      maxWidth: '300px',
    },
    heading: {
      fontFamily: 'var(--font-heading)',
      fontSize: '1.1rem',
      color: '#f2ebe3',
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
      opacity: 0.7,
      transition: 'opacity 0.3s',
    },
    form: {
      display: 'flex',
      gap: '0',
    },
    input: {
      flex: 1,
      padding: '0.75rem 1rem',
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)',
      backgroundColor: 'rgba(242,235,227,0.06)',
      color: '#f2ebe3',
      fontSize: '0.9rem',
      outline: 'none',
    },
    submitBtn: {
      padding: '0.75rem 1rem',
      backgroundColor: '#f2ebe3',
      color: '#3a1010',
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
      border: '1px solid rgba(255,255,255,0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#f2ebe3',
      fontSize: '1rem',
      transition: 'all 0.3s',
      cursor: 'pointer',
      backgroundColor: 'transparent',
      textDecoration: 'none',
    },
    divider: {
      borderTop: '1px solid rgba(255,255,255,0.1)',
      paddingTop: '2rem',
      textAlign: 'center',
      fontSize: '0.85rem',
      opacity: 0.5,
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
                {['Shop All', 'New Arrivals', 'Best Sellers', 'On Sale'].map((text) => (
                  <li key={text}>
                    <Link to="/shop" style={styles.link}>
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={styles.heading}>Help</h4>
              <ul style={styles.linkList}>
                {['Contact Us', 'Shipping Info', 'Returns', 'FAQ'].map((text) => (
                  <li key={text}>
                    <Link to="/" style={styles.link}>
                      {text}
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
        </div>
      </div>
    </footer>
  );
};

export default Footer;
