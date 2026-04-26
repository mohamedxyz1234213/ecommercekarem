import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdArrowBack, MdCheck, MdClose, MdImage } from 'react-icons/md';
import API from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { getApiOrigin } from '../utils/apiBase';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [updating, setUpdating] = useState(false);
  const [proofModal, setProofModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const { data } = await API.get(`/orders/${id}`);
      setOrder(data);
      setStatusUpdate(data.status || 'pending');
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
      await API.put(`/orders/${id}/approve-instapay`);
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
      await API.put(`/orders/${id}/reject-instapay`, { reason: rejectReason });
      toast.success('Payment rejected. Customer will be notified.');
      setRejectModal(false);
      setRejectReason('');
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
  const proofImage = order.instapayProof;
  const apiBase = getApiOrigin();
  const normalizeAssetUrl = (src) => {
    if (!src) return '';
    if (/^https?:\/\//i.test(src) || src.startsWith('data:image')) return src;
    return src.startsWith('/') ? `${apiBase}${src}` : `${apiBase}/${src}`;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button className="btn btn-secondary" onClick={() => navigate('/orders')}>
          <MdArrowBack size={18} />
        </button>
        <h1 className="page-title" style={{ marginBottom: 0 }}>
          Order #{(order._id || '').slice(-6).toUpperCase()}
        </h1>
        <StatusBadge status={order.status || 'pending'} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <div>
          {/* Order Items */}
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Order Items</h3>
            {(order.items || []).map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '12px 0',
                  borderBottom: idx < (order.items || []).length - 1 ? '1px solid #f0ebe3' : 'none',
                }}
              >
                <img
                  src={normalizeAssetUrl(item.image) || 'https://via.placeholder.com/60'}
                  alt={item.name}
                  style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600 }}>{item.name || 'Product'}</p>
                  <p style={{ color: '#4d564a', fontSize: '0.85rem' }}>Qty: {item.quantity}</p>
                </div>
                <span style={{ fontWeight: 700, color: '#2D5016' }}>
                  EGP {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
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
              <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1A2E0A' }}>
                Total: EGP {(order.totalPrice || 0).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Shipping Information</h3>
            <div className="grid-2">
              <div>
                <p style={{ fontSize: '0.8rem', color: '#4d564a', marginBottom: 2 }}>Full Name</p>
                <p style={{ fontWeight: 600 }}>
                  {order.user?.name || order.guestInfo?.name || '—'}
                  {!order.user && <span style={{ marginLeft: 8, fontSize: '0.75rem', background: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>GUEST</span>}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: '#4d564a', marginBottom: 2 }}>Phone</p>
                <p style={{ fontWeight: 600 }}>{order.shippingAddress?.phone || order.guestInfo?.phone || '—'}</p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <p style={{ fontSize: '0.8rem', color: '#4d564a', marginBottom: 2 }}>Address</p>
                <p style={{ fontWeight: 600 }}>
                  {[
                    order.shippingAddress?.street,
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
              {order.instapayUsername && (
                <p style={{ marginBottom: 12, fontSize: '0.9rem' }}>
                  <strong>InstaPay Username:</strong> {order.instapayUsername}
                </p>
              )}
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
                  src={normalizeAssetUrl(proofImage)}
                  alt="Payment proof"
                  style={{ maxHeight: 300, borderRadius: 8, border: '1px solid #e0d8cc' }}
                />
                <p style={{ marginTop: 8, fontSize: '0.85rem', color: '#8B7355' }}>
                  <MdImage size={16} style={{ verticalAlign: 'middle' }} /> Click to enlarge
                </p>
              </div>

              {(order.paymentStatus || '').toLowerCase() === 'pending' && (
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

              {order.paymentStatus === 'approved' && (
                <div style={{ marginTop: 16, padding: '12px 16px', background: '#e8f5e9', borderRadius: 8, color: '#2e7d32', fontWeight: 600, textAlign: 'center' }}>
                  ✓ Payment Approved {order.paidAt ? `on ${new Date(order.paidAt).toLocaleString()}` : ''}
                </div>
              )}

              {order.paymentStatus === 'rejected' && (
                <div style={{ marginTop: 16, padding: '12px 16px', background: '#fbe9e7', borderRadius: 8, color: '#c62828', fontWeight: 600, textAlign: 'center' }}>
                  ✗ Payment Rejected {order.rejectionReason ? `— ${order.rejectionReason}` : ''}
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
                <p style={{ fontSize: '0.8rem', color: '#4d564a', marginBottom: 2 }}>Method</p>
                <StatusBadge status={order.paymentMethod || 'N/A'} />
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: '#4d564a', marginBottom: 2 }}>Status</p>
                <StatusBadge status={order.paymentStatus || 'pending'} />
              </div>
              {order.paidAt && (
                <div>
                  <p style={{ fontSize: '0.8rem', color: '#4d564a', marginBottom: 2 }}>Paid At</p>
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
                <p style={{ fontSize: '0.8rem', color: '#4d564a' }}>Name</p>
                <p style={{ fontWeight: 600 }}>
                  {order.user?.name || order.guestInfo?.name || '—'}
                  {!order.user && <span style={{ marginLeft: 8, fontSize: '0.75rem', background: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>GUEST</span>}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: '#4d564a' }}>Email</p>
                <p style={{ fontWeight: 600 }}>{order.user?.email || order.guestInfo?.email || order.email || '—'}</p>
              </div>
              {(order.guestInfo?.phone || order.shippingAddress?.phone) && (
                <div>
                  <p style={{ fontSize: '0.8rem', color: '#4d564a' }}>Phone</p>
                  <p style={{ fontWeight: 600 }}>{order.guestInfo?.phone || order.shippingAddress?.phone}</p>
                </div>
              )}
              <div>
                <p style={{ fontSize: '0.8rem', color: '#4d564a' }}>Ordered</p>
                <p style={{ fontWeight: 600 }}>{new Date(order.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Proof Image Modal */}
      <Modal isOpen={proofModal} onClose={() => setProofModal(false)} title="Payment Proof" maxWidth={800}>
        {proofImage && (
          <img
            src={normalizeAssetUrl(proofImage)}
            alt="Payment proof"
            style={{ width: '100%', borderRadius: 8 }}
          />
        )}
      </Modal>

      {/* Reject Confirmation Modal */}
      <Modal isOpen={rejectModal} onClose={() => setRejectModal(false)} title="Reject Payment">
        <p style={{ marginBottom: 12 }}>
          Are you sure you want to reject this payment? The customer will be notified via email.
        </p>
        <div className="form-group" style={{ marginBottom: 20 }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Rejection Reason (optional)</label>
          <textarea
            className="form-control"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. Payment proof is unclear or amount doesn't match"
            rows={3}
            style={{ marginTop: 6 }}
          />
        </div>
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
