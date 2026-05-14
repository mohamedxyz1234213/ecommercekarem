import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import AnimatedSection from '../components/AnimatedSection';
import PageSEO from '../utils/useSEO';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent! We'll get back to you within 24 hours.");
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  const styles = {
    page: { paddingTop: '100px', minHeight: '100vh', backgroundColor: 'transparent' },
    container: { maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem 5rem' },
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
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1.6fr',
      gap: '2.5rem',
    },
    infoCard: {
      backgroundColor: 'var(--white)',
      borderRadius: 'var(--radius-md)',
      padding: '2.5rem',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
    },
    infoTitle: {
      fontFamily: 'var(--font-heading)',
      fontSize: '1.3rem', fontWeight: 500, color: 'var(--text)', marginBottom: '0.25rem',
    },
    infoDesc: { fontSize: '0.9rem', color: 'var(--gray-500)', lineHeight: 1.7 },
    infoItem: { display: 'flex', alignItems: 'flex-start', gap: '1rem' },
    infoIcon: {
      width: '44px', height: '44px', borderRadius: '50%',
      backgroundColor: 'var(--secondary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--primary)', fontSize: '1.1rem', flexShrink: 0,
    },
    infoLabel: { fontSize: '0.78rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--gray-400)', marginBottom: '0.2rem' },
    infoValue: { fontSize: '0.95rem', color: 'var(--text)', fontWeight: 500 },
    formCard: {
      backgroundColor: 'var(--white)',
      borderRadius: 'var(--radius-md)',
      padding: '2.5rem',
      boxShadow: 'var(--shadow-sm)',
    },
    formTitle: { fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 500, marginBottom: '1.75rem', color: 'var(--text)' },
    field: { display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.25rem' },
    fieldLabel: { fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.5px', color: 'var(--gray-500)' },
    input: {
      padding: '0.75rem 1rem',
      border: '1.5px solid var(--gray-200)',
      borderRadius: 'var(--radius-sm)',
      fontSize: '0.9rem',
      backgroundColor: 'var(--white)',
      color: 'var(--text)',
      outline: 'none',
      transition: 'border-color 0.2s',
    },
    textarea: {
      padding: '0.75rem 1rem',
      border: '1.5px solid var(--gray-200)',
      borderRadius: 'var(--radius-sm)',
      fontSize: '0.9rem',
      backgroundColor: 'var(--white)',
      color: 'var(--text)',
      outline: 'none',
      resize: 'vertical',
      minHeight: '140px',
      fontFamily: 'inherit',
      transition: 'border-color 0.2s',
    },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' },
    btn: {
      width: '100%', padding: '0.9rem', backgroundColor: 'var(--primary)',
      color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)',
      fontSize: '0.95rem', fontWeight: 600, letterSpacing: '1px',
      cursor: 'pointer', display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem',
    },
  };

  return (
    <motion.div style={styles.page} variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageSEO
        title="Contact Us"
        description="Get in touch with vybe. We're here to help with any questions about our fragrances, orders, or partnerships."
        url="/contact"
      />
      <div style={styles.container}>
        <AnimatedSection>
          <div style={styles.header}>
            <p style={styles.label}>Get In Touch</p>
            <h1 style={styles.title}>Contact Us</h1>
            <p style={styles.subtitle}>
              Have a question or need help? We&apos;re always happy to hear from you.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div style={styles.grid} className="contact-grid">
            <div style={styles.infoCard}>
              <div>
                <p style={styles.infoTitle}>Let&apos;s talk</p>
                <p style={styles.infoDesc}>
                  Reach out to us and we&apos;ll respond as soon as possible. Our team is available
                  Saturday through Thursday.
                </p>
              </div>

              <div style={styles.infoItem}>
                <div style={styles.infoIcon}><FiMail /></div>
                <div>
                  <p style={styles.infoLabel}>Email</p>
                  <p style={styles.infoValue}>support@vybe.store</p>
                </div>
              </div>

              <div style={styles.infoItem}>
                <div style={styles.infoIcon}><FiPhone /></div>
                <div>
                  <p style={styles.infoLabel}>Phone / WhatsApp</p>
                  <p style={styles.infoValue}>+20 100 000 0000</p>
                </div>
              </div>

              <div style={styles.infoItem}>
                <div style={styles.infoIcon}><FiMapPin /></div>
                <div>
                  <p style={styles.infoLabel}>Location</p>
                  <p style={styles.infoValue}>Cairo, Egypt</p>
                </div>
              </div>

              <div style={styles.infoItem}>
                <div style={styles.infoIcon}><FiClock /></div>
                <div>
                  <p style={styles.infoLabel}>Working Hours</p>
                  <p style={styles.infoValue}>Sat – Thu, 10 AM – 8 PM</p>
                </div>
              </div>
            </div>

            <div style={styles.formCard}>
              <h2 style={styles.formTitle}>Send us a message</h2>
              <form onSubmit={handleSubmit}>
                <div style={styles.row} className="contact-row">
                  <div style={styles.field}>
                    <label style={styles.fieldLabel}>Name *</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      style={styles.input}
                      required
                    />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.fieldLabel}>Email *</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      style={styles.input}
                      required
                    />
                  </div>
                </div>
                <div style={styles.field}>
                  <label style={styles.fieldLabel}>Subject</label>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="What is this about?"
                    style={styles.input}
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.fieldLabel}>Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    style={styles.textarea}
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  style={styles.btn}
                  whileHover={{ opacity: 0.9 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                >
                  <FiSend />
                  {loading ? 'Sending...' : 'Send Message'}
                </motion.button>
              </form>
            </div>
          </div>
        </AnimatedSection>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .contact-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  );
};

export default ContactUs;
