import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiEdit2, FiPackage, FiChevronRight, FiHeart, FiShoppingBag, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import API from '../api/axios';
import AnimatedSection from '../components/AnimatedSection';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { addToCart } = useCart();
  const { wishlistItems, removeFromWishlist, loadingWishlist } = useWishlist();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders/my');
        const rawOrders = Array.isArray(data?.orders) ? data.orders : [];
        const normalizedOrders = rawOrders
          .map((order) => ({
            ...order,
            _id: order._id || order.id || order.orderId || '',
          }))
          .filter((order) => order._id);
        setOrders(normalizedOrders);
      } catch {
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  const handleSave = async () => {
    try {
      await updateProfile(form);
      setEditing(false);
    } catch {
      // handled in context
    }
  };

  const statusColors = {
    pending: { bg: '#FEF3C7', text: '#92400E' },
    processing: { bg: '#DBEAFE', text: '#1E40AF' },
    shipped: { bg: '#E0E7FF', text: '#3730A3' },
    delivered: { bg: '#D1FAE5', text: '#065F46' },
    cancelled: { bg: '#FEE2E2', text: '#991B1B' },
  };

  const styles = {
    page: { paddingTop: '100px', minHeight: '100vh', backgroundColor: 'transparent' },
    container: { maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem 4rem' },
    title: { fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 500, marginBottom: '2rem', color: 'var(--text)' },
    grid: { display: 'grid', gridTemplateColumns: '340px 1fr', gap: '2.5rem', alignItems: 'start' },
    profileCard: { backgroundColor: 'var(--white)', borderRadius: 'var(--radius-md)', padding: '2rem', boxShadow: 'var(--shadow-sm)' },
    avatar: {
      width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--secondary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '2rem', color: 'var(--accent)', margin: '0 auto 1.25rem',
      fontFamily: 'var(--font-heading)', fontWeight: 600,
    },
    profileName: { textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 500, marginBottom: '0.25rem' },
    profileEmail: { textAlign: 'center', fontSize: '0.9rem', color: 'var(--gray-500)', marginBottom: '1.5rem' },
    infoItem: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid var(--gray-100)', fontSize: '0.9rem' },
    infoIcon: { color: 'var(--accent)', fontSize: '1rem' },
    infoLabel: { color: 'var(--gray-500)', minWidth: '60px' },
    editBtn: {
      width: '100%', padding: '0.75rem', marginTop: '1.25rem',
      border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-sm)',
      backgroundColor: 'transparent', fontSize: '0.85rem', fontWeight: 500,
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
    },
    editInput: {
      width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid var(--gray-200)',
      borderRadius: 'var(--radius-sm)', fontSize: '0.9rem',
    },
    saveBtnRow: { display: 'flex', gap: '0.5rem', marginTop: '1rem' },
    saveBtn: { flex: 1, padding: '0.6rem', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' },
    cancelBtn: { flex: 1, padding: '0.6rem', backgroundColor: 'var(--gray-200)', color: 'var(--text)', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', cursor: 'pointer' },
    ordersSection: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    ordersTitle: { fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 500, marginBottom: '0.5rem' },
    orderCard: {
      backgroundColor: 'var(--white)', borderRadius: 'var(--radius-md)', padding: '1.25rem',
      boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      textDecoration: 'none', color: 'inherit',
    },
    orderInfo: { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
    orderId: { fontSize: '0.95rem', fontWeight: 600 },
    orderDate: { fontSize: '0.8rem', color: 'var(--gray-400)' },
    orderItems: { fontSize: '0.85rem', color: 'var(--gray-500)' },
    orderRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' },
    orderTotal: { fontSize: '1rem', fontWeight: 700, color: 'var(--primary)' },
    statusBadge: (status) => ({
      padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
      textTransform: 'capitalize', letterSpacing: '0.5px',
      backgroundColor: statusColors[status]?.bg || '#F3F4F6',
      color: statusColors[status]?.text || '#374151',
    }),
    emptyOrders: { textAlign: 'center', padding: '3rem', color: 'var(--gray-400)', fontSize: '0.95rem' },
    wishlistSection: { marginTop: '2rem' },
    wishlistGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
      gap: '1rem',
    },
    wishlistHead: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '0.75rem',
      gap: '0.75rem',
    },
    wishlistActions: { display: 'flex', gap: '0.5rem' },
    smallBtn: {
      border: '1px solid var(--gray-200)',
      backgroundColor: 'var(--white)',
      borderRadius: 'var(--radius-sm)',
      padding: '0.4rem 0.65rem',
      cursor: 'pointer',
      color: 'var(--text)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem',
      fontSize: '0.8rem',
    },
  };

  return (
    <motion.div style={styles.page} variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div style={styles.container}>
        <AnimatedSection>
          <h1 style={styles.title}>My Account</h1>
        </AnimatedSection>

        <div style={styles.grid} className="profile-grid">
          <AnimatedSection>
            <div style={styles.profileCard}>
              <div style={styles.avatar}>
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>

              {editing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <input style={styles.editInput} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" />
                  <input style={styles.editInput} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" type="email" />
                  <input style={styles.editInput} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" />
                  <div style={styles.saveBtnRow}>
                    <button style={styles.saveBtn} onClick={handleSave}>Save</button>
                    <button style={styles.cancelBtn} onClick={() => setEditing(false)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 style={styles.profileName}>{user?.name || 'User'}</h2>
                  <p style={styles.profileEmail}>{user?.email}</p>
                  <div style={styles.infoItem}>
                    <FiUser style={styles.infoIcon} />
                    <span style={styles.infoLabel}>Name</span>
                    <span>{user?.name}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <FiMail style={styles.infoIcon} />
                    <span style={styles.infoLabel}>Email</span>
                    <span>{user?.email}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <FiPhone style={styles.infoIcon} />
                    <span style={styles.infoLabel}>Phone</span>
                    <span>{user?.phone || 'Not set'}</span>
                  </div>
                  <button style={styles.editBtn} onClick={() => setEditing(true)}>
                    <FiEdit2 /> Edit Profile
                  </button>
                </>
              )}
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div style={styles.ordersSection}>
              <h2 style={styles.ordersTitle}>
                <FiPackage style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Order History
              </h2>

              {loadingOrders ? (
                <LoadingSpinner />
              ) : orders.length === 0 ? (
                <p style={styles.emptyOrders}>No orders yet</p>
              ) : (
                orders.map((order) => (
                  <motion.div key={order._id} whileHover={{ y: -2, boxShadow: 'var(--shadow-md)' }}>
                    <Link to={`/order/${order._id}`} style={styles.orderCard}>
                      <div style={styles.orderInfo}>
                        <span style={styles.orderId}>Order #{order._id?.slice(-6) || order._id}</span>
                        <span style={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString()}</span>
                        <span style={styles.orderItems}>
                          {order.items
                            ?.map(
                              (item) =>
                                `${item.name || 'Item'}${item.size ? ` (${item.size})` : ''} × ${item.quantity}`
                            )
                            .join(', ')}
                        </span>
                      </div>
                      <div style={styles.orderRight}>
                        <span style={styles.orderTotal}>EGP {(order.totalPrice || 0).toFixed(2)}</span>
                        <span style={styles.statusBadge(order.status)}>{order.status}</span>
                        <FiChevronRight style={{ color: 'var(--gray-400)' }} />
                      </div>
                    </Link>
                  </motion.div>
                ))
              )}
            </div>

            <div id="wishlist" style={styles.wishlistSection}>
              <div style={styles.wishlistHead}>
                <h2 style={styles.ordersTitle}>
                  <FiHeart style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                  Wishlist ({wishlistItems.length})
                </h2>
              </div>
              {loadingWishlist ? (
                <LoadingSpinner />
              ) : wishlistItems.length === 0 ? (
                <p style={styles.emptyOrders}>Your wishlist is empty</p>
              ) : (
                <div style={styles.wishlistGrid}>
                  {wishlistItems.map((item) => (
                    <div key={item._id}>
                      <ProductCard product={item} />
                      <div style={styles.wishlistActions}>
                        <button
                          style={styles.smallBtn}
                          onClick={() => addToCart(item)}
                          type="button"
                        >
                          <FiShoppingBag /> Add to cart
                        </button>
                        <button
                          style={styles.smallBtn}
                          onClick={() => removeFromWishlist(item._id)}
                          type="button"
                        >
                          <FiTrash2 /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .profile-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  );
};

export default Profile;
