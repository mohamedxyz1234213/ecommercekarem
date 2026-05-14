import { motion } from 'framer-motion';
import { FiTruck, FiClock, FiMapPin, FiPackage, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import AnimatedSection from '../components/AnimatedSection';
import PageSEO from '../utils/useSEO';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const shippingOptions = [
  {
    icon: FiTruck,
    title: 'Standard Delivery',
    duration: '3–5 Business Days',
    price: 'EGP 50',
    desc: 'Available across all Egyptian governorates.',
  },
  {
    icon: FiClock,
    title: 'Express Delivery',
    duration: '1–2 Business Days',
    price: 'EGP 90',
    desc: 'Fast delivery within Cairo & Giza only.',
  },
  {
    icon: FiCheckCircle,
    title: 'Free Shipping',
    duration: '3–5 Business Days',
    price: 'Free',
    desc: 'On all orders over EGP 1,000.',
  },
];

const coverageAreas = [
  { region: 'Cairo & Giza', duration: '1–2 days' },
  { region: 'Alexandria', duration: '2–3 days' },
  { region: 'Upper Egypt (Aswan, Luxor, etc.)', duration: '4–5 days' },
  { region: 'Delta & Canal Zone', duration: '2–4 days' },
  { region: 'Sinai & Red Sea', duration: '4–6 days' },
  { region: 'North Coast', duration: '3–5 days' },
];

const ShippingInfo = () => {
  const styles = {
    page: { paddingTop: '100px', minHeight: '100vh', backgroundColor: 'transparent' },
    container: { maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem 5rem' },
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
      fontWeight: 500, color: 'var(--text)', marginBottom: '1.5rem',
      paddingBottom: '0.75rem', borderBottom: '1px solid var(--gray-100)',
    },
    optionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
      gap: '1.25rem',
    },
    optionCard: {
      border: '1px solid var(--gray-200)',
      borderRadius: 'var(--radius-sm)',
      padding: '1.5rem',
      display: 'flex', flexDirection: 'column', gap: '0.5rem',
    },
    optionIconWrap: {
      width: '44px', height: '44px', borderRadius: '50%',
      backgroundColor: 'var(--secondary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--primary)', fontSize: '1.1rem', marginBottom: '0.25rem',
    },
    optionTitle: { fontWeight: 700, fontSize: '1rem', color: 'var(--text)' },
    optionDuration: { fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 },
    optionPrice: { fontSize: '0.9rem', color: 'var(--gray-600)', fontWeight: 500 },
    optionDesc: { fontSize: '0.85rem', color: 'var(--gray-500)', lineHeight: 1.6 },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: {
      textAlign: 'left', padding: '0.75rem 1rem',
      fontSize: '0.78rem', fontWeight: 700, letterSpacing: '1px',
      textTransform: 'uppercase', color: 'var(--gray-500)',
      backgroundColor: 'var(--secondary)',
    },
    td: {
      padding: '0.85rem 1rem', fontSize: '0.9rem',
      borderBottom: '1px solid var(--gray-100)', color: 'var(--text)',
    },
    noteBox: {
      display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
      backgroundColor: '#fef3c7', borderRadius: 'var(--radius-sm)',
      padding: '1rem 1.25rem', marginTop: '0.75rem',
    },
    noteText: { fontSize: '0.88rem', color: '#92400e', lineHeight: 1.6 },
    list: { display: 'flex', flexDirection: 'column', gap: '0.85rem', listStyle: 'none', paddingLeft: 0 },
    listItem: {
      display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
      fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.6,
    },
    bulletDot: {
      width: '8px', height: '8px', borderRadius: '50%',
      backgroundColor: 'var(--primary)', marginTop: '0.45rem', flexShrink: 0,
    },
  };

  return (
    <motion.div style={styles.page} variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageSEO
        title="Shipping Information"
        description="Learn about vybe's shipping options, delivery times, and coverage areas across Egypt."
        url="/shipping"
      />
      <div style={styles.container}>
        <AnimatedSection>
          <div style={styles.header}>
            <p style={styles.label}>Delivery</p>
            <h1 style={styles.title}>Shipping Information</h1>
            <p style={styles.subtitle}>
              We deliver across all of Egypt. Choose the option that works best for you.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <FiPackage style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Shipping Options
            </h2>
            <div style={styles.optionsGrid}>
              {shippingOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <div key={opt.title} style={styles.optionCard}>
                    <div style={styles.optionIconWrap}><Icon /></div>
                    <p style={styles.optionTitle}>{opt.title}</p>
                    <p style={styles.optionDuration}>{opt.duration}</p>
                    <p style={styles.optionPrice}>{opt.price}</p>
                    <p style={styles.optionDesc}>{opt.desc}</p>
                  </div>
                );
              })}
            </div>
            <div style={styles.noteBox}>
              <FiAlertCircle style={{ color: '#92400e', flexShrink: 0, marginTop: '0.15rem' }} />
              <p style={styles.noteText}>
                Delivery times are estimates and may vary during peak seasons, public holidays, or due to courier delays outside our control.
              </p>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <FiMapPin style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Coverage &amp; Delivery Times
            </h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Region</th>
                  <th style={styles.th}>Estimated Delivery</th>
                </tr>
              </thead>
              <tbody>
                {coverageAreas.map((area) => (
                  <tr key={area.region}>
                    <td style={styles.td}>{area.region}</td>
                    <td style={{ ...styles.td, color: 'var(--primary)', fontWeight: 600 }}>{area.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Order Processing</h2>
            <ul style={styles.list}>
              {[
                'Orders are processed within 24 hours of being placed (excluding Fridays and public holidays).',
                'You will receive a confirmation email immediately after placing your order.',
                'Once your order is shipped, you will receive a tracking number via email or SMS.',
                'Orders placed after 5 PM may be processed the following business day.',
                'All orders are carefully packed to ensure your fragrance arrives in perfect condition.',
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
            <h2 style={styles.sectionTitle}>Payment &amp; Cash on Delivery</h2>
            <ul style={styles.list}>
              {[
                'Cash on Delivery (COD) is available for all areas across Egypt.',
                'Online payment via InstaPay is also supported for a smooth checkout experience.',
                'For COD orders, please have the exact amount ready upon delivery.',
                'If you are unavailable at the time of delivery, the courier will attempt redelivery once.',
              ].map((item, i) => (
                <li key={i} style={styles.listItem}>
                  <span style={styles.bulletDot} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </AnimatedSection>
      </div>
    </motion.div>
  );
};

export default ShippingInfo;
