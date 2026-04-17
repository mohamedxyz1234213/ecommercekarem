import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api/axios';
import AnimatedSection from './AnimatedSection';

const SaleBanner = () => {
  const [sale, setSale] = useState(null);
  const [siteName, setSiteName] = useState('vybe');

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const { data } = await API.get('/settings');
        setSiteName(data.siteName || 'vybe');
        if (data?.bannerText) {
          setSale({
            title: data.siteName || 'Announcement',
            description: data.bannerText,
            discount: 0,
          });
          return;
        }
      } catch {
        setSale(null);
      }
    };
    fetchSale();
  }, []);

  if (!sale) return null;

  const styles = {
    section: {
      padding: '5rem 0',
      background: 'linear-gradient(135deg, var(--dark) 0%, var(--primary) 100%)',
      position: 'relative',
      overflow: 'hidden',
    },
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 1.5rem',
      position: 'relative',
      zIndex: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      textAlign: 'center',
    },
    badge: {
      display: 'inline-block',
      backgroundColor: 'var(--gold)',
      color: 'var(--dark)',
      fontSize: '0.75rem',
      fontWeight: 700,
      letterSpacing: '3px',
      textTransform: 'uppercase',
      padding: '0.4rem 1.25rem',
      borderRadius: 'var(--radius-xl)',
      marginBottom: '1.25rem',
    },
    heading: {
      fontFamily: 'var(--font-heading)',
      fontSize: 'clamp(2rem, 4vw, 3rem)',
      fontWeight: 500,
      color: '#fff',
      marginBottom: '1rem',
    },
    desc: {
      fontSize: '1.1rem',
      color: 'rgba(255,255,255,0.7)',
      marginBottom: '2rem',
      maxWidth: '500px',
    },
    btn: {
      padding: '0.9rem 2.5rem',
      backgroundColor: '#fff',
      color: 'var(--primary)',
      borderRadius: 'var(--radius-xl)',
      fontSize: '0.85rem',
      fontWeight: 700,
      letterSpacing: '2px',
      textTransform: 'uppercase',
      border: 'none',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block',
    },
    circle: {
      position: 'absolute',
      borderRadius: '50%',
      border: '1px solid rgba(255,255,255,0.05)',
    },
  };

  return (
    <section style={styles.section}>
      {/* Decorative circles */}
      <motion.div
        style={{ ...styles.circle, width: '300px', height: '300px', top: '-150px', right: '-50px' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        style={{ ...styles.circle, width: '200px', height: '200px', bottom: '-100px', left: '-50px' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />

      <div style={styles.container}>
        <AnimatedSection>
          <motion.span
            style={styles.badge}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Limited Time
          </motion.span>
          <h2 style={styles.heading}>{sale.title || siteName}</h2>
          <p style={styles.desc}>{sale.description}</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/shop" style={styles.btn}>
              Shop the Sale
            </Link>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default SaleBanner;
