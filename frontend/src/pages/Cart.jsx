import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiMinus, FiTrash2, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { useCart, getItemMaxStock } from '../context/CartContext';
import AnimatedSection from '../components/AnimatedSection';
import PageSEO from '../utils/useSEO';

const FALLBACK_CART_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22120%22%3E%3Crect width=%22100%25%22 height=%22100%25%22 fill=%22%23f5f0e8%22/%3E%3C/svg%3E';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const Cart = () => {
  const { items, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const styles = {
    page: { paddingTop: '100px', minHeight: '100vh', backgroundColor: 'transparent' },
    container: { maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem 4rem' },
    header: { marginBottom: '2rem' },
    title: { fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 500, color: 'var(--text)' },
    empty: {
      textAlign: 'center', padding: '4rem 0',
    },
    emptyText: { fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--gray-400)', marginBottom: '1.5rem' },
    continueBtn: {
      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
      padding: '0.9rem 2rem', backgroundColor: 'var(--primary)', color: '#fff',
      borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', fontWeight: 600,
      textDecoration: 'none', letterSpacing: '1px',
    },
    grid: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: '3rem', alignItems: 'start' },
    itemsSection: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    itemCard: {
      display: 'flex', gap: '1.25rem', padding: '1.25rem',
      backgroundColor: 'var(--white)', borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
    },
    itemImg: { width: '100px', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--secondary)' },
    itemInfo: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    itemName: { fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 500 },
    itemBrand: { fontSize: '0.8rem', color: 'var(--accent)', letterSpacing: '1px', textTransform: 'uppercase' },
    itemBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    qtyControl: { display: 'flex', alignItems: 'center', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' },
    qtyBtn: { width: '32px', height: '32px', backgroundColor: 'var(--white)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' },
    qtyVal: { padding: '0 0.75rem', fontWeight: 600, fontSize: '0.9rem', borderLeft: '1px solid var(--gray-200)', borderRight: '1px solid var(--gray-200)' },
    itemPrice: { fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' },
    removeBtn: { background: 'none', border: 'none', color: 'var(--gray-400)', cursor: 'pointer', fontSize: '1rem', padding: '4px' },
    summary: {
      backgroundColor: 'var(--white)', borderRadius: 'var(--radius-md)',
      padding: '2rem', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: '100px',
    },
    summaryTitle: { fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 500, marginBottom: '1.5rem' },
    summaryRow: { display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', fontSize: '0.95rem' },
    summaryLabel: { color: 'var(--gray-500)' },
    summaryDivider: { borderTop: '1px solid var(--gray-200)', margin: '0.75rem 0' },
    summaryTotal: { fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 600 },
    summaryTotalVal: { fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' },
    checkoutBtn: {
      width: '100%', padding: '1rem', backgroundColor: 'var(--primary)', color: '#fff',
      border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '0.95rem', fontWeight: 600,
      letterSpacing: '1px', cursor: 'pointer', display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: '0.5rem', marginTop: '1.25rem',
    },
    shopLink: {
      display: 'block', textAlign: 'center', color: 'var(--accent)',
      fontSize: '0.85rem', marginTop: '1rem',
    },
  };

  return (
    <motion.div style={styles.page} variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageSEO title="Shopping Bag" description="Review your selected luxury perfumes and fragrances in your vybe shopping bag." url="/cart" />
      <div style={styles.container}>
        <AnimatedSection>
          <div style={styles.header}>
            <h1 style={styles.title}>Shopping Bag</h1>
          </div>
        </AnimatedSection>

        {items.length === 0 ? (
          <AnimatedSection>
            <div style={styles.empty}>
              <p style={styles.emptyText}>Your bag is empty</p>
              <Link to="/shop" style={styles.continueBtn}>
                <FiArrowLeft /> Continue Shopping
              </Link>
            </div>
          </AnimatedSection>
        ) : (
          <div style={styles.grid} className="cart-grid">
            <div style={styles.itemsSection}>
              {items.map((item) => (
                <AnimatedSection key={`${item._id}-${item.selectedSize || 'default'}`}>
                  <motion.div style={styles.itemCard} whileHover={{ y: -2 }}>
                    <img
                      src={item.images?.[0] || FALLBACK_CART_IMAGE}
                      alt={item.name}
                      style={styles.itemImg}
                      loading="lazy"
                      width={100}
                      height={120}
                    />
                    <div style={styles.itemInfo}>
                      <div>
                        {item.brand && <p style={styles.itemBrand}>{item.brand}</p>}
                        <h3 style={styles.itemName}>{item.name}</h3>
                        {item.selectedSize && (
                          <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Size: {item.selectedSize}</p>
                        )}
                        {(() => {
                          const max = getItemMaxStock(item);
                          return max <= 3 && max > 0 ? (
                            <p style={{ fontSize: '0.75rem', color: max === 1 ? '#dc2626' : '#d97706', fontWeight: 700, marginTop: '2px' }}>
                              {max === 1 ? '🔴 Last piece!' : `Only ${max} left!`}
                            </p>
                          ) : null;
                        })()}
                      </div>
                      <div style={styles.itemBottom}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={styles.qtyControl}>
                            <button
                              style={styles.qtyBtn}
                              onClick={() => updateQuantity(item._id, item.selectedSize, item.quantity - 1)}
                            >
                              <FiMinus />
                            </button>
                            <span style={styles.qtyVal}>{item.quantity}</span>
                            <button
                              style={{
                                ...styles.qtyBtn,
                                ...(item.quantity >= getItemMaxStock(item) ? { opacity: 0.4, cursor: 'not-allowed' } : {}),
                              }}
                              onClick={() => {
                                if (item.quantity >= getItemMaxStock(item)) return;
                                updateQuantity(item._id, item.selectedSize, item.quantity + 1);
                              }}
                              disabled={item.quantity >= getItemMaxStock(item)}
                            >
                              <FiPlus />
                            </button>
                          </div>
                          <button
                            style={styles.removeBtn}
                            onClick={() => removeFromCart(item._id, item.selectedSize)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                        <span style={styles.itemPrice}>
                          EGP {((item.salePrice || item.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection direction="right">
              <div style={styles.summary}>
                <h3 style={styles.summaryTitle}>Order Summary</h3>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Subtotal</span>
                  <span>EGP {cartTotal.toFixed(2)}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Shipping</span>
                  <span>{cartTotal >= 500 ? 'Free' : 'EGP 50.00'}</span>
                </div>
                <div style={styles.summaryDivider} />
                <div style={styles.summaryRow}>
                  <span style={styles.summaryTotal}>Total</span>
                  <span style={styles.summaryTotalVal}>
                    EGP {(cartTotal + (cartTotal >= 500 ? 0 : 50)).toFixed(2)}
                  </span>
                </div>
                <motion.button
                  style={styles.checkoutBtn}
                  whileHover={{ opacity: 0.9 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout <FiArrowRight />
                </motion.button>
                <Link to="/shop" style={styles.shopLink}>
                  Continue Shopping
                </Link>
              </div>
            </AnimatedSection>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  );
};

export default Cart;
