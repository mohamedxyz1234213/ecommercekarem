import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdArrowBack, MdEmail, MdCalendarToday, MdShoppingCart } from 'react-icons/md';
import API from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const [userRes, ordersRes] = await Promise.allSettled([
        API.get(`/admin/users/${id}`),
        API.get(`/admin/users/${id}/orders`),
      ]);

      if (userRes.status === 'fulfilled') {
        setUser(userRes.value.data.user || userRes.value.data);
      }

      if (ordersRes.status === 'fulfilled') {
        setOrders(ordersRes.value.data.orders || ordersRes.value.data || []);
      }
    } catch {
      toast.error('Failed to fetch user');
      navigate('/users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!user) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button className="btn btn-secondary" onClick={() => navigate('/users')}>
          <MdArrowBack size={18} />
        </button>
        <h1 className="page-title" style={{ marginBottom: 0 }}>User Profile</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: '#2D5016',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 700,
                margin: '0 auto 12px',
              }}
            >
              {(user.name || 'U').charAt(0).toUpperCase()}
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: 4 }}>{user.name}</h3>
            <StatusBadge status={user.role || 'user'} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <MdEmail size={18} style={{ color: '#8B7355' }} />
              <span style={{ fontSize: '0.9rem' }}>{user.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <MdCalendarToday size={18} style={{ color: '#8B7355' }} />
              <span style={{ fontSize: '0.9rem' }}>
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <MdShoppingCart size={18} style={{ color: '#8B7355' }} />
              <span style={{ fontSize: '0.9rem' }}>{orders.length} orders</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 16, fontSize: '1.1rem' }}>Order History</h3>
          {orders.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr>
                  {['Order ID', 'Total', 'Status', 'Date'].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '10px 16px',
                        textAlign: 'left',
                        borderBottom: '2px solid #e0d8cc',
                        background: '#F5F0E8',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        color: '#1A2E0A',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    onClick={() => navigate(`/orders/${order._id}`)}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#faf8f5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                    }}
                  >
                    <td style={{ padding: '10px 16px', borderBottom: '1px solid #f0ebe3', fontFamily: 'monospace' }}>
                      #{(order._id || '').slice(-6).toUpperCase()}
                    </td>
                    <td style={{ padding: '10px 16px', borderBottom: '1px solid #f0ebe3', fontWeight: 600 }}>
                      ${(order.totalPrice || 0).toFixed(2)}
                    </td>
                    <td style={{ padding: '10px 16px', borderBottom: '1px solid #f0ebe3' }}>
                      <StatusBadge status={order.orderStatus || order.status || 'pending'} />
                    </td>
                    <td style={{ padding: '10px 16px', borderBottom: '1px solid #f0ebe3', color: '#888' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: '#888', textAlign: 'center', padding: 20 }}>No orders yet</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default UserDetail;
