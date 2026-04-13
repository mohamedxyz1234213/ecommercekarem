import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiMinus, FiTrash2, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
  const { items, cartTotal, isDrawerOpen, setIsDrawerOpen, updateQuantity, removeFromCart } =
    useCart();
  const navigate = useNavigate();

  const styles = {
    overlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 2000,
      cursor: 'pointer',
    },
    drawer: {
      position: 'fixed',
      top: 0,
      right: 0,
      width: '400px',
      maxWidth: '90vw',
      height: '100vh',
      backgroundColor: 'var(--white)',
      zIndex: 2001,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '-10px 0 40px rgba(0,0,0,0.1)',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.5rem',
      borderBottom: '1px solid var(--gray-200)',
    },
    title: {
      fontFamily: 'var(--font-heading)',
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      fontSize: '1.25rem',
      color: 'var(--text)',
      cursor: 'pointer',
      padding: '4px',
    },
    body: {
      flex: 1,
      overflowY: 'auto',
      padding: '1rem 1.5rem',
    },
    emptyMsg: {
      textAlign: 'center',
      padding: '3rem 0',
      color: 'var(--gray-400)',
      fontSize: '0.95rem',
    },
    item: {
      display: 'flex',
      gap: '1rem',
      padding: '1rem 0',
      borderBottom: '1px solid var(--gray-100)',
    },
    itemImg: {
      width: '70px',
      height: '85px',
      objectFit: 'cover',
      borderRadius: 'var(--radius-sm)',
      backgroundColor: 'var(--secondary)',
    },
    itemInfo: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    itemName: {
      fontFamily: 'var(--font-heading)',
      fontSize: '0.95rem',
      fontWeight: 500,
    },
    itemPrice: {
      fontSize: '0.9rem',
      fontWeight: 600,
      color: 'var(--primary)',
    },
    qtyRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    qtyBtn: {
      width: '28px',
      height: '28px',
      borderRadius: '50%',
      border: '1px solid var(--gray-200)',
      backgroundColor: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '0.8rem',
      color: 'var(--text)',
    },
    qty: {
      fontSize: '0.9rem',
      fontWeight: 600,
      minWidth: '20px',
      textAlign: 'center',
    },
    removeBtn: {
      background: 'none',
      border: 'none',
      color: 'var(--gray-400)',
      cursor: 'pointer',
      fontSize: '0.9rem',
      padding: '4px',
    },
    footer: {
      padding: '1.5rem',
      borderTop: '1px solid var(--gray-200)',
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
    },
    totalLabel: {
      fontFamily: 'var(--font-heading)',
      fontSize: '1rem',
      fontWeight: 500,
    },
    totalAmount: {
      fontSize: '1.25rem',
      fontWeight: 700,
      color: 'var(--primary)',
    },
    checkoutBtn: {
      width: '100%',
      padding: '0.9rem',
      backgroundColor: 'var(--primary)',
      color: '#fff',
      border: 'none',
      borderRadius: 'var(--radius-sm)',
      fontSize: '0.9rem',
      fontWeight: 600,
      letterSpacing: '1px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
    },
    viewCartBtn: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: 'transparent',
      color: 'var(--text)',
      border: '1px solid var(--gray-200)',
      borderRadius: 'var(--radius-sm)',
      fontSize: '0.85rem',
      fontWeight: 500,
      cursor: 'pointer',
      marginTop: '0.5rem',
    },
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            style={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDrawerOpen(false)}
          />
          <motion.div
            style={styles.drawer}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div style={styles.header}>
              <h3 style={styles.title}>Shopping Bag ({items.length})</h3>
              <button
                style={styles.closeBtn}
                onClick={() => setIsDrawerOpen(false)}
                aria-label="Close cart"
              >
                <FiX />
              </button>
            </div>

            <div style={styles.body}>
              {items.length === 0 ? (
                <p style={styles.emptyMsg}>Your bag is empty</p>
              ) : (
                items.map((item) => (
                  <div key={item._id} style={styles.item}>
                    <img
                      src={item.images?.[0] || 'https://placehold.co/70x85/F5F0E8/8B7355?text=P'}
                      alt={item.name}
                      style={styles.itemImg}
                    />
                    <div style={styles.itemInfo}>
                      <div>
                        <p style={styles.itemName}>{item.name}</p>
                        <p style={styles.itemPrice}>
                          EGP {((item.salePrice || item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={styles.qtyRow}>
                          <button
                            style={styles.qtyBtn}
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          >
                            <FiMinus />
                          </button>
                          <span style={styles.qty}>{item.quantity}</span>
                          <button
                            style={styles.qtyBtn}
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          >
                            <FiPlus />
                          </button>
                        </div>
                        <button
                          style={styles.removeBtn}
                          onClick={() => removeFromCart(item._id)}
                          aria-label="Remove item"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div style={styles.footer}>
                <div style={styles.totalRow}>
                  <span style={styles.totalLabel}>Total</span>
                  <span style={styles.totalAmount}>EGP {cartTotal.toFixed(2)}</span>
                </div>
                <motion.button
                  style={styles.checkoutBtn}
                  whileHover={{ opacity: 0.9 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsDrawerOpen(false);
                    navigate('/checkout');
                  }}
                >
                  Checkout <FiArrowRight />
                </motion.button>
                <button
                  style={styles.viewCartBtn}
                  onClick={() => {
                    setIsDrawerOpen(false);
                    navigate('/cart');
                  }}
                >
                  View Full Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
