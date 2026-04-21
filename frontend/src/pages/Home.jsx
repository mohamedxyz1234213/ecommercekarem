import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import FeaturedProducts from '../components/FeaturedProducts';
import SaleBanner from '../components/SaleBanner';
import AnimatedSection from '../components/AnimatedSection';

const categories = [
  { label: 'Men', value: 'Men' },
  { label: 'Women', value: 'Women' },
  { label: 'Unisex', value: 'Unisex' },
];

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const Home = () => {
  const styles = {
    categories: {
      padding: '6rem 0',
      backgroundColor: 'var(--white)',
      boxShadow: 'inset 0 1px 0 var(--gray-200)',
    },
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 1.5rem',
    },
    sectionHeader: {
      textAlign: 'center',
      marginBottom: '3rem',
    },
    label: {
      fontSize: '0.8rem',
      fontWeight: 600,
      letterSpacing: '4px',
      textTransform: 'uppercase',
      color: 'var(--gold)',
      marginBottom: '0.75rem',
    },
    title: {
      fontFamily: 'var(--font-heading)',
      fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
      fontWeight: 500,
      color: 'var(--text)',
    },
    catStack: {
      maxWidth: '420px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    catBtn: {
      display: 'block',
      width: '100%',
      padding: '1.125rem 1.5rem',
      fontFamily: 'var(--font-heading)',
      fontSize: 'clamp(1.05rem, 2.5vw, 1.2rem)',
      fontWeight: 500,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      textAlign: 'center',
      textDecoration: 'none',
      color: '#f2ebe3',
      backgroundColor: '#014421',
      border: '1px solid rgba(1, 68, 33, 0.5)',
      borderRadius: '14px',
      cursor: 'pointer',
      boxShadow: '0 4px 20px rgba(1, 68, 33, 0.22)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
    },
    features: {
      padding: '5rem 0',
      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.55) 0%, #e8ebe6 100%)',
    },
    featGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '2.5rem',
      textAlign: 'center',
    },
    featItem: {
      padding: '2rem',
    },
    featIcon: {
      fontSize: '2rem',
      color: 'var(--gold)',
      marginBottom: '1rem',
    },
    featTitle: {
      fontFamily: 'var(--font-heading)',
      fontSize: '1.15rem',
      fontWeight: 500,
      marginBottom: '0.5rem',
      color: 'var(--text)',
    },
    featDesc: {
      fontSize: '0.9rem',
      color: 'var(--gray-500)',
      lineHeight: 1.7,
    },
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <HeroSection />
      <FeaturedProducts />
      <SaleBanner />

      {/* Categories Section */}
      <section style={styles.categories}>
        <div style={styles.container}>
          <AnimatedSection>
            <div style={styles.sectionHeader}>
              <p style={styles.label}>Collections</p>
              <h2 style={styles.title}>Shop by Category</h2>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div style={styles.catStack}>
              {categories.map((cat) => (
                <motion.div key={cat.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to={`/shop?category=${encodeURIComponent(cat.value)}`}
                    style={styles.catBtn}
                  >
                    {cat.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <div style={styles.container}>
          <AnimatedSection>
            <div style={styles.featGrid}>
              {[
                { icon: '✦', title: 'Authentic Products', desc: '100% genuine fragrances sourced directly from brands' },
                { icon: '❖', title: 'Fast Shipping', desc: 'Complimentary delivery on orders over EGP 500' },
                { icon: '◆', title: 'Gift Wrapping', desc: 'Elegant packaging for every special occasion' },
              ].map((feat) => (
                <div key={feat.title} style={styles.featItem}>
                  <div style={styles.featIcon}>{feat.icon}</div>
                  <h3 style={styles.featTitle}>{feat.title}</h3>
                  <p style={styles.featDesc}>{feat.desc}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
