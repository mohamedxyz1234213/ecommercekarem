import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiSearch, FiPackage, FiTruck, FiCheck, FiClock } from 'react-icons/fi';
import API from '../api/axios';
import AnimatedSection from '../components/AnimatedSection';
import LoadingSpinner from '../components/LoadingSpinner';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const statusBadgeStyle = {
  pending: { backgroundColor: '#fef3c7', color: '#92400e' },
  processing: { backgroundColor: '#dbeafe', color: '#1e40af' },
  shipped: { backgroundColor: '#d1fae5', color: '#065f46' },
  delivered: { backgroundColor: '#d1fae5', color: '#014421' },
  cancelled: { backgroundColor: '#fee2e2', color: '#991b1b' },
};

const StatusBadge = ({ status }) => {
  const style = statusBadgeStyle[status] || { backgroundColor: '#f3f4f6', color: '#374151' };
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        ...style,
      }}
    >
      {status}
    </span>
  );
};

const TrackOrder = () => {
  const location = useLocation();
  const [orderId, setOrderId] = useState(location.state?.orderId || '');
  const [email, setEmail] = useState(location.state?.email || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Auto-search if arriving with state (e.g. right after placing order)
  useEffect(() => {
    if (location.state?.orderId && location.state?.email) {
      handleSearch(location.state.orderId, location.state.email);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = async (id = orderId, mail = email) => {
    const trimmedId = String(id || '').trim();
    const trimmedEmail = String(mail || '').trim().toLowerCase();

    if (!trimmedId) {
      toast.error('Please enter your Order ID');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setSearched(true);
    setOrder(null);
    try {
      const { data } = await API.get(`/orders/track/${trimmedId}`, {
        params: { email: trimmedEmail },
      });
      setOrder(data);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Order not found. Please check your Order ID and email.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const steps = [
    { key: 'pending', label: 'Confirmed', icon: FiClock },
    { key: 'processing', label: 'Processing', icon: FiPackage },
    { key: 'shipped', label: 'Shipped', icon: FiTruck },
    { key: 'delivered', label: 'Delivered', icon: FiCheck },
  ];
  const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
  const currentIndex = order ? statusOrder.indexOf(order.status) : -1;
  const progressPct = currentIndex >= 0 ? (currentIndex / (steps.length - 1)) * 100 : 0;

  const styles = {
    page: { paddingTop: '100px', minHeight: '100vh', backgroundColor: 'transparent' },
    container: { maxWidth: '760px', margin: '0 auto', padding: '2rem 1.5rem 4rem' },
    title: { fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text)' },
    subtitle: { color: 'var(--gray-500)', fontSize: '0.95rem', marginBottom: '2rem' },
    searchCard: {
      backgroundColor: 'var(--white)', borderRadius: 'var(--radius-md)',
      padding: '2rem', boxShadow: 'var(--shadow-sm)', marginBottom: '2rem',
    },
    fieldRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' },
    field: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
    label: { fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.5px', color: 'var(--gray-500)' },
    input: {
      padding: '0.75rem 1rem', border: '1.5px solid var(--gray-200)',
      borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', backgroundColor: 'var(--white)',
    },
    btn: {
      width: '100%', padding: '0.9rem', backgroundColor: 'var(--primary)', color: '#fff',
      border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '0.95rem', fontWeight: 600,
      letterSpacing: '1px', cursor: 'pointer', display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: '0.5rem',
    },
    card: {
      backgroundColor: 'var(--white)', borderRadius: 'var(--radius-md)',
      padding: '2rem', boxShadow: 'var(--shadow-sm)', marginBottom: '1.5rem',
    },
    sectionTitle: { fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 500, marginBottom: '1.25rem' },
    tracker: { display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '0.5rem' },
    trackerLine: {
      position: 'absolute', top: '20px', left: '10%', right: '10%',
      height: '3px', backgroundColor: 'var(--gray-200)', zIndex: 0,
    },
    trackerProgress: (pct) => ({
      position: 'absolute', top: '20px', left: '10%',
      width: `${pct}%`, height: '3px', backgroundColor: 'var(--primary)',
      zIndex: 1, transition: 'width 0.5s ease', maxWidth: '80%',
    }),
    stepIcon: (active) => ({
      width: '40px', height: '40px', borderRadius: '50%',
      backgroundColor: active ? 'var(--primary)' : 'var(--gray-200)',
      color: active ? '#fff' : 'var(--gray-400)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', zIndex: 2,
    }),
    stepLabel: (active) => ({
      fontSize: '0.75rem', fontWeight: active ? 600 : 400,
      color: active ? 'var(--primary)' : 'var(--gray-400)',
      textAlign: 'center',
    }),
    itemRow: { display: 'flex', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid var(--gray-100)', alignItems: 'center' },
    infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
    infoLabel: { fontSize: '0.8rem', color: 'var(--gray-400)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' },
    infoValue: { fontSize: '0.95rem', fontWeight: 500 },
    totalRow: { display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0' },
    divider: { borderTop: '1px solid var(--gray-200)', margin: '0.5rem 0' },
  };

  return (
    <motion.div style={styles.page} variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div style={styles.container}>
        <AnimatedSection>
          <h1 style={styles.title}>Track Your Order</h1>
          <p style={styles.subtitle}>Enter your Order ID and email address to check your order status.</p>
        </AnimatedSection>

        <AnimatedSection>
          <div style={styles.searchCard}>
            <form onSubmit={handleSubmit}>
              <div style={styles.fieldRow} className="track-field-row">
                <div style={styles.field}>
                  <label style={styles.label}>Order ID *</label>
                  <input
                    style={styles.input}
                    placeholder="Paste your Order ID..."
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    required
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Email Address *</label>
                  <input
                    style={styles.input}
                    type="email"
                    placeholder="Email used to place order"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <motion.button
                type="submit"
                style={styles.btn}
                whileHover={{ opacity: 0.9 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
              >
                <FiSearch />
                {loading ? 'Searching...' : 'Track Order'}
              </motion.button>
            </form>
          </div>
        </AnimatedSection>

        {loading && (
          <div style={{ padding: '2rem 0' }}>
            <LoadingSpinner />
          </div>
        )}

        {!loading && searched && !order && (
          <AnimatedSection>
            <div style={{ ...styles.card, textAlign: 'center', padding: '3rem 2rem', color: 'var(--gray-500)' }}>
              <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🔍</p>
              <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No order found</p>
              <p style={{ fontSize: '0.9rem' }}>Please double-check your Order ID and email address.</p>
            </div>
          </AnimatedSection>
        )}

        {!loading && order && (
          <>
            <AnimatedSection>
              <div style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h3 style={{ ...styles.sectionTitle, marginBottom: 0 }}>Order Status</h3>
                  <StatusBadge status={order.status} />
                </div>
                {order.status !== 'cancelled' ? (
                  <div style={styles.tracker}>
                    <div style={styles.trackerLine} />
                    <div style={styles.trackerProgress(progressPct)} />
                    {steps.map((step, i) => {
                      const active = i <= currentIndex;
                      const Icon = step.icon;
                      return (
                        <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', zIndex: 2, flex: 1 }}>
                          <motion.div
                            style={styles.stepIcon(active)}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: active ? 1 : 0.8 }}
                          >
                            <Icon />
                          </motion.div>
                          <span style={styles.stepLabel(active)}>{step.label}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#fee2e2', borderRadius: 'var(--radius-sm)', color: '#991b1b', fontWeight: 600 }}>
                    This order has been cancelled.
                  </div>
                )}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div style={styles.card}>
                <h3 style={styles.sectionTitle}>Order Summary</h3>
                <div style={{ marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                  Order #{order._id?.slice(-8).toUpperCase()} — Placed on {new Date(order.createdAt).toLocaleDateString()}
                </div>
                {order.items?.map((item, i) => (
                  <div key={i} style={styles.itemRow}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 500, fontSize: '0.95rem' }}>{item.name || 'Product'}</p>
                      {item.size && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Size: {item.size}</p>
                      )}
                      <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Qty: {item.quantity}</p>
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
                      EGP {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div style={styles.divider} />
                <div style={styles.totalRow}>
                  <span style={{ color: 'var(--gray-500)' }}>Shipping</span>
                  <span>{order.shippingPrice === 0 ? 'Free' : `EGP ${(order.shippingPrice || 0).toFixed(2)}`}</span>
                </div>
                <div style={styles.totalRow}>
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>Total</span>
                  <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>
                    EGP {(order.totalPrice || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div style={styles.card}>
                <h3 style={styles.sectionTitle}>Delivery Details</h3>
                <div style={styles.infoGrid} className="track-info-grid">
                  <div>
                    <p style={styles.infoLabel}>Name</p>
                    <p style={styles.infoValue}>
                      {order.guestInfo?.name || order.user?.name || '—'}
                    </p>
                  </div>
                  <div>
                    <p style={styles.infoLabel}>Phone</p>
                    <p style={styles.infoValue}>{order.shippingAddress?.phone || order.guestInfo?.phone || '—'}</p>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <p style={styles.infoLabel}>Shipping Address</p>
                    <p style={styles.infoValue}>
                      {[
                        order.shippingAddress?.street,
                        order.shippingAddress?.city,
                        order.shippingAddress?.state,
                        order.shippingAddress?.country,
                      ]
                        .filter(Boolean)
                        .join(', ') || '—'}
                    </p>
                  </div>
                  <div>
                    <p style={styles.infoLabel}>Payment Method</p>
                    <p style={{ ...styles.infoValue, textTransform: 'capitalize' }}>
                      {order.paymentMethod === 'instapay' ? 'InstaPay' : order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p style={styles.infoLabel}>Payment Status</p>
                    <StatusBadge status={order.paymentStatus || 'pending'} />
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 600px) {
          .track-field-row { grid-template-columns: 1fr !important; }
          .track-info-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  );
};

export default TrackOrder;
