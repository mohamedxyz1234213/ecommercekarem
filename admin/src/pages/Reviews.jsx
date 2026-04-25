import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdSearch, MdDelete, MdStar } from 'react-icons/md';
import API from '../api/axios';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const StarRating = ({ rating }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <MdStar
        key={star}
        size={16}
        style={{ color: star <= rating ? '#C4A265' : '#d1d5db' }}
      />
    ))}
    <span style={{ marginLeft: 4, fontSize: '0.85rem', color: '#4d564a' }}>{rating}/5</span>
  </div>
);

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data } = await API.get('/admin/reviews');
      setReviews(data || []);
    } catch {
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await API.delete(`/admin/reviews/${deleteModal._id}`);
      toast.success('Review deleted');
      setReviews(reviews.filter((r) => r._id !== deleteModal._id));
    } catch {
      toast.error('Failed to delete review');
    } finally {
      setDeleteModal(null);
    }
  };

  const filtered = reviews.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (r.user?.name || '').toLowerCase().includes(q) ||
      (r.user?.email || '').toLowerCase().includes(q) ||
      (r.product?.name || '').toLowerCase().includes(q) ||
      (r.comment || '').toLowerCase().includes(q)
    );
  });

  const columns = [
    {
      key: 'user',
      label: 'User',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.user?.name || 'Unknown'}</div>
          <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{row.user?.email || ''}</div>
        </div>
      ),
    },
    {
      key: 'product',
      label: 'Product',
      render: (row) => (
        <span style={{ fontWeight: 500 }}>{row.product?.name || 'Deleted product'}</span>
      ),
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (row) => <StarRating rating={row.rating} />,
    },
    {
      key: 'comment',
      label: 'Comment',
      render: (row) => (
        <span
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            maxWidth: 300,
            fontSize: '0.875rem',
            color: '#374151',
          }}
          title={row.comment}
        >
          {row.comment}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (row) => (
        <span style={{ color: '#4d564a', fontSize: '0.85rem' }}>
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
          className="btn btn-danger btn-sm"
          onClick={(e) => { e.stopPropagation(); setDeleteModal(row); }}
          title="Delete"
        >
          <MdDelete size={14} />
        </button>
      ),
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="page-title">Reviews</h1>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="search-bar">
          <MdSearch size={18} />
          <input
            placeholder="Search by user, product, or comment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={filtered}
          pageSize={10}
          emptyMessage="No reviews found"
        />
      </div>

      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete Review">
        <p style={{ marginBottom: 20 }}>
          Are you sure you want to delete the review by{' '}
          <strong>{deleteModal?.user?.name || 'this user'}</strong> for{' '}
          <strong>{deleteModal?.product?.name || 'this product'}</strong>? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={() => setDeleteModal(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default Reviews;
