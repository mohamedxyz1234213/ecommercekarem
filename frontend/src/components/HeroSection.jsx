import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const HeroSection = () => {
  const [content, setContent] = useState({
    heroSubtitle: 'Luxury Fragrances',
    heroTitle: 'Discover Your',
    heroTitleHighlight: 'Signature Scent',
    heroDescription:
      "Curated collection of the world's finest perfumes, each telling a unique story of elegance and sophistication.",
    heroImage: '',
    heroPrimaryButtonText: 'Shop Now',
    heroPrimaryButtonLink: '/shop',
    heroSecondaryButtonText: 'View Collection',
    heroSecondaryButtonLink: '/shop',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await API.get('/settings');
        setContent((prev) => ({
          heroSubtitle: data.heroSubtitle || prev.heroSubtitle,
          heroTitle: data.heroTitle || prev.heroTitle,
          heroTitleHighlight: data.heroTitleHighlight || prev.heroTitleHighlight,
          heroDescription: data.heroDescription || prev.heroDescription,
          heroImage: data.heroImage || '',
          heroPrimaryButtonText: data.heroPrimaryButtonText || prev.heroPrimaryButtonText,
          heroPrimaryButtonLink: data.heroPrimaryButtonLink || prev.heroPrimaryButtonLink,
          heroSecondaryButtonText: data.heroSecondaryButtonText || prev.heroSecondaryButtonText,
          heroSecondaryButtonLink: data.heroSecondaryButtonLink || prev.heroSecondaryButtonLink,
        }));
      } catch {
        // Use defaults on error
      }
    };
    fetchSettings();
  }, []);

  const hasImage = !!content.heroImage;

  const styles = {
    hero: {
      position: 'relative',
      height: '100vh',
      minHeight: '600px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: hasImage
        ? `url(${content.heroImage}) center/cover no-repeat`
        : 'linear-gradient(135deg, var(--dark) 0%, #2D5016 50%, #3D6B1E 100%)',
    },
    overlay: {
      position: 'absolute',
      inset: 0,
      background: hasImage
        ? 'rgba(0, 0, 0, 0.55)'
        : 'radial-gradient(ellipse at 30% 50%, rgba(196, 162, 101, 0.08) 0%, transparent 50%), ' +
          'radial-gradient(ellipse at 70% 30%, rgba(245, 240, 232, 0.05) 0%, transparent 50%)',
    },
    content: {
      position: 'relative',
      zIndex: 2,
      textAlign: 'center',
      maxWidth: '800px',
      padding: '0 2rem',
    },
    subtitle: {
      fontFamily: 'var(--font-body)',
      fontSize: '0.9rem',
      fontWeight: 300,
      letterSpacing: '6px',
      textTransform: 'uppercase',
      color: 'var(--gold)',
      marginBottom: '1.5rem',
    },
    heading: {
      fontFamily: 'var(--font-heading)',
      fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
      fontWeight: 400,
      color: '#fff',
      lineHeight: 1.1,
      marginBottom: '1.5rem',
    },
    headingItalic: {
      fontStyle: 'italic',
      color: 'var(--gold)',
    },
    desc: {
      fontSize: '1.1rem',
      fontWeight: 300,
      color: 'rgba(255,255,255,0.7)',
      maxWidth: '520px',
      margin: '0 auto 2.5rem',
      lineHeight: 1.7,
    },
    btnRow: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    btnPrimary: {
      padding: '1rem 2.5rem',
      backgroundColor: 'var(--gold)',
      color: 'var(--dark)',
      borderRadius: 'var(--radius-xl)',
      fontSize: '0.9rem',
      fontWeight: 700,
      letterSpacing: '2px',
      textTransform: 'uppercase',
      border: 'none',
      cursor: 'pointer',
      display: 'inline-block',
      textDecoration: 'none',
    },
    btnSecondary: {
      padding: '1rem 2.5rem',
      backgroundColor: 'transparent',
      color: '#fff',
      borderRadius: 'var(--radius-xl)',
      fontSize: '0.9rem',
      fontWeight: 400,
      letterSpacing: '2px',
      textTransform: 'uppercase',
      border: '1px solid rgba(255,255,255,0.3)',
      cursor: 'pointer',
      display: 'inline-block',
      textDecoration: 'none',
    },
    floatingCircle: (size, top, left) => ({
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: '50%',
      border: '1px solid rgba(196, 162, 101, 0.1)',
      top,
      left,
    }),
    scrollHint: {
      position: 'absolute',
      bottom: '2rem',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem',
      color: 'rgba(255,255,255,0.4)',
      fontSize: '0.75rem',
      letterSpacing: '2px',
    },
  };

  return (
    <section style={styles.hero}>
      <div style={styles.overlay} />

      {/* Decorative circles */}
      {[
        { size: '400px', top: '-100px', left: '-100px', delay: 0 },
        { size: '300px', top: '60%', left: '80%', delay: 1 },
        { size: '200px', top: '20%', left: '70%', delay: 2 },
      ].map((c, i) => (
        <motion.div
          key={i}
          style={styles.floatingCircle(c.size, c.top, c.left)}
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, delay: c.delay }}
        />
      ))}

      <div style={styles.content}>
        <motion.p
          style={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {content.heroSubtitle}
        </motion.p>

        <motion.h1
          style={styles.heading}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {content.heroTitle} <br />
          <span style={styles.headingItalic}>{content.heroTitleHighlight}</span>
        </motion.h1>

        <motion.p
          style={styles.desc}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {content.heroDescription}
        </motion.p>

        <motion.div
          style={styles.btnRow}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <Link to={content.heroPrimaryButtonLink} style={styles.btnPrimary}>
            {content.heroPrimaryButtonText}
          </Link>
          <Link to={content.heroSecondaryButtonLink} style={styles.btnSecondary}>
            {content.heroSecondaryButtonText}
          </Link>
        </motion.div>
      </div>

      <motion.div
        style={styles.scrollHint}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span>SCROLL</span>
        <div style={{ width: '1px', height: '30px', backgroundColor: 'rgba(255,255,255,0.3)' }} />
      </motion.div>
    </section>
  );
};

export default HeroSection;
