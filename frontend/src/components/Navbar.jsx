import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiShoppingBag,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
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
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
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

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState([]);
  const [siteName, setSiteName] = useState('vybe');
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount, setIsDrawerOpen } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await API.get('/settings');
        setSiteName(data.siteName || 'vybe');
        const links = (data.socialLinks || []).filter(
          (link) => link.enabled && (link.location === 'navbar' || link.location === 'both')
        );
        setSocialLinks(links);
      } catch {
        // Ignore — no social links in navbar
      }
    };
    fetchSettings();
  }, []);

  const navBg = scrolled || !isHome ? 'rgba(58, 16, 16, 0.95)' : 'transparent';
  const textColor = '#F2EBE3';

  const links = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
  ];

  const styles = {
    nav: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      padding: scrolled ? '0.75rem 0' : '1.25rem 0',
      backgroundColor: navBg,
      backdropFilter: scrolled || !isHome ? 'blur(20px)' : 'none',
      boxShadow: scrolled || !isHome ? 'var(--shadow-sm)' : 'none',
      transition: 'all 0.4s ease',
    },
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    logo: {
      fontFamily: 'var(--font-heading)',
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#F2EBE3',
      letterSpacing: '1.5px',
      textTransform: 'lowercase',
      cursor: 'pointer',
    },
    linksDesktop: {
      display: 'flex',
      gap: '2.5rem',
      alignItems: 'center',
    },
    link: {
      fontSize: '0.9rem',
      fontWeight: 500,
      letterSpacing: '1px',
      textTransform: 'uppercase',
      color: textColor,
      position: 'relative',
    },
    actions: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.25rem',
    },
    iconBtn: {
      background: 'none',
      border: 'none',
      color: textColor,
      fontSize: '1.25rem',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      padding: '4px',
    },
    badge: {
      position: 'absolute',
      top: '-6px',
      right: '-8px',
      backgroundColor: 'var(--primary)',
      color: '#fff',
      fontSize: '0.65rem',
      fontWeight: 700,
      width: '18px',
      height: '18px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    authBtn: {
      backgroundColor: 'var(--secondary)',
      color: 'var(--primary)',
      border: '1px solid rgba(242,235,227,0.45)',
      padding: '0.5rem 1.5rem',
      borderRadius: 'var(--radius-xl)',
      fontSize: '0.85rem',
      fontWeight: 600,
      letterSpacing: '1px',
      cursor: 'pointer',
    },
    hamburger: {
      display: 'none',
      background: 'none',
      border: 'none',
      color: textColor,
      fontSize: '1.5rem',
      cursor: 'pointer',
    },
    mobileOverlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 999,
    },
    mobileMenu: {
      position: 'fixed',
      top: 0,
      right: 0,
      width: '280px',
      height: '100vh',
      backgroundColor: '#3a1010',
      zIndex: 1001,
      padding: '2rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    mobileClose: {
      alignSelf: 'flex-end',
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      color: '#f2ebe3',
      cursor: 'pointer',
    },
    mobileLink: {
      fontSize: '1.1rem',
      fontWeight: 500,
      color: '#f2ebe3',
      padding: '0.75rem 0',
      borderBottom: '1px solid rgba(242,235,227,0.2)',
      display: 'block',
    },
  };

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.container}>
          <Link to="/" style={styles.logo}>
            {siteName}
          </Link>

          <div style={styles.linksDesktop} className="nav-links-desktop">
            {links.map((link) => (
              <Link key={link.path} to={link.path} style={styles.link}>
                {link.label}
              </Link>
            ))}
            {socialLinks.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '0.5rem' }}>
                {socialLinks.map((sl, i) => {
                  const IconComponent = ICON_MAP[sl.icon] || FiGlobe;
                  return (
                    <a
                      key={sl._id || i}
                      href={sl.url}
                      target={sl.url.startsWith('mailto:') ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      style={{ ...styles.iconBtn, fontSize: '1rem' }}
                      aria-label={sl.platform}
                      title={sl.platform}
                    >
                      <IconComponent />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <div style={styles.actions}>
            <button
              style={styles.iconBtn}
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open cart"
            >
              <FiShoppingBag />
              {cartCount > 0 && (
                <motion.span
                  style={styles.badge}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={cartCount}
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            {isAuthenticated ? (
              <>
                <button
                  style={styles.iconBtn}
                  onClick={() => navigate('/profile')}
                  aria-label="Profile"
                >
                  <FiUser />
                </button>
                <button
                  style={styles.iconBtn}
                  onClick={logout}
                  aria-label="Logout"
                  title="Logout"
                >
                  <FiLogOut />
                </button>
              </>
            ) : (
              <button
                style={styles.authBtn}
                onClick={() => navigate('/login')}
                className="nav-auth-btn"
              >
                Sign In
              </button>
            )}

            <button
              style={styles.hamburger}
              className="hamburger-btn"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <FiMenu />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              style={styles.mobileOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              style={styles.mobileMenu}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <button
                style={styles.mobileClose}
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <FiX />
              </button>
              {links.map((link) => (
                <Link key={link.path} to={link.path} style={styles.mobileLink}>
                  {link.label}
                </Link>
              ))}
              <Link to="/cart" style={styles.mobileLink}>
                Cart ({cartCount})
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/profile" style={styles.mobileLink}>
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    style={{
                      ...styles.mobileLink,
                      background: 'none',
                      textAlign: 'left',
                      width: '100%',
                      cursor: 'pointer',
                      border: 'none',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" style={styles.mobileLink}>
                    Sign In
                  </Link>
                  <Link to="/register" style={styles.mobileLink}>
                    Create Account
                  </Link>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .hamburger-btn { display: flex !important; }
          .nav-auth-btn { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
