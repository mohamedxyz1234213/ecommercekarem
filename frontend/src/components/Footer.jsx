import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter, FiMail, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import AnimatedSection from './AnimatedSection';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    toast.success('Subscribed successfully!');
    setEmail('');
  };

  const styles = {
    footer: {
      backgroundColor: 'var(--dark)',
      color: 'rgba(255,255,255,0.8)',
      padding: '5rem 0 2rem',
      marginTop: '4rem',
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
      fontSize: '1.75rem',
      fontWeight: 700,
      color: '#fff',
      letterSpacing: '3px',
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
      color: '#fff',
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
      backgroundColor: 'rgba(255,255,255,0.05)',
      color: '#fff',
      fontSize: '0.9rem',
      outline: 'none',
    },
    submitBtn: {
      padding: '0.75rem 1rem',
      backgroundColor: 'var(--gold)',
      color: 'var(--dark)',
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
      color: '#fff',
      fontSize: '1rem',
      transition: 'all 0.3s',
      cursor: 'pointer',
      backgroundColor: 'transparent',
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
              <div style={styles.logo}>KARÉME</div>
              <p style={styles.desc}>
                Discover the art of luxury fragrance. Each scent tells a story, crafted with the
                finest ingredients from around the world.
              </p>
              <div style={styles.socials}>
                {[FiInstagram, FiFacebook, FiTwitter, FiMail].map((Icon, i) => (
                  <button key={i} style={styles.socialIcon} aria-label="Social link">
                    <Icon />
                  </button>
                ))}
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
          <p>&copy; {new Date().getFullYear()} KARÉME. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
