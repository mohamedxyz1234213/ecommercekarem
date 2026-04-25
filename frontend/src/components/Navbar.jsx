import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
/* framer-motion — `motion` is used as Motion.div / Motion.a / etc. */
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
  FiShoppingBag,
  FiHeart,
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
  FiSearch,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
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
  const [siteName, setSiteName] = useState('Vybe');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const { isAuthenticated, logout } = useAuth();
  const { cartCount, setIsDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [mobileOpen]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await API.get('/settings');
        setSiteName(data.siteName || 'Vybe');
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

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/shop?search=${encodeURIComponent(q)}`);
    } else {
      navigate('/shop');
    }
    setSearchOpen(false);
    setSearchQuery('');
  };

  const lightNav = scrolled || !isHome;
  const onHeroCream = '#f2ebe3';
  const ink = '#142016';
  const navText = lightNav ? ink : onHeroCream;

  const links = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'About Us', path: '/about' },
  ];

  const styles = {
    nav: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      padding: scrolled ? '0.75rem 0' : '1.25rem 0',
      backgroundColor: lightNav ? 'rgba(248, 246, 242, 0.94)' : 'transparent',
      backdropFilter: lightNav ? 'blur(20px)' : 'none',
      boxShadow: lightNav ? 'var(--shadow-sm)' : 'none',
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
      fontSize: '1.85rem',
      fontWeight: 650,
      color: navText,
      letterSpacing: '1.5px',
      textTransform: '',
      cursor: 'pointer',
      marginLeft: '1rem',
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
      color: navText,
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
      color: navText,
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
      fontSize: '0.85rem',
      fontWeight: 700,
      width: '18px',
      height: '18px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    authBtn: {
      backgroundColor: lightNav ? 'var(--primary)' : 'rgba(242, 235, 227, 0.14)',
      color: lightNav ? '#fff' : navText,
      border: lightNav ? '1px solid var(--primary)' : '1px solid rgba(242, 235, 227, 0.55)',
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
      color: navText,
      fontSize: '1.5rem',
      cursor: 'pointer',
    },
    mobileMenuShell: {
      position: 'fixed',
      inset: 0,
      zIndex: 1001,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-gradient)',
      paddingTop: 'max(env(safe-area-inset-top), 0px)',
      paddingBottom: 'max(env(safe-area-inset-bottom), 0px)',
      paddingLeft: 'max(env(safe-area-inset-left), 0px)',
      paddingRight: 'max(env(safe-area-inset-right), 0px)',
      overflow: 'hidden',
    },
    mobileMenuHeader: {
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.25rem 1.5rem',
      borderBottom: '1px solid var(--gray-200)',
    },
    mobileMenuBrand: {
      fontFamily: 'var(--font-heading)',
      fontSize: '1.35rem',
      fontWeight: 600,
      color: 'var(--text)',
      letterSpacing: '0.06em',
      textDecoration: 'none',
    },
    mobileClose: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 48,
      height: 48,
      borderRadius: '50%',
      background: 'var(--gray-100)',
      border: '1px solid var(--gray-200)',
      fontSize: '1.35rem',
      color: 'var(--text)',
      cursor: 'pointer',
      transition: 'background 0.2s ease, transform 0.2s ease',
    },
    mobileMenuBody: {
      flex: 1,
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
      padding: '2rem 1.5rem 2.5rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: 0,
    },
    mobileLink: {
      fontFamily: 'var(--font-heading)',
      fontSize: 'clamp(1.85rem, 7.5vw, 2.75rem)',
      fontWeight: 400,
      color: 'var(--text)',
      padding: '0.65rem 0',
      display: 'block',
      textDecoration: 'none',
      letterSpacing: '0.02em',
      lineHeight: 1.15,
      borderBottom: '1px solid var(--gray-200)',
    },
    mobileLinkMuted: {
      fontFamily: 'var(--font-body)',
      fontSize: '1rem',
      fontWeight: 500,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
    },
    mobileMenuFooter: {
      flexShrink: 0,
      padding: '1.25rem 1.5rem 1.5rem',
      borderTop: '1px solid var(--gray-200)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center',
    },
    mobileSocialRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.75rem',
      justifyContent: 'center',
    },
    mobileSocialIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 44,
      height: 44,
      borderRadius: '50%',
      background: 'var(--white)',
      border: '1px solid var(--gray-200)',
      color: 'var(--text)',
      fontSize: '1.1rem',
    },
  };

  const menuContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.065,
        delayChildren: 0.1,
      },
    },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, y: 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 380, damping: 32, mass: 0.85 },
    },
  };

  const menuRevealVariants = {
    hidden: { opacity: 0, clipPath: 'inset(0 0 100% 0)' },
    show: {
      opacity: 1,
      clipPath: 'inset(0 0 0% 0)',
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      opacity: 0,
      clipPath: 'inset(0 0 100% 0)',
      transition: { duration: 0.36, ease: [0.4, 0, 1, 1] },
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
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
            >
              <FiSearch />
            </button>
            <button
              style={styles.iconBtn}
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open cart"
            >
              <FiShoppingBag />
              {cartCount > 0 && (
                <Motion.span
                  style={styles.badge}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={cartCount}
                >
                  {cartCount}
                </Motion.span>
              )}
            </button>

            {isAuthenticated ? (
              <>
                <button
                  style={styles.iconBtn}
                  onClick={() => navigate('/profile#wishlist')}
                  aria-label="Wishlist"
                >
                  <FiHeart />
                  {wishlistCount > 0 && (
                    <Motion.span
                      style={styles.badge}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      key={wishlistCount}
                    >
                      {wishlistCount}
                    </Motion.span>
                  )}
                </button>
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
        {searchOpen && (
          <Motion.div
            key="search-bar"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed',
              top: scrolled ? '58px' : '72px',
              left: 0,
              right: 0,
              zIndex: 999,
              backgroundColor: 'rgba(248, 246, 242, 0.97)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 4px 20px rgba(20, 32, 22, 0.1)',
              padding: '0.85rem 1.5rem',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <form
              onSubmit={handleSearchSubmit}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                width: '100%',
                maxWidth: '540px',
              }}
            >
              <FiSearch style={{ color: 'var(--text-muted)', fontSize: '1.1rem', flexShrink: 0 }} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search perfumes…"
                style={{
                  flex: 1,
                  border: 'none',
                  borderBottom: '1.5px solid var(--gray-300)',
                  borderRadius: 0,
                  padding: '0.35rem 0.25rem',
                  fontSize: '1rem',
                  background: 'transparent',
                  color: 'var(--text)',
                  outline: 'none',
                  boxShadow: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '0.4rem 1.1rem',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px',
                  flexShrink: 0,
                }}
                aria-label="Close search"
              >
                <FiX />
              </button>
            </form>
          </Motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <Motion.div
            key="mobile-full-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            style={styles.mobileMenuShell}
            variants={menuRevealVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <header style={styles.mobileMenuHeader}>
              <Link to="/" style={styles.mobileMenuBrand} onClick={() => setMobileOpen(false)}>
                {siteName}
              </Link>
              <Motion.button
                type="button"
                style={styles.mobileClose}
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                whileTap={{ scale: 0.94 }}
                whileHover={{ backgroundColor: 'var(--gray-200)' }}
              >
                <FiX />
              </Motion.button>
            </header>

            <Motion.div
              style={styles.mobileMenuBody}
              variants={menuContainerVariants}
              initial="hidden"
              animate="show"
            >
              <Motion.div variants={menuItemVariants} style={{ width: '100%', paddingBottom: '1rem' }}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const q = searchQuery.trim();
                    navigate(q ? `/shop?search=${encodeURIComponent(q)}` : '/shop');
                    setSearchQuery('');
                    setMobileOpen(false);
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1.5px solid var(--gray-300)', paddingBottom: '0.5rem' }}
                >
                  <FiSearch style={{ color: 'var(--text-muted)', fontSize: '1.1rem', flexShrink: 0 }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search perfumes…"
                    style={{
                      flex: 1,
                      border: 'none',
                      borderRadius: 0,
                      padding: '0.35rem 0.25rem',
                      fontSize: '1rem',
                      background: 'transparent',
                      color: 'var(--text)',
                      outline: 'none',
                      boxShadow: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '0.4rem 1rem',
                      backgroundColor: 'var(--primary)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Go
                  </button>
                </form>
              </Motion.div>
              {links.map((link) => (
                <Motion.div key={link.path} variants={menuItemVariants} style={{ width: '100%' }}>
                  <Link
                    to={link.path}
                    style={styles.mobileLink}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </Motion.div>
              ))}
              <Motion.div variants={menuItemVariants} style={{ width: '100%' }}>
                <Link
                  to="/cart"
                  style={{ ...styles.mobileLink, ...styles.mobileLinkMuted }}
                  onClick={() => setMobileOpen(false)}
                >
                  Cart {cartCount > 0 ? `· ${cartCount}` : ''}
                </Link>
              </Motion.div>
              {isAuthenticated ? (
                <>
                  <Motion.div variants={menuItemVariants} style={{ width: '100%' }}>
                    <Link
                      to="/profile"
                      style={styles.mobileLink}
                      onClick={() => setMobileOpen(false)}
                    >
                      Profile
                    </Link>
                  </Motion.div>
                  <Motion.div variants={menuItemVariants} style={{ width: '100%' }}>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      style={{
                        ...styles.mobileLink,
                        ...styles.mobileLinkMuted,
                        background: 'none',
                        textAlign: 'left',
                        width: '100%',
                        cursor: 'pointer',
                        border: 'none',
                        borderBottom: '1px solid var(--gray-200)',
                      }}
                    >
                      Logout
                    </button>
                  </Motion.div>
                </>
              ) : (
                <>
                  <Motion.div variants={menuItemVariants} style={{ width: '100%' }}>
                    <Link
                      to="/login"
                      style={{ ...styles.mobileLink, ...styles.mobileLinkMuted }}
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign In
                    </Link>
                  </Motion.div>
                  <Motion.div variants={menuItemVariants} style={{ width: '100%' }}>
                    <Link
                      to="/register"
                      style={{ ...styles.mobileLink, ...styles.mobileLinkMuted }}
                      onClick={() => setMobileOpen(false)}
                    >
                      Create Account
                    </Link>
                  </Motion.div>
                </>
              )}
            </Motion.div>

            {socialLinks.length > 0 && (
              <Motion.footer
                style={styles.mobileMenuFooter}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <span
                  style={{
                    fontSize: '0.7rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                  }}
                >
                  Follow us
                </span>
                <div style={styles.mobileSocialRow}>
                  {socialLinks.map((sl, i) => {
                    const IconComponent = ICON_MAP[sl.icon] || FiGlobe;
                    return (
                      <Motion.a
                        key={sl._id || i}
                        href={sl.url}
                        target={sl.url.startsWith('mailto:') ? undefined : '_blank'}
                        rel="noopener noreferrer"
                        style={styles.mobileSocialIcon}
                        aria-label={sl.platform}
                        title={sl.platform}
                        onClick={() => setMobileOpen(false)}
                        whileTap={{ scale: 0.92 }}
                        whileHover={{ backgroundColor: 'var(--gray-100)' }}
                      >
                        <IconComponent />
                      </Motion.a>
                    );
                  })}
                </div>
              </Motion.footer>
            )}
          </Motion.div>
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
