import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import FeaturedProducts from '../components/FeaturedProducts';
import SaleBanner from '../components/SaleBanner';
import AnimatedSection from '../components/AnimatedSection';
import HomeProductsSection from '../components/HomeProductsSection';
import PageSEO from '../utils/useSEO';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const Home = () => {
  const styles = {
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 1.5rem',
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
      <PageSEO
        title="Luxury Perfumes & Fine Fragrances"
        description="Shop vybe — Egypt's premier destination for luxury perfumes, eau de parfum, and fine fragrances. Authentic scents, fast delivery, elegant gift wrapping."
        url="/"
      />
      <HeroSection />
      <FeaturedProducts />
      <SaleBanner />

      <HomeProductsSection />

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
