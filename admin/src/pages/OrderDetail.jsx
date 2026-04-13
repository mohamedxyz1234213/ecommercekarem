import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdArrowBack, MdCheck, MdClose, MdImage } from 'react-icons/md';
import API from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [updating, setUpdating] = useState(false);
  const [proofModal, setProofModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const { data } = await API.get(`/orders/${id}`);
      const o = data.order || data;
      setOrder(o);
      setStatusUpdate(o.orderStatus || o.status || 'pending');
    } catch {
      toast.error('Failed to fetch order');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    setUpdating(true);
    try {
      await API.put(`/orders/${id}/status`, { status: statusUpdate });
      toast.success(`Order status updated to ${statusUpdate}`);
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleApprovePayment = async () => {
    setUpdating(true);
    try {
      await API.put(`/orders/${id}/approve-payment`);
      toast.success('Payment approved! Customer will be notified.');
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve payment');
    } finally {
      setUpdating(false);
    }
  };

  const handleRejectPayment = async () => {
    setUpdating(true);
    try {
      await API.put(`/orders/${id}/reject-payment`);
      toast.success('Payment rejected. Customer will be notified.');
      setRejectModal(false);
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject payment');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!order) return null;

  const isInstaPay = (order.paymentMethod || '').toLowerCase() === 'instapay';
  const proofImage = order.paymentProof || order.instaPayProof || order.proofImage;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button className="btn btn-secondary" onClick={() => navigate('/orders')}>
          <MdArrowBack size={18} />
        </button>
        <h1 className="page-title" style={{ marginBottom: 0 }}>
          Order #{(order._id || '').slice(-6).toUpperCase()}
        </h1>
        <StatusBadge status={order.orderStatus || order.status || 'pending'} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <div>
          {/* Order Items */}
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Order Items</h3>
            {(order.items || order.orderItems || []).map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '12px 0',
                  borderBottom: idx < (order.items || order.orderItems || []).length - 1 ? '1px solid #f0ebe3' : 'none',
                }}
              >
                <img
                  src={item.image || item.product?.images?.[0] || 'https://via.placeholder.com/60'}
                  alt={item.name || item.product?.name}
                  style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600 }}>{item.name || item.product?.name || 'Product'}</p>
                  <p style={{ color: '#888', fontSize: '0.85rem' }}>Qty: {item.quantity || item.qty}</p>
                </div>
                <span style={{ fontWeight: 700, color: '#2D5016' }}>
                  ${((item.price || 0) * (item.quantity || item.qty || 1)).toFixed(2)}
                </span>
              </div>
            ))}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                paddingTop: 16,
                marginTop: 8,
                borderTop: '2px solid #e0d8cc',
              }}
            >
              <div style={{ textAlign: 'right' }}>
                {order.shippingPrice > 0 && (
                  <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: 4 }}>
                    Shipping: ${order.shippingPrice?.toFixed(2)}
                  </p>
                )}
                <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1A2E0A' }}>
                  Total: ${(order.totalPrice || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Shipping Information</h3>
            <div className="grid-2">
              <div>
                <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: 2 }}>Full Name</p>
                <p style={{ fontWeight: 600 }}>{order.shippingAddress?.fullName || order.user?.name || '—'}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: 2 }}>Phone</p>
                <p style={{ fontWeight: 600 }}>{order.shippingAddress?.phone || '—'}</p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: 2 }}>Address</p>
                <p style={{ fontWeight: 600 }}>
                  {[
                    order.shippingAddress?.address,
                    order.shippingAddress?.city,
                    order.shippingAddress?.state,
                    order.shippingAddress?.zipCode,
                    order.shippingAddress?.country,
                  ]
                    .filter(Boolean)
                    .join(', ') || '—'}
                </p>
              </div>
            </div>
          </div>

          {/* InstaPay Proof */}
          {isInstaPay && proofImage && (
            <div className="card">
              <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>InstaPay Payment Proof</h3>
              <div
                style={{
                  background: '#FAF8F5',
                  borderRadius: 12,
                  padding: 16,
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => setProofModal(true)}
              >
                <img
                  src={proofImage}
                  alt="Payment proof"
                  style={{ maxHeight: 300, borderRadius: 8, border: '1px solid #e0d8cc' }}
                />
                <p style={{ marginTop: 8, fontSize: '0.85rem', color: '#8B7355' }}>
                  <MdImage size={16} style={{ verticalAlign: 'middle' }} /> Click to enlarge
                </p>
              </div>

              {(order.paymentStatus || '').toLowerCase() !== 'approved' && (
                <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                  <button
                    className="btn btn-success"
                    onClick={handleApprovePayment}
                    disabled={updating}
                    style={{ flex: 1 }}
                  >
                    <MdCheck size={18} /> Approve Payment
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => setRejectModal(true)}
                    disabled={updating}
                    style={{ flex: 1 }}
                  >
                    <MdClose size={18} /> Reject Payment
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Payment Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: 2 }}>Method</p>
                <StatusBadge status={order.paymentMethod || 'N/A'} />
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: 2 }}>Status</p>
                <StatusBadge status={order.paymentStatus || (order.isPaid ? 'paid' : 'unpaid')} />
              </div>
              {order.paidAt && (
                <div>
                  <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: 2 }}>Paid At</p>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    {new Date(order.paidAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Update Status</h3>
            <select
              className="form-control"
              value={statusUpdate}
              onChange={(e) => setStatusUpdate(e.target.value)}
              style={{ marginBottom: 12 }}
            >
              {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
            <button
              className="btn btn-primary"
              onClick={handleStatusUpdate}
              disabled={updating}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {updating ? 'Updating...' : 'Update Status'}
            </button>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Customer</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>
                <p style={{ fontSize: '0.8rem', color: '#888' }}>Name</p>
                <p style={{ fontWeight: 600 }}>{order.user?.name || '—'}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: '#888' }}>Email</p>
                <p style={{ fontWeight: 600 }}>{order.user?.email || '—'}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: '#888' }}>Ordered</p>
                <p style={{ fontWeight: 600 }}>{new Date(order.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Proof Image Modal */}
      <Modal isOpen={proofModal} onClose={() => setProofModal(false)} title="Payment Proof" maxWidth={800}>
        <img
          src={proofImage}
          alt="Payment proof"
          style={{ width: '100%', borderRadius: 8 }}
        />
      </Modal>

      {/* Reject Confirmation Modal */}
      <Modal isOpen={rejectModal} onClose={() => setRejectModal(false)} title="Reject Payment">
        <p style={{ marginBottom: 20 }}>
          Are you sure you want to reject this payment? The customer will be notified via email.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={() => setRejectModal(false)}>Cancel</button>
          <button className="btn btn-danger" onClick={handleRejectPayment} disabled={updating}>
            {updating ? 'Rejecting...' : 'Reject Payment'}
          </button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default OrderDetail;
