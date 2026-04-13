import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdSearch, MdVisibility } from 'react-icons/md';
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
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/admin/all');
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
      (o.shippingAddress?.fullName || '').toLowerCase().includes(search.toLowerCase());
    const status = o.orderStatus || o.status || '';
    const matchStatus = !statusFilter || status.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

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
      render: (row) => row.user?.name || row.shippingAddress?.fullName || 'Guest',
    },
    {
      key: 'totalPrice',
      label: 'Total',
      render: (row) => <span style={{ fontWeight: 700 }}>${(row.totalPrice || 0).toFixed(2)}</span>,
    },
    {
      key: 'paymentMethod',
      label: 'Payment',
      render: (row) => <StatusBadge status={row.paymentMethod || 'N/A'} />,
    },
    {
      key: 'paymentStatus',
      label: 'Payment Status',
      render: (row) => <StatusBadge status={row.paymentStatus || (row.isPaid ? 'paid' : 'unpaid')} />,
    },
    {
      key: 'orderStatus',
      label: 'Order Status',
      render: (row) => <StatusBadge status={row.orderStatus || row.status || 'pending'} />,
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (row) => (
        <span style={{ color: '#888', fontSize: '0.85rem' }}>
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
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

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div className="search-bar">
            <MdSearch size={18} />
            <input
              placeholder="Search by ID or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="form-control"
            style={{ width: 200 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={filtered}
          pageSize={10}
          onRowClick={(row) => navigate(`/orders/${row._id}`)}
          emptyMessage="No orders found"
        />
      </div>
    </motion.div>
  );
};

export default Orders;
