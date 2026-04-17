import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdAttachMoney, MdShoppingCart, MdPeople, MdInventory } from 'react-icons/md';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import API from '../api/axios';
import StatsCard from '../components/StatsCard';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { resolveMediaUrl } from '../utils/resolveMediaUrl';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, users: 0, products: 0 });
  const [revenueData, setRevenueData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, productsRes] = await Promise.allSettled([
        API.get('/admin/dashboard'),
        API.get('/products?limit=5&sort=-sold'),
      ]);

      if (statsRes.status === 'fulfilled') {
        const s = statsRes.value.data;
        setStats({
          revenue: s.totalRevenue ?? s.revenue ?? 0,
          orders: s.totalOrders ?? s.orders ?? 0,
          users: s.totalUsers ?? s.users ?? 0,
          products: s.totalProducts ?? s.products ?? 0,
        });
        if (s.revenueData) setRevenueData(s.revenueData);
        const ro = s.recentOrders;
        if (Array.isArray(ro) && ro.length > 0) {
          setRecentOrders(ro.slice(0, 5));
        }
      } else {
        console.error('Dashboard stats failed:', statsRes.reason);
        toast.error('Could not load dashboard stats. Check API connection.');
      }

      if (productsRes.status === 'fulfilled') {
        const d = productsRes.value.data;
        const prods = d.products || d || [];
        setTopProducts(Array.isArray(prods) ? prods.slice(0, 5) : []);
      } else {
        console.error('Dashboard products failed:', productsRes.reason);
      }
    } catch (e) {
      console.error(e);
      toast.error('Dashboard request failed.');
    } finally {
      setLoading(false);
    }
  };

  // Fallback chart data if API doesn't return revenue data
  const chartData = revenueData.length > 0
    ? revenueData
    : [
        { month: 'Jan', revenue: 0 },
        { month: 'Feb', revenue: 0 },
        { month: 'Mar', revenue: 0 },
        { month: 'Apr', revenue: 0 },
        { month: 'May', revenue: 0 },
        { month: 'Jun', revenue: 0 },
      ];

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <h1 className="page-title">Dashboard</h1>

      <div className="grid-4" style={{ marginBottom: 24 }}>
        <StatsCard
          icon={MdAttachMoney}
          label="Total Revenue"
          value={stats.revenue}
          prefix="EGP "
          isCurrency
          trend="up"
          trendValue={12}
          color="#2D5016"
        />
        <StatsCard
          icon={MdShoppingCart}
          label="Total Orders"
          value={stats.orders}
          trend="up"
          trendValue={8}
          color="#C4A265"
        />
        <StatsCard
          icon={MdPeople}
          label="Total Users"
          value={stats.users}
          trend="up"
          trendValue={15}
          color="#8B7355"
        />
        <StatsCard
          icon={MdInventory}
          label="Total Products"
          value={stats.products}
          color="#1A2E0A"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 24 }}>
        <div className="card">
          <h3 style={{ marginBottom: 20, fontSize: '1.1rem', color: '#142016' }}>Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0d8cc" />
              <XAxis dataKey="month" stroke="#5c6360" fontSize={12} />
              <YAxis stroke="#5c6360" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: '#1A2E0A',
                  border: 'none',
                  borderRadius: 8,
                  color: '#FAF8F5',
                  fontSize: '0.85rem',
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#2D5016"
                strokeWidth={3}
                dot={{ fill: '#C4A265', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, fill: '#C4A265' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 20, fontSize: '1.1rem', color: '#142016' }}>Top Selling Products</h3>
          {topProducts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {topProducts.map((product, idx) => (
                <div
                  key={product._id || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: 10,
                    borderRadius: 8,
                    background: '#FAF8F5',
                  }}
                >
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: '#2D5016',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </span>
                  <img
                    src={resolveMediaUrl(product.images?.[0]) || 'https://via.placeholder.com/40'}
                    alt={product.name}
                    style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#142016' }}>
                      {product.name}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#4d564a' }}>{product.sold || 0} sold</p>
                  </div>
                  <span style={{ fontWeight: 700, color: '#2D5016', fontSize: '0.85rem' }}>
                    ${product.price}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#4d564a', textAlign: 'center', padding: 20 }}>No products yet</p>
          )}
        </div>
      </div>

      <div className="card">
        <div className="flex-between" style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: '1.1rem', color: '#142016' }}>Recent Orders</h3>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/orders')}>
            View All
          </button>
        </div>
        {recentOrders.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr>
                {['Order ID', 'Customer', 'Total', 'Status', 'Date'].map((h) => (
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
              {recentOrders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => navigate(`/orders/${order._id}`)}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#faf8f5'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; }}
                >
                  <td style={{ padding: '10px 16px', borderBottom: '1px solid #f0ebe3', color: '#142016' }}>
                    #{(order._id || '').slice(-6).toUpperCase()}
                  </td>
                  <td style={{ padding: '10px 16px', borderBottom: '1px solid #f0ebe3', color: '#142016' }}>
                    {order.user?.name || order.shippingAddress?.fullName || 'Guest'}
                  </td>
                  <td style={{ padding: '10px 16px', borderBottom: '1px solid #f0ebe3', fontWeight: 600, color: '#142016' }}>
                    EGP {order.totalPrice?.toFixed(2) || '0.00'}
                  </td>
                  <td style={{ padding: '10px 16px', borderBottom: '1px solid #f0ebe3' }}>
                    <StatusBadge status={order.status || 'pending'} />
                  </td>
                  <td style={{ padding: '10px 16px', borderBottom: '1px solid #f0ebe3', color: '#4d564a' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: '#4d564a', textAlign: 'center', padding: 20 }}>No orders yet</p>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;
