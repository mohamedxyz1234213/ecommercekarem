import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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
  };

  return (
    <motion.div style={styles.page} variants={pageVariants} initial="initial" animate="animate" exit="exit">
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
      </div>
    </motion.div>
  );
};

export default NotFound;
