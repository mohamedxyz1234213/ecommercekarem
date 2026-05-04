import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageSEO from '../utils/useSEO';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const NotFound = () => {
  const styles = {
    page: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      padding: '2rem',
      textAlign: 'center',
    },
    content: {
      maxWidth: '500px',
    },
    number: {
      fontFamily: 'var(--font-heading)',
      fontSize: 'clamp(6rem, 15vw, 10rem)',
      fontWeight: 700,
      color: 'var(--secondary)',
      lineHeight: 1,
      marginBottom: '0.5rem',
      background: 'linear-gradient(135deg, var(--primary), var(--gold))',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    title: {
      fontFamily: 'var(--font-heading)',
      fontSize: '1.75rem',
      fontWeight: 500,
      marginBottom: '1rem',
      color: 'var(--text)',
    },
    desc: {
      fontSize: '1rem',
      color: 'var(--text-muted)',
      lineHeight: 1.7,
      marginBottom: '2rem',
    },
    btn: {
      display: 'inline-block',
      padding: '0.9rem 2.5rem',
      backgroundColor: 'var(--primary)',
      color: '#fff',
      borderRadius: 'var(--radius-xl)',
      fontSize: '0.9rem',
      fontWeight: 600,
      letterSpacing: '1px',
      textDecoration: 'none',
    },
    linksGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '0.75rem',
      marginTop: '1.5rem',
    },
    linkItem: {
      padding: '0.55rem 1.25rem',
      border: '1px solid var(--gray-200)',
      borderRadius: 'var(--radius-sm)',
      fontSize: '0.85rem',
      color: 'var(--text)',
      textDecoration: 'none',
      backgroundColor: 'rgba(255,255,255,0.6)',
    },
  };

  return (
    <motion.div style={styles.page} variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageSEO title="404 — Page Not Found" description="The page you are looking for could not be found. Return to vybe and explore our luxury perfume collection." url="/404" />
      <div style={styles.content}>
        <motion.div
          style={styles.number}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          404
        </motion.div>
        <h1 style={styles.title}>Page Not Found</h1>
        <p style={styles.desc}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back to exploring our collection.
        </p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/" style={styles.btn}>
            Back to Home
          </Link>
        </motion.div>
        <div style={styles.linksGrid}>
          <Link to="/shop" style={styles.linkItem}>Shop All</Link>
          <Link to="/about" style={styles.linkItem}>About Us</Link>
          <Link to="/login" style={styles.linkItem}>Sign In</Link>
          <Link to="/track-order" style={styles.linkItem}>Track Order</Link>
        </div>
      </div>
    </motion.div>
  );
};

export default NotFound;
