import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import FeaturedProducts from '../components/FeaturedProducts';
import SaleBanner from '../components/SaleBanner';
import AnimatedSection from '../components/AnimatedSection';

const categories = [
  { name: 'For Her', image: 'https://placehold.co/400x500/F5F0E8/8B7355?text=For+Her', slug: 'women' },
  { name: 'For Him', image: 'https://placehold.co/400x500/F5F0E8/2D5016?text=For+Him', slug: 'men' },
  { name: 'Unisex', image: 'https://placehold.co/400x500/F5F0E8/C4A265?text=Unisex', slug: 'unisex' },
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
    catGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '2rem',
    },
    catCard: {
      position: 'relative',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      aspectRatio: '3/4',
      cursor: 'pointer',
    },
    catImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s ease',
    },
    catOverlay: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)',
      display: 'flex',
      alignItems: 'flex-end',
      padding: '2rem',
    },
    catName: {
      fontFamily: 'var(--font-heading)',
      fontSize: '1.5rem',
      color: '#fff',
      fontWeight: 500,
    },
    features: {
      padding: '5rem 0',
      backgroundColor: 'var(--secondary)',
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

          <div style={styles.catGrid}>
            {categories.map((cat, i) => (
              <AnimatedSection key={cat.slug} delay={i * 0.15}>
                <Link to={`/shop?category=${cat.slug}`}>
                  <motion.div
                    style={styles.catCard}
                    whileHover={{ scale: 1.02 }}
                  >
                    <img src={cat.image} alt={cat.name} style={styles.catImg} />
                    <div style={styles.catOverlay}>
                      <h3 style={styles.catName}>{cat.name}</h3>
                    </div>
                  </motion.div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <div style={styles.container}>
          <AnimatedSection>
            <div style={styles.featGrid}>
              {[
                { icon: '✦', title: 'Authentic Products', desc: '100% genuine fragrances sourced directly from brands' },
                { icon: '❖', title: 'Free Shipping', desc: 'Complimentary delivery on orders over EGP 500' },
                { icon: '◆', title: 'Gift Wrapping', desc: 'Elegant packaging for every special occasion' },
                { icon: '♦', title: 'Easy Returns', desc: '14-day hassle-free return policy' },
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
