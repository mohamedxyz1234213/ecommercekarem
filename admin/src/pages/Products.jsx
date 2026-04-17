import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdAdd, MdSearch, MdEdit, MdDelete, MdLocalOffer } from 'react-icons/md';
import API from '../api/axios';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { resolveMediaUrl } from '../utils/resolveMediaUrl';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [deleteModal, setDeleteModal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await API.get('/products?limit=1000');
      setProducts(data.products || data || []);
    } catch {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await API.delete(`/products/${deleteModal._id}`);
      toast.success('Product deleted');
      setProducts(products.filter((p) => p._id !== deleteModal._id));
    } catch {
      toast.error('Failed to delete product');
    } finally {
      setDeleteModal(null);
    }
  };

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !category || p.category === category;
    return matchSearch && matchCategory;
  });

  const columns = [
    {
      key: 'image',
      label: 'Image',
      sortable: false,
      render: (row) => (
        <img
          src={resolveMediaUrl(row.images?.[0]) || 'https://via.placeholder.com/50'}
          alt={row.name}
          style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }}
        />
      ),
    },
    { key: 'name', label: 'Name' },
    {
      key: 'price',
      label: 'Price',
      render: (row) => (
        <div>
          {row.onSale && row.salePrice ? (
            <>
              <span style={{ textDecoration: 'line-through', color: '#6b7280', fontSize: '0.8rem' }}>EGP {row.price}</span>
              <span style={{ color: '#e74c3c', fontWeight: 700, marginLeft: 6 }}>EGP {row.salePrice}</span>
            </>
          ) : (
            <span style={{ fontWeight: 600 }}>EGP {row.price}</span>
          )}
        </div>
      ),
    },
    {
      key: 'onSale',
      label: 'Sale',
      render: (row) => row.onSale ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <StatusBadge status="on sale" />
          {row.saleTape && <span style={{ fontSize: '0.7rem', color: '#f57f17' }}>{row.saleTape}</span>}
        </div>
      ) : (
        <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>—</span>
      ),
    },
    { key: 'category', label: 'Category' },
    {
      key: 'stock',
      label: 'Stock',
      render: (row) => (
        <span style={{ color: (row.stock || 0) < 10 ? '#e74c3c' : '#2D5016', fontWeight: 600 }}>
          {row.stock || 0}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (row) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={(e) => { e.stopPropagation(); navigate(`/products/edit/${row._id}`); }}
            title="Edit"
          >
            <MdEdit size={14} />
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={(e) => { e.stopPropagation(); setDeleteModal(row); }}
            title="Delete"
          >
            <MdDelete size={14} />
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex-between" style={{ marginBottom: 24 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Products</h1>
        <button className="btn btn-primary" onClick={() => navigate('/products/new')}>
          <MdAdd size={18} /> Add Product
        </button>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div className="search-bar">
            <MdSearch size={18} />
            <input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="form-control"
            style={{ width: 200 }}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card">
        <DataTable columns={columns} data={filtered} pageSize={10} emptyMessage="No products found" />
      </div>

      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete Product">
        <p style={{ marginBottom: 20 }}>
          Are you sure you want to delete <strong>{deleteModal?.name}</strong>? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={() => setDeleteModal(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default Products;
