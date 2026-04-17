import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiPackage, FiTruck, FiCheck, FiClock } from 'react-icons/fi';
import API from '../api/axios';
import AnimatedSection from '../components/AnimatedSection';
import LoadingSpinner from '../components/LoadingSpinner';

const FALLBACK_ORDER_ITEM_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2270%22%3E%3Crect width=%22100%25%22 height=%22100%25%22 fill=%22%23f5f0e8%22/%3E%3C/svg%3E';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/orders/${id}`);
        setOrder(data.order || null);
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div style={{ paddingTop: '120px' }}><LoadingSpinner /></div>;
  if (!order) {
    return (
      <div style={{ paddingTop: '120px', textAlign: 'center', color: 'var(--gray-500)' }}>
        Order not found.
      </div>
    );
  }

  const steps = [
    { key: 'pending', label: 'Confirmed', icon: FiClock },
    { key: 'processing', label: 'Processing', icon: FiPackage },
    { key: 'shipped', label: 'Shipped', icon: FiTruck },
    { key: 'delivered', label: 'Delivered', icon: FiCheck },
  ];

  const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
  const currentIndex = statusOrder.indexOf(order.status);

  const styles = {
    page: { paddingTop: '100px', minHeight: '100vh', backgroundColor: 'var(--light)' },
    container: { maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem 4rem' },
    back: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gray-500)', fontSize: '0.9rem', marginBottom: '2rem', textDecoration: 'none' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
    title: { fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 500 },
    date: { fontSize: '0.9rem', color: 'var(--gray-500)' },
    card: { backgroundColor: 'var(--white)', borderRadius: 'var(--radius-md)', padding: '2rem', boxShadow: 'var(--shadow-sm)', marginBottom: '1.5rem' },
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
    trackerStep: (active) => ({
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
      zIndex: 2, flex: 1,
    }),
    stepIcon: (active) => ({
      width: '40px', height: '40px', borderRadius: '50%',
      backgroundColor: active ? 'var(--primary)' : 'var(--gray-200)',
      color: active ? '#fff' : 'var(--gray-400)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
    }),
    stepLabel: (active) => ({
      fontSize: '0.75rem', fontWeight: active ? 600 : 400,
      color: active ? 'var(--primary)' : 'var(--gray-400)',
      textAlign: 'center',
    }),
    itemRow: { display: 'flex', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid var(--gray-100)', alignItems: 'center' },
    itemImg: { width: '60px', height: '70px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--secondary)' },
    itemName: { fontWeight: 500, fontSize: '0.95rem' },
    itemQty: { fontSize: '0.85rem', color: 'var(--gray-500)' },
    itemPrice: { marginLeft: 'auto', fontWeight: 600, color: 'var(--primary)' },
    infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
    infoLabel: { fontSize: '0.8rem', color: 'var(--gray-400)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' },
    infoValue: { fontSize: '0.95rem', fontWeight: 500 },
    totalRow: { display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0' },
    totalLabel: { fontSize: '0.95rem', color: 'var(--gray-500)' },
    totalVal: { fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' },
    divider: { borderTop: '1px solid var(--gray-200)', margin: '0.5rem 0' },
  };

  const progressPct = currentIndex >= 0 ? (currentIndex / (steps.length - 1)) * 100 : 0;

  return (
    <motion.div style={styles.page} variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div style={styles.container}>
        <Link to="/profile" style={styles.back}>
          <FiArrowLeft /> Back to Orders
        </Link>

        <AnimatedSection>
          <div style={styles.header}>
            <div>
              <h1 style={styles.title}>Order #{order._id?.slice(-6) || order._id}</h1>
              <p style={styles.date}>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>Order Status</h3>
            <div style={styles.tracker}>
              <div style={styles.trackerLine} />
              <div style={styles.trackerProgress(progressPct)} />
              {steps.map((step, i) => {
                const active = i <= currentIndex;
                const Icon = step.icon;
                return (
                  <div key={step.key} style={styles.trackerStep(active)}>
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
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>Items</h3>
            {order.items?.map((item, i) => (
              <div key={i} style={styles.itemRow}>
                <img
                  src={item.product?.images?.[0] || FALLBACK_ORDER_ITEM_IMAGE}
                  alt={item.product?.name || item.name}
                  style={styles.itemImg}
                />
                <div>
                  <p style={styles.itemName}>{item.product?.name || item.name || 'Product'}</p>
                  {item.size && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Size: {item.size}</p>
                  )}
                  <p style={styles.itemQty}>Qty: {item.quantity}</p>
                </div>
                <span style={styles.itemPrice}>EGP {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div style={styles.divider} />
            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Total</span>
              <span style={styles.totalVal}>EGP {order.total?.toFixed(2)}</span>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>Details</h3>
            <div style={styles.infoGrid} className="order-info-grid">
              <div>
                <p style={styles.infoLabel}>Shipping Address</p>
                <p style={styles.infoValue}>
                  {order.shippingAddress?.fullName}<br />
                  {order.shippingAddress?.address}<br />
                  {order.shippingAddress?.city}
                </p>
              </div>
              <div>
                <p style={styles.infoLabel}>Payment Method</p>
                <p style={{ ...styles.infoValue, textTransform: 'capitalize' }}>
                  {order.paymentMethod || 'N/A'}
                </p>
              </div>
              <div>
                <p style={styles.infoLabel}>Phone</p>
                <p style={styles.infoValue}>{order.shippingAddress?.phone || 'N/A'}</p>
              </div>
              <div>
                <p style={styles.infoLabel}>Order ID</p>
                <p style={styles.infoValue}>{order._id}</p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .order-info-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  );
};

export default OrderDetail;
