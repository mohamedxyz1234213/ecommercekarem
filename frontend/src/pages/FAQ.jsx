import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiPlus, FiMinus, FiMail } from 'react-icons/fi';
import AnimatedSection from '../components/AnimatedSection';
import PageSEO from '../utils/useSEO';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const faqData = [
  {
    category: 'Orders & Shipping',
    items: [
      {
        q: 'How long does delivery take?',
        a: 'Standard delivery takes 3–5 business days across Egypt. Express delivery (Cairo & Giza only) takes 1–2 business days. Orders are processed within 24 hours, excluding Fridays and public holidays.',
      },
      {
        q: 'Can I track my order?',
        a: 'Yes! Once your order is shipped, you\'ll receive a tracking number via email or SMS. You can also use our Track Order page to check your order status at any time.',
      },
      {
        q: 'Do you offer free shipping?',
        a: 'Yes. Orders over EGP 1,000 qualify for free standard shipping across Egypt.',
      },
      {
        q: 'Can I change my delivery address after placing an order?',
        a: 'Address changes can be made within 2 hours of placing your order. Please contact us immediately at support@vybe.store with your order ID and the new address.',
      },
      {
        q: 'What happens if I miss the delivery?',
        a: 'The courier will attempt redelivery once. If you miss both attempts, please contact us so we can arrange a new delivery schedule.',
      },
    ],
  },
  {
    category: 'Products & Fragrances',
    items: [
      {
        q: 'Are your fragrances authentic?',
        a: 'Absolutely. All products sold on vybe are 100% authentic. We source directly from trusted suppliers and authorised distributors. We do not sell replicas or imitations.',
      },
      {
        q: 'What are the available sizes?',
        a: 'Most of our fragrances are available in 50ml and 100ml bottles. Some special editions come in 30ml or 150ml. The available sizes are listed on each product page.',
      },
      {
        q: 'How should I store my fragrance?',
        a: 'Store your fragrance in a cool, dry place away from direct sunlight and heat sources. Avoid storing in the bathroom as humidity can degrade the scent over time. Keep the cap on when not in use.',
      },
      {
        q: 'How long does a fragrance last on skin?',
        a: 'Longevity depends on the concentration. Eau de Parfum (EDP) typically lasts 6–8 hours, while Eau de Toilette (EDT) lasts 4–6 hours. Applying to pulse points and moisturised skin extends the scent.',
      },
    ],
  },
  {
    category: 'Payment',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept Cash on Delivery (COD) and InstaPay. COD is available across all Egyptian governorates. More payment options are coming soon.',
      },
      {
        q: 'Is Cash on Delivery available everywhere in Egypt?',
        a: 'Yes, COD is available across all governorates in Egypt. Please have the exact amount ready when the courier arrives.',
      },
      {
        q: 'Is online payment secure?',
        a: 'Yes. Our InstaPay integration uses encrypted, secure transactions. We do not store any payment card information on our servers.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    items: [
      {
        q: 'What is your return policy?',
        a: 'We accept returns within 7 days of delivery for unopened, unused items in their original sealed packaging. Opened or used fragrances cannot be returned due to the nature of the product.',
      },
      {
        q: 'My item arrived damaged. What should I do?',
        a: 'We are sorry to hear that! Please contact us at support@vybe.store within 48 hours of receiving your order, with photos of the damage. We will arrange a replacement or full refund.',
      },
      {
        q: 'How long does a refund take?',
        a: 'Once we receive and inspect the returned item, refunds are processed within 3–5 business days. You will receive an email confirmation once the refund is issued.',
      },
    ],
  },
  {
    category: 'Account & Profile',
    items: [
      {
        q: 'Do I need an account to place an order?',
        a: 'No, you can checkout as a guest. However, creating an account lets you track orders, view your order history, and enjoy a faster checkout experience.',
      },
      {
        q: 'How do I reset my password?',
        a: 'On the login page, click "Forgot Password" and enter your email address. You will receive a reset link within a few minutes. Check your spam folder if it does not arrive.',
      },
    ],
  },
];

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        borderBottom: '1px solid var(--gray-100)',
        padding: '1rem 0',
      }}
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={{
          width: '100%', textAlign: 'left', background: 'none',
          border: 'none', cursor: 'pointer', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
          gap: '1rem', padding: 0,
        }}
        aria-expanded={open}
      >
        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.5 }}>{q}</span>
        <span style={{
          flexShrink: 0, width: '28px', height: '28px', borderRadius: '50%',
          backgroundColor: open ? 'var(--primary)' : 'var(--secondary)',
          color: open ? '#fff' : 'var(--text)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.9rem', transition: 'all 0.25s',
        }}>
          {open ? <FiMinus /> : <FiPlus />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{ fontSize: '0.9rem', color: 'var(--gray-500)', lineHeight: 1.8, paddingTop: '0.75rem', paddingRight: '2.5rem' }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState(faqData[0].category);

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
    tabs: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem', justifyContent: 'center' },
    tab: (active) => ({
      padding: '0.5rem 1.25rem',
      borderRadius: '999px',
      border: `1.5px solid ${active ? 'var(--primary)' : 'var(--gray-200)'}`,
      backgroundColor: active ? 'var(--primary)' : 'var(--white)',
      color: active ? '#fff' : 'var(--text)',
      fontSize: '0.85rem', fontWeight: active ? 600 : 400,
      cursor: 'pointer', transition: 'all 0.2s',
    }),
    faqCard: {
      backgroundColor: 'var(--white)', borderRadius: 'var(--radius-md)',
      padding: '2rem 2.5rem', boxShadow: 'var(--shadow-sm)',
    },
    catTitle: {
      fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 500,
      color: 'var(--text)', marginBottom: '0.25rem',
      paddingBottom: '0.75rem', borderBottom: '2px solid var(--primary)',
      display: 'inline-block',
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

  const activeFaq = faqData.find((cat) => cat.category === activeCategory);

  return (
    <motion.div style={styles.page} variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageSEO
        title="FAQ — Frequently Asked Questions"
        description="Find answers to common questions about vybe fragrances, orders, shipping, returns, and payment."
        url="/faq"
      />
      <div style={styles.container}>
        <AnimatedSection>
          <div style={styles.header}>
            <p style={styles.label}>Support</p>
            <h1 style={styles.title}>Frequently Asked Questions</h1>
            <p style={styles.subtitle}>
              Can&apos;t find your answer? Reach out to us and we&apos;ll be happy to help.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div style={styles.tabs}>
            {faqData.map((cat) => (
              <button
                key={cat.category}
                style={styles.tab(activeCategory === cat.category)}
                onClick={() => setActiveCategory(cat.category)}
              >
                {cat.category}
              </button>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div style={styles.faqCard}>
            <p style={styles.catTitle}>{activeFaq.category}</p>
            <div style={{ marginTop: '0.5rem' }}>
              {activeFaq.items.map((item) => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div style={styles.ctaBox}>
            <p style={styles.ctaTitle}>Still have questions?</p>
            <p style={styles.ctaDesc}>Our support team is always here to help you.</p>
            <Link to="/contact" style={styles.ctaBtn}>
              <FiMail /> Contact Us
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </motion.div>
  );
};

export default FAQ;
