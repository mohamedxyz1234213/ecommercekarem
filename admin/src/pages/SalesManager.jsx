import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdSearch, MdLocalOffer, MdSave, MdSelectAll, MdDeselect } from 'react-icons/md';
import API from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { resolveMediaUrl } from '../utils/resolveMediaUrl';

const SalesManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [bulkSalePrice, setBulkSalePrice] = useState('');
  const [bulkSaleTape, setBulkSaleTape] = useState('');
  const [bulkDiscount, setBulkDiscount] = useState('');
  const [updating, setUpdating] = useState(false);

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

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelected(filtered.map((p) => p._id));
  };

  const deselectAll = () => {
    setSelected([]);
  };

  const toggleSale = async (product) => {
    try {
      await API.put(`/products/${product._id}`, {
        onSale: !product.onSale,
        salePrice: !product.onSale ? product.salePrice || Math.round(product.price * 0.8) : product.salePrice,
      });
      setProducts(products.map((p) =>
        p._id === product._id ? { ...p, onSale: !p.onSale } : p
      ));
      toast.success(`Sale ${!product.onSale ? 'enabled' : 'disabled'} for ${product.name}`);
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleBulkEnable = async () => {
    if (selected.length === 0) {
      toast.error('Select products first');
      return;
    }
    setUpdating(true);
    try {
      const updates = selected.map((id) => {
        const product = products.find((p) => p._id === id);
        const updateData = { onSale: true };
        if (bulkSaleTape) updateData.saleTape = bulkSaleTape;
        if (bulkSalePrice) {
          updateData.salePrice = Number(bulkSalePrice);
        } else if (bulkDiscount && product) {
          updateData.salePrice = Math.round(product.price * (1 - Number(bulkDiscount) / 100));
        }
        return API.put(`/products/${id}`, updateData);
      });
      await Promise.all(updates);
      toast.success(`Sale enabled for ${selected.length} products`);
      fetchProducts();
      setSelected([]);
    } catch {
      toast.error('Failed to update some products');
    } finally {
      setUpdating(false);
    }
  };

  const handleBulkDisable = async () => {
    if (selected.length === 0) {
      toast.error('Select products first');
      return;
    }
    setUpdating(true);
    try {
      const updates = selected.map((id) =>
        API.put(`/products/${id}`, { onSale: false })
      );
      await Promise.all(updates);
      toast.success(`Sale disabled for ${selected.length} products`);
      fetchProducts();
      setSelected([]);
    } catch {
      toast.error('Failed to update some products');
    } finally {
      setUpdating(false);
    }
  };

  const filtered = products.filter((p) =>
    !search || (p.name || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="page-title">Sales Manager</h1>

      {/* Bulk Actions */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16, fontSize: '1rem', color: '#142016' }}>
          <MdLocalOffer size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />
          Bulk Sale Actions
          {selected.length > 0 && (
            <span style={{ color: '#2D5016', fontSize: '0.85rem', marginLeft: 8 }}>
              ({selected.length} selected)
            </span>
          )}
        </h3>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
          <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: 150 }}>
            <label>Discount %</label>
            <input
              type="number"
              className="form-control"
              value={bulkDiscount}
              onChange={(e) => setBulkDiscount(e.target.value)}
              placeholder="e.g. 20"
              min="0"
              max="100"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: 150 }}>
            <label>Or Fixed Sale Price (EGP)</label>
            <input
              type="number"
              className="form-control"
              value={bulkSalePrice}
              onChange={(e) => setBulkSalePrice(e.target.value)}
              placeholder="e.g. 49.99"
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: 150 }}>
            <label>Sale Tape</label>
            <input
              className="form-control"
              value={bulkSaleTape}
              onChange={(e) => setBulkSaleTape(e.target.value)}
              placeholder="e.g. 20% OFF"
            />
          </div>
        </div>

        {bulkSaleTape && (
          <div style={{ marginBottom: 16 }}>
            <span style={{ fontSize: '0.8rem', color: '#4d564a', marginRight: 8 }}>Preview:</span>
            <span
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                background: '#e74c3c',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: 4,
                transform: 'rotate(-2deg)',
              }}
            >
              {bulkSaleTape}
            </span>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn btn-success" onClick={handleBulkEnable} disabled={updating}>
            <MdSave size={16} /> Enable Sale ({selected.length})
          </button>
          <button className="btn btn-danger" onClick={handleBulkDisable} disabled={updating}>
            Disable Sale ({selected.length})
          </button>
          <button className="btn btn-secondary" onClick={selectAll}>
            <MdSelectAll size={16} /> Select All
          </button>
          <button className="btn btn-secondary" onClick={deselectAll}>
            <MdDeselect size={16} /> Deselect All
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="search-bar">
          <MdSearch size={18} />
          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Products Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {filtered.map((product) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
            style={{
              padding: 16,
              cursor: 'pointer',
              border: selected.includes(product._id)
                ? '2px solid #2D5016'
                : '1px solid #e0d8cc',
              transition: 'all 0.2s',
            }}
            onClick={() => toggleSelect(product._id)}
          >
            <div style={{ display: 'flex', gap: 12 }}>
              <img
                src={resolveMediaUrl(product.images?.[0]) || 'https://via.placeholder.com/60'}
                alt={product.name}
                style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginBottom: 4,
                  color: '#142016',
                }}>
                  {product.name}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 700, color: '#2D5016' }}>EGP {product.price}</span>
                  {product.onSale && product.salePrice && (
                    <span style={{ color: '#e74c3c', fontWeight: 600, fontSize: '0.85rem' }}>
                      → EGP {product.salePrice}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={selected.includes(product._id)}
                  onChange={() => toggleSelect(product._id)}
                  onClick={(e) => e.stopPropagation()}
                  style={{ width: 18, height: 18, accentColor: '#2D5016' }}
                />
                {product.onSale && <StatusBadge status="on sale" />}
              </div>
            </div>
            {product.saleTape && product.onSale && (
              <div
                style={{
                  marginTop: 8,
                  display: 'inline-block',
                  padding: '2px 8px',
                  background: '#e74c3c',
                  color: 'white',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  borderRadius: 3,
                }}
              >
                {product.saleTape}
              </div>
            )}
            <div style={{ marginTop: 8 }}>
              <button
                className={`btn btn-sm ${product.onSale ? 'btn-danger' : 'btn-success'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSale(product);
                }}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {product.onSale ? 'Disable Sale' : 'Enable Sale'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <h3>No products found</h3>
        </div>
      )}
    </motion.div>
  );
};

export default SalesManager;
