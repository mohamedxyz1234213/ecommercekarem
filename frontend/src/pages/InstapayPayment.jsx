import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUpload, FiCheck, FiCopy } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../api/axios';
import AnimatedSection from '../components/AnimatedSection';
import { useAuth } from '../context/AuthContext';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const InstapayPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { orderId, total } = location.state || { orderId: 'N/A', total: 0 };
  const [email, setEmail] = useState(user?.email || '');
  const [instapayUsername, setInstapayUsername] = useState('');
  const [proofImage, setProofImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const INSTAPAY_USERNAME = 'NewSession';

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      setProofImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCopyUsername = () => {
    navigator.clipboard.writeText(INSTAPAY_USERNAME);
    toast.success('Username copied!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!instapayUsername.trim()) {
      toast.error('Please enter your InstaPay username');
      return;
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      toast.error('Please enter a valid email for verification');
      return;
    }
    if (!proofImage) {
      toast.error('Please upload payment proof');
      return;
    }

    setSubmitting(true);
    try {
      if (!orderId || orderId === 'N/A') {
        toast.error('Missing order reference. Please place the order again.');
        setSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append('instapayUsername', instapayUsername.trim());
      formData.append('email', email.trim().toLowerCase());
      formData.append('instapayProof', proofImage);

      await API.post(`/orders/${orderId}/instapay-proof`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSubmitted(true);
      toast.success('Payment proof submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit payment proof');
    } finally {
      setSubmitting(false);
    }
  };

  const styles = {
    page: { paddingTop: '100px', minHeight: '100vh', backgroundColor: 'transparent' },
    container: { maxWidth: '640px', margin: '0 auto', padding: '2rem 1.5rem 4rem' },
    card: { backgroundColor: 'var(--white)', borderRadius: 'var(--radius-md)', padding: '2.5rem', boxShadow: 'var(--shadow-md)' },
    title: { fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 500, textAlign: 'center', marginBottom: '0.5rem' },
    subtitle: { textAlign: 'center', color: 'var(--gray-500)', fontSize: '0.95rem', marginBottom: '2rem' },
    steps: { display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' },
    step: { display: 'flex', gap: '1rem', alignItems: 'flex-start' },
    stepNum: {
      width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary)',
      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '0.85rem', fontWeight: 700, flexShrink: 0,
    },
    stepContent: { flex: 1 },
    stepTitle: { fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' },
    stepDesc: { fontSize: '0.9rem', color: 'var(--gray-500)', lineHeight: 1.6 },
    usernameBox: {
      display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem',
      padding: '0.75rem 1rem', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius-sm)',
    },
    username: { fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700, color: '#f4fbf7', flex: 1 },
    copyBtn: { background: 'none', border: 'none', color: '#f4fbf7', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', fontWeight: 600 },
    amountBox: {
      textAlign: 'center', padding: '1.25rem', backgroundColor: 'rgba(45, 80, 22, 0.05)',
      borderRadius: 'var(--radius-sm)', marginBottom: '2rem',
      border: '1px dashed var(--primary)',
    },
    amountLabel: { fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: '0.25rem' },
    amount: { fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' },
    divider: { borderTop: '1px solid var(--gray-200)', margin: '1.5rem 0' },
    field: { display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.25rem' },
    label: { fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.5px', color: 'var(--gray-500)' },
    input: { padding: '0.75rem 1rem', border: '1.5px solid var(--gray-200)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem' },
    uploadArea: {
      border: '2px dashed var(--gray-200)', borderRadius: 'var(--radius-sm)',
      padding: '2rem', textAlign: 'center', cursor: 'pointer',
      backgroundColor: 'var(--surface-muted)', transition: 'border-color 0.3s',
    },
    uploadIcon: { fontSize: '2rem', color: 'var(--gray-400)', marginBottom: '0.5rem' },
    uploadText: { fontSize: '0.9rem', color: 'var(--gray-500)' },
    uploadHint: { fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: '0.25rem' },
    preview: { width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: 'var(--radius-sm)', marginTop: '1rem' },
    submitBtn: {
      width: '100%', padding: '1rem', backgroundColor: 'var(--primary)', color: '#fff',
      border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '0.95rem', fontWeight: 600,
      letterSpacing: '1px', cursor: 'pointer', marginTop: '0.5rem',
    },
    successBox: {
      textAlign: 'center', padding: '3rem 2rem',
    },
    successIcon: {
      width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(45, 80, 22, 0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 auto 1.5rem', fontSize: '1.5rem', color: 'var(--primary)',
    },
    successTitle: { fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 500, marginBottom: '0.75rem' },
    successDesc: { fontSize: '0.95rem', color: 'var(--gray-500)', lineHeight: 1.7, marginBottom: '2rem' },
    backBtn: {
      padding: '0.9rem 2rem', backgroundColor: 'var(--primary)', color: '#fff',
      border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', fontWeight: 600,
      cursor: 'pointer',
    },
  };

  if (submitted) {
    return (
      <motion.div style={styles.page} variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <div style={styles.container}>
          <AnimatedSection>
            <div style={styles.card}>
              <div style={styles.successBox}>
                <div style={styles.successIcon}><FiCheck /></div>
                <h2 style={styles.successTitle}>Payment Proof Submitted!</h2>
                <p style={styles.successDesc}>
                  Thank you! We&apos;ve received your payment proof. Your order will be confirmed
                  once we verify the transaction. You&apos;ll receive a notification shortly.
                </p>
                <motion.button
                  style={styles.backBtn}
                  whileHover={{ opacity: 0.9 }}
                  onClick={() => navigate('/profile')}
                >
                  View My Orders
                </motion.button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div style={styles.page} variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div style={styles.container}>
        <AnimatedSection>
          <div style={styles.card}>
            <h1 style={styles.title}>InstaPay Payment</h1>
            <p style={styles.subtitle}>Follow the steps below to complete your payment</p>

            <div style={styles.amountBox}>
              <p style={styles.amountLabel}>Amount to Transfer</p>
              <p style={styles.amount}>EGP {total.toFixed(2)}</p>
            </div>

            <div style={styles.steps}>
              <div style={styles.step}>
                <div style={styles.stepNum}>1</div>
                <div style={styles.stepContent}>
                  <p style={styles.stepTitle}>Open InstaPay App</p>
                  <p style={styles.stepDesc}>Open your InstaPay application on your phone</p>
                </div>
              </div>

              <div style={styles.step}>
                <div style={styles.stepNum}>2</div>
                <div style={styles.stepContent}>
                  <p style={styles.stepTitle}>Send Money To</p>
                  <p style={styles.stepDesc}>Transfer the exact amount to this username:</p>
                  <div style={styles.usernameBox}>
                    <span style={styles.username}>{INSTAPAY_USERNAME}</span>
                    <button style={styles.copyBtn} onClick={handleCopyUsername} type="button">
                      <FiCopy /> Copy
                    </button>
                  </div>
                </div>
              </div>

              <div style={styles.step}>
                <div style={styles.stepNum}>3</div>
                <div style={styles.stepContent}>
                  <p style={styles.stepTitle}>Upload Proof & Confirm</p>
                  <p style={styles.stepDesc}>Take a screenshot of the successful transfer and upload it below</p>
                </div>
              </div>
            </div>

            <div style={styles.divider} />

            <form onSubmit={handleSubmit}>
              <div style={styles.field}>
                <label style={styles.label}>Verification Email *</label>
                <input
                  style={styles.input}
                  type="email"
                  placeholder="Enter your account email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Your InstaPay Username *</label>
                <input
                  style={styles.input}
                  placeholder="Enter your InstaPay username"
                  value={instapayUsername}
                  onChange={(e) => setInstapayUsername(e.target.value)}
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Payment Proof Screenshot *</label>
                <label style={styles.uploadArea} htmlFor="proof-upload">
                  <div style={styles.uploadIcon}><FiUpload /></div>
                  <p style={styles.uploadText}>
                    {proofImage ? proofImage.name : 'Click to upload screenshot'}
                  </p>
                  <p style={styles.uploadHint}>PNG, JPG up to 5MB</p>
                </label>
                <input
                  id="proof-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                {previewUrl && <img src={previewUrl} alt="Payment proof" style={styles.preview} />}
              </div>

              <motion.button
                type="submit"
                style={{ ...styles.submitBtn, opacity: submitting ? 0.7 : 1 }}
                whileHover={{ opacity: 0.9 }}
                whileTap={{ scale: 0.98 }}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Payment Proof'}
              </motion.button>
            </form>
          </div>
        </AnimatedSection>
      </div>
    </motion.div>
  );
};

export default InstapayPayment;
