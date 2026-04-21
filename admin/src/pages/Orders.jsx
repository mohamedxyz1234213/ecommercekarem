import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdSearch, MdVisibility, MdFilterList } from 'react-icons/md';
import API from '../api/axios';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders', { params: { limit: 100 } });
      setOrders(data.orders || data || []);
    } catch {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      !search ||
      (o._id || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.user?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.user?.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.email || '').toLowerCase().includes(search.toLowerCase());
    const orderStatus = o.status || '';
    const matchStatus = !statusFilter || orderStatus.toLowerCase() === statusFilter.toLowerCase();
    const matchPaymentStatus = !paymentStatusFilter || (o.paymentStatus || '').toLowerCase() === paymentStatusFilter.toLowerCase();
    const matchPaymentMethod = !paymentMethodFilter || (o.paymentMethod || '').toLowerCase() === paymentMethodFilter.toLowerCase();
    return matchSearch && matchStatus && matchPaymentStatus && matchPaymentMethod;
  });

  // Summary stats
  const pendingPayments = orders.filter((o) => o.paymentStatus === 'pending' && o.paymentMethod === 'instapay').length;
  const processingOrders = orders.filter((o) => o.status === 'processing').length;
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'approved')
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  const columns = [
    {
      key: '_id',
      label: 'Order ID',
      render: (row) => (
        <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#2D5016', fontWeight: 600 }}>
          #{(row._id || '').slice(-6).toUpperCase()}
        </span>
      ),
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.user?.name || 'Guest'}</div>
          <div style={{ fontSize: '0.75rem', color: '#4d564a' }}>{row.user?.email || row.email || ''}</div>
        </div>
      ),
    },
    {
      key: 'items',
      label: 'Items',
      render: (row) => (
        <span style={{ fontSize: '0.85rem' }}>
          {(row.items || []).length} item{(row.items || []).length !== 1 ? 's' : ''}
        </span>
      ),
    },
    {
      key: 'totalPrice',
      label: 'Total',
      render: (row) => <span style={{ fontWeight: 700 }}>EGP {(row.totalPrice || 0).toFixed(2)}</span>,
    },
    {
      key: 'paymentMethod',
      label: 'Payment',
      render: (row) => <StatusBadge status={row.paymentMethod || 'N/A'} />,
    },
    {
      key: 'paymentStatus',
      label: 'Payment Status',
      render: (row) => <StatusBadge status={row.paymentStatus || 'pending'} />,
    },
    {
      key: 'status',
      label: 'Order Status',
      render: (row) => <StatusBadge status={row.status || 'pending'} />,
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (row) => (
        <div>
          <div style={{ fontSize: '0.85rem' }}>{new Date(row.createdAt).toLocaleDateString()}</div>
          <div style={{ fontSize: '0.7rem', color: '#4d564a' }}>{new Date(row.createdAt).toLocaleTimeString()}</div>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (row) => (
        <button
          className="btn btn-secondary btn-sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/orders/${row._id}`);
          }}
        >
          <MdVisibility size={14} /> View
        </button>
      ),
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="page-title">Orders</h1>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ padding: '16px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2D5016' }}>{orders.length}</div>
          <div style={{ fontSize: '0.8rem', color: '#4d564a' }}>Total Orders</div>
        </div>
        <div className="card" style={{ padding: '16px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#e67e22' }}>{pendingPayments}</div>
          <div style={{ fontSize: '0.8rem', color: '#4d564a' }}>Pending InstaPay</div>
        </div>
        <div className="card" style={{ padding: '16px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3498db' }}>{processingOrders}</div>
          <div style={{ fontSize: '0.8rem', color: '#4d564a' }}>Processing</div>
        </div>
        <div className="card" style={{ padding: '16px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#27ae60' }}>EGP {totalRevenue.toFixed(0)}</div>
          <div style={{ fontSize: '0.8rem', color: '#4d564a' }}>Revenue</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <MdFilterList size={18} style={{ color: '#2D5016' }} />
          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#142016' }}>Filters</span>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div className="search-bar" style={{ flex: '1 1 250px' }}>
            <MdSearch size={18} />
            <input
              placeholder="Search by ID, customer, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="form-control"
            style={{ width: 180 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <select
            className="form-control"
            style={{ width: 180 }}
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
          >
            <option value="">All Payment Status</option>
            {['pending', 'approved', 'rejected'].map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <select
            className="form-control"
            style={{ width: 180 }}
            value={paymentMethodFilter}
            onChange={(e) => setPaymentMethodFilter(e.target.value)}
          >
            <option value="">All Methods</option>
            <option value="instapay">InstaPay</option>
            <option value="cod">Cash on Delivery</option>
          </select>
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={filtered}
          pageSize={15}
          onRowClick={(row) => navigate(`/orders/${row._id}`)}
          emptyMessage="No orders found"
        />
      </div>
    </motion.div>
  );
};

export default Orders;
