import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiSmartphone, FiTruck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import AnimatedSection from '../components/AnimatedSection';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const Checkout = () => {
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    area: '',
    zipCode: '',
    notes: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('instapay');
  const [submitting, setSubmitting] = useState(false);
  const [shippingZones, setShippingZones] = useState([]);
  const [settingsLoading, setSettingsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await API.get('/settings');
        setShippingZones(Array.isArray(data.shippingZones) ? data.shippingZones.filter((z) => z.enabled !== false) : []);
      } catch {
        setShippingZones([]);
      } finally {
        setSettingsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const governorates = useMemo(
    () =>
      Array.from(new Set(shippingZones.map((zone) => String(zone.governorate || '').trim()).filter(Boolean))),
    [shippingZones]
  );

  const areaOptions = useMemo(
    () =>
      shippingZones
        .filter((zone) => String(zone.governorate || '').trim() === form.city)
        .map((zone) => String(zone.area || '').trim())
        .filter((area) => area && area !== '*' && area.toLowerCase() !== 'all'),
    [shippingZones, form.city]
  );

  const shipping = useMemo(() => {
    const exact = shippingZones.find(
      (zone) =>
        String(zone.governorate || '').trim() === form.city &&
        String(zone.area || '').trim() === form.area
    );
    if (exact) return Number(exact.fee || 0);

    const fallback = shippingZones.find(
      (zone) =>
        String(zone.governorate || '').trim() === form.city &&
        ['all', '*'].includes(String(zone.area || '').trim().toLowerCase())
    );
    return fallback ? Number(fallback.fee || 0) : null;
  }, [shippingZones, form.city, form.area]);

  const total = cartTotal + (shipping || 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'city') {
      setForm({ ...form, city: value, area: '' });
      return;
    }
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.address || !form.city) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (areaOptions.length > 0 && !form.area) {
      toast.error('Please select your area');
      return;
    }
    if (shipping === null) {
      toast.error('Shipping is unavailable for this location');
      return;
    }
    const normalizedEmail = String(form.email || user?.email || '').trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      toast.error('Please enter a valid email for payment verification');
      return;
    }
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setSubmitting(true);
    try {
      const orderData = {
        items: items.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          size: item.selectedSize || '',
        })),
        shippingAddress: {
          street: form.address,
          city: form.city,
          state: form.area || '',
          zipCode: form.zipCode || form.city,
          country: 'Egypt',
          phone: form.phone,
        },
        paymentMethod,
        email: normalizedEmail,
      };

      const { data } = await API.post('/orders', orderData);

      clearCart();
      if (paymentMethod === 'instapay') {
        navigate('/instapay-payment', { state: { orderId: data._id || 'new', total } });
      } else {
        toast.success('Order placed successfully!');
        navigate('/profile');
      }
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to place order. Please try again.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const styles = {
    page: { paddingTop: '100px', minHeight: '100vh', backgroundColor: 'transparent' },
    container: { maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem 4rem' },
    title: { fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 500, marginBottom: '2rem', color: 'var(--text)' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem', alignItems: 'start' },
    formSection: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    sectionTitle: { fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 500, marginBottom: '0.25rem' },
    fieldRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
    field: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
    label: { fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.5px', color: 'var(--gray-500)' },
    input: {
      padding: '0.75rem 1rem', border: '1.5px solid var(--gray-200)',
      borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', backgroundColor: 'var(--white)',
    },
    textarea: {
      padding: '0.75rem 1rem', border: '1.5px solid var(--gray-200)',
      borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', backgroundColor: 'var(--white)',
      minHeight: '80px', resize: 'vertical', fontFamily: 'var(--font-body)',
    },
    paymentSection: { marginTop: '0.5rem' },
    paymentOptions: { display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' },
    paymentCard: (active) => ({
      display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem',
      backgroundColor: active ? 'rgba(45, 80, 22, 0.05)' : 'var(--white)',
      border: active ? '2px solid var(--primary)' : '1.5px solid var(--gray-200)',
      borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'all 0.3s',
    }),
    paymentIcon: { fontSize: '1.5rem', color: 'var(--primary)' },
    paymentName: { fontWeight: 600, fontSize: '0.95rem' },
    paymentDesc: { fontSize: '0.8rem', color: 'var(--gray-500)' },
    summary: {
      backgroundColor: 'var(--white)', borderRadius: 'var(--radius-md)',
      padding: '2rem', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: '100px',
    },
    summaryTitle: { fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 500, marginBottom: '1.25rem' },
    summaryItem: { display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', fontSize: '0.9rem' },
    summaryItemName: { color: 'var(--gray-500)', flex: 1 },
    summaryDivider: { borderTop: '1px solid var(--gray-200)', margin: '0.75rem 0' },
    summaryTotal: { display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' },
    totalLabel: { fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 600 },
    totalVal: { fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' },
    submitBtn: {
      width: '100%', padding: '1rem', backgroundColor: 'var(--primary)', color: '#fff',
      border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '0.95rem', fontWeight: 600,
      letterSpacing: '1px', cursor: 'pointer', marginTop: '1.25rem',
      opacity: submitting ? 0.7 : 1,
    },
  };

  return (
    <motion.div style={styles.page} variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div style={styles.container}>
        <AnimatedSection>
          <h1 style={styles.title}>Checkout</h1>
        </AnimatedSection>

        <form onSubmit={handleSubmit}>
          <div style={styles.grid} className="checkout-grid">
            <div style={styles.formSection}>
              <AnimatedSection>
                <h3 style={styles.sectionTitle}>Shipping Information</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.75rem' }}>
                  <div style={styles.fieldRow} className="checkout-field-row">
                    <div style={styles.field}>
                      <label style={styles.label}>Full Name *</label>
                      <input style={styles.input} name="fullName" value={form.fullName} onChange={handleChange} required />
                    </div>
                    <div style={styles.field}>
                      <label style={styles.label}>Email</label>
                      <input style={styles.input} name="email" type="email" value={form.email} onChange={handleChange} />
                    </div>
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Phone Number *</label>
                    <input style={styles.input} name="phone" value={form.phone} onChange={handleChange} required />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Address *</label>
                    <input style={styles.input} name="address" value={form.address} onChange={handleChange} required />
                  </div>
                  <div style={styles.fieldRow} className="checkout-field-row">
                    <div style={styles.field}>
                      <label style={styles.label}>Governorate *</label>
                      <select style={styles.input} name="city" value={form.city} onChange={handleChange} required>
                        <option value="">Select governorate</option>
                        {governorates.map((governorate) => (
                          <option key={governorate} value={governorate}>
                            {governorate}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div style={styles.field}>
                      <label style={styles.label}>Area {areaOptions.length > 0 ? '*' : ''}</label>
                      {areaOptions.length > 0 ? (
                        <select style={styles.input} name="area" value={form.area} onChange={handleChange} required>
                          <option value="">Select area</option>
                          {areaOptions.map((area) => (
                            <option key={area} value={area}>
                              {area}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input style={styles.input} name="area" value={form.area} onChange={handleChange} placeholder="Area (optional)" />
                      )}
                    </div>
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Zip/Postal Code</label>
                    <input style={styles.input} name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="Optional" />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Order Notes</label>
                    <textarea style={styles.textarea} name="notes" value={form.notes} onChange={handleChange} placeholder="Special instructions..." />
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <div style={styles.paymentSection}>
                  <h3 style={styles.sectionTitle}>Payment Method</h3>
                  <div style={styles.paymentOptions}>
                    <div
                      style={styles.paymentCard(paymentMethod === 'instapay')}
                      onClick={() => setPaymentMethod('instapay')}
                    >
                      <FiSmartphone style={styles.paymentIcon} />
                      <div>
                        <p style={styles.paymentName}>InstaPay</p>
                        <p style={styles.paymentDesc}>Transfer via InstaPay</p>
                      </div>
                    </div>
                    <div
                      style={styles.paymentCard(paymentMethod === 'cod')}
                      onClick={() => setPaymentMethod('cod')}
                    >
                      <FiTruck style={styles.paymentIcon} />
                      <div>
                        <p style={styles.paymentName}>Cash on Delivery</p>
                        <p style={styles.paymentDesc}>Pay when your order arrives</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            <AnimatedSection direction="right">
              <div style={styles.summary}>
                <h3 style={styles.summaryTitle}>Order Summary</h3>
                {items.map((item) => (
                  <div key={`${item._id}-${item.selectedSize || 'default'}`} style={styles.summaryItem}>
                    <span style={styles.summaryItemName}>
                      {item.name}
                      {item.selectedSize ? ` (${item.selectedSize})` : ''} × {item.quantity}
                    </span>
                    <span>EGP {((item.salePrice || item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div style={styles.summaryDivider} />
                <div style={styles.summaryItem}>
                  <span style={{ color: 'var(--gray-500)' }}>Subtotal</span>
                  <span>EGP {cartTotal.toFixed(2)}</span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={{ color: 'var(--gray-500)' }}>Shipping</span>
                  <span>
                    {settingsLoading
                      ? 'Loading...'
                      : shipping === null
                        ? 'Unavailable'
                        : shipping === 0
                          ? 'Free'
                          : `EGP ${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div style={styles.summaryDivider} />
                <div style={styles.summaryTotal}>
                  <span style={styles.totalLabel}>Total</span>
                  <span style={styles.totalVal}>EGP {total.toFixed(2)}</span>
                </div>
                <motion.button
                  type="submit"
                  style={styles.submitBtn}
                  whileHover={{ opacity: 0.9 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={submitting}
                >
                  {submitting ? 'Processing...' : 'Place Order'}
                </motion.button>
              </div>
            </AnimatedSection>
          </div>
        </form>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
          .checkout-field-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  );
};

export default Checkout;
