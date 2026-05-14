import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiRefreshCw, FiXCircle, FiCheckCircle, FiAlertCircle, FiMail } from 'react-icons/fi';
import AnimatedSection from '../components/AnimatedSection';
import PageSEO from '../utils/useSEO';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const Returns = () => {
  const styles = {
    page: { paddingTop: '100px', minHeight: '100vh', backgroundColor: 'transparent' },
    container: { maxWidth: '860px', margin: '0 auto', padding: '2rem 1.5rem 5rem' },
    header: { textAlign: 'center', marginBottom: '3rem' },
    label: {
      fontSize: '0.8rem', fontWeight: 600, letterSpacing: '4px',
      textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem',
    },
    title: {
      fontFamily: 'var(--font-heading)',
      fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
      fontWeight: 500, color: 'var(--text)', marginBottom: '0.75rem',
    },
    subtitle: { color: 'var(--gray-500)', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto' },
    section: {
      backgroundColor: 'var(--white)', borderRadius: 'var(--radius-md)',
      padding: '2.5rem', boxShadow: 'var(--shadow-sm)', marginBottom: '2rem',
    },
    sectionTitle: {
      fontFamily: 'var(--font-heading)', fontSize: '1.2rem',
      fontWeight: 500, color: 'var(--text)', marginBottom: '1.25rem',
      paddingBottom: '0.75rem', borderBottom: '1px solid var(--gray-100)',
      display: 'flex', alignItems: 'center', gap: '0.5rem',
    },
    list: { display: 'flex', flexDirection: 'column', gap: '0.85rem', listStyle: 'none', paddingLeft: 0 },
    listItem: {
      display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
      fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.7,
    },
    bulletDot: {
      width: '8px', height: '8px', borderRadius: '50%',
      backgroundColor: 'var(--primary)', marginTop: '0.45rem', flexShrink: 0,
    },
    stepsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1.25rem',
      marginTop: '0.25rem',
    },
    stepCard: {
      border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-sm)',
      padding: '1.5rem', textAlign: 'center',
    },
    stepNum: {
      width: '40px', height: '40px', borderRadius: '50%',
      backgroundColor: 'var(--primary)', color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: '1rem', margin: '0 auto 0.75rem',
    },
    stepTitle: { fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '0.4rem' },
    stepDesc: { fontSize: '0.85rem', color: 'var(--gray-500)', lineHeight: 1.6 },
    ineligibleCard: {
      display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
      backgroundColor: '#fee2e2', borderRadius: 'var(--radius-sm)',
      padding: '1rem 1.25rem', marginBottom: '0.75rem',
    },
    eligibleCard: {
      display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
      backgroundColor: '#d1fae5', borderRadius: 'var(--radius-sm)',
      padding: '1rem 1.25rem', marginBottom: '0.75rem',
    },
    ctaBox: {
      textAlign: 'center', padding: '2.5rem',
      backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius-md)',
      marginTop: '2rem',
    },
    ctaTitle: { fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text)' },
    ctaDesc: { fontSize: '0.9rem', color: 'var(--gray-500)', marginBottom: '1.25rem' },
    ctaBtn: {
      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
      padding: '0.8rem 1.75rem', backgroundColor: 'var(--primary)',
      color: '#fff', borderRadius: 'var(--radius-sm)',
      fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.5px',
      textDecoration: 'none',
    },
  };

  return (
    <motion.div style={styles.page} variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageSEO
        title="Returns & Exchanges"
        description="Learn about vybe's hassle-free returns and exchange policy. We want you to love your fragrance."
        url="/returns"
      />
      <div style={styles.container}>
        <AnimatedSection>
          <div style={styles.header}>
            <p style={styles.label}>Policy</p>
            <h1 style={styles.title}>Returns &amp; Exchanges</h1>
            <p style={styles.subtitle}>
              We want you to love every fragrance you choose. If something is not right, we&apos;ll make it right.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}><FiCheckCircle style={{ color: 'var(--primary)' }} /> Eligible for Return</h2>
            <div style={styles.eligibleCard}>
              <FiCheckCircle style={{ color: '#065f46', flexShrink: 0, marginTop: '0.15rem' }} />
              <p style={{ fontSize: '0.9rem', color: '#065f46', lineHeight: 1.7 }}>
                Items may be returned within <strong>7 days</strong> of delivery if they are <strong>unopened, unused, and in their original sealed packaging</strong>.
              </p>
            </div>
            <ul style={styles.list}>
              {[
                'Product received damaged or defective.',
                'Wrong item was shipped.',
                'Item is unopened and in original factory-sealed condition.',
                'Item arrived with a broken seal due to shipping damage.',
              ].map((item, i) => (
                <li key={i} style={styles.listItem}>
                  <span style={styles.bulletDot} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}><FiXCircle style={{ color: '#ef4444' }} /> Not Eligible for Return</h2>
            <div style={styles.ineligibleCard}>
              <FiAlertCircle style={{ color: '#991b1b', flexShrink: 0, marginTop: '0.15rem' }} />
              <p style={{ fontSize: '0.9rem', color: '#991b1b', lineHeight: 1.7 }}>
                Due to the nature of fragrance products, we <strong>cannot accept returns</strong> on opened, used, or partially-used items.
              </p>
            </div>
            <ul style={styles.list}>
              {[
                'Products that have been opened or used.',
                'Items returned after the 7-day return window.',
                'Products without their original packaging.',
                'Sale or discounted items (unless defective).',
                'Gift cards and digital products.',
              ].map((item, i) => (
                <li key={i} style={styles.listItem}>
                  <span style={styles.bulletDot} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}><FiRefreshCw style={{ color: 'var(--primary)' }} /> How to Return</h2>
            <div style={styles.stepsGrid}>
              {[
                { title: 'Contact Us', desc: 'Email us at support@vybe.store with your order ID and reason for return.' },
                { title: 'Get Approval', desc: 'Our team will review your request and send return instructions within 24 hours.' },
                { title: 'Ship the Item', desc: 'Package the item securely and ship it back to our address. Keep your tracking receipt.' },
                { title: 'Refund Issued', desc: 'Once received and inspected, your refund will be processed within 3–5 business days.' },
              ].map((step, i) => (
                <div key={step.title} style={styles.stepCard}>
                  <div style={styles.stepNum}>{i + 1}</div>
                  <p style={styles.stepTitle}>{step.title}</p>
                  <p style={styles.stepDesc}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Refund Method</h2>
            <ul style={styles.list}>
              {[
                'Refunds are issued to the original payment method.',
                'Cash on Delivery orders will be refunded via bank transfer or store credit.',
                'Shipping fees are non-refundable unless the return is due to our error.',
                'You will be notified by email once your refund is processed.',
              ].map((item, i) => (
                <li key={i} style={styles.listItem}>
                  <span style={styles.bulletDot} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div style={styles.ctaBox}>
            <p style={styles.ctaTitle}>Need help with your return?</p>
            <p style={styles.ctaDesc}>Our support team is ready to assist you every step of the way.</p>
            <Link to="/contact" style={styles.ctaBtn}>
              <FiMail /> Contact Support
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </motion.div>
  );
};

export default Returns;
