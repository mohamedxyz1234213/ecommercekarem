import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdArrowBack, MdSave } from 'react-icons/md';
import API from '../api/axios';
import ImageUpload from '../components/ImageUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const CATEGORIES = ['Perfume', 'Cologne', 'Body Spray', 'Gift Set', 'Accessory', 'Unisex', 'Men', 'Women'];

const initialForm = {
  name: '',
  description: '',
  price: '',
  salePrice: '',
  onSale: false,
  saleTape: '',
  category: '',
  brand: '',
  stock: '',
  featured: false,
};

const ProductForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await API.get(`/products/${id}`);
      const p = data.product || data;
      setForm({
        name: p.name || '',
        description: p.description || '',
        price: p.price || '',
        salePrice: p.salePrice || '',
        onSale: p.onSale || false,
        saleTape: p.saleTape || '',
        category: p.category || '',
        brand: p.brand || '',
        stock: p.stock || '',
        featured: p.featured || false,
      });
      if (p.images) setImages(p.images);
    } catch {
      toast.error('Failed to fetch product');
      navigate('/products');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      toast.error('Name and price are required');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      // Separate new files from existing URLs
      images.forEach((img) => {
        if (img instanceof File) {
          formData.append('images', img);
        } else if (typeof img === 'string') {
          formData.append('existingImages', img);
        }
      });

      if (isEdit) {
        await API.put(`/products/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product updated!');
      } else {
        await API.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product created!');
      }
      navigate('/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <LoadingSpinner />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button className="btn btn-secondary" onClick={() => navigate('/products')}>
          <MdArrowBack size={18} />
        </button>
        <h1 className="page-title" style={{ marginBottom: 0 }}>
          {isEdit ? 'Edit Product' : 'Add Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          <div>
            <div className="card" style={{ marginBottom: 24 }}>
              <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Basic Information</h3>

              <div className="form-group">
                <label>Product Name</label>
                <input
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Chanel No. 5"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Product description..."
                  rows={4}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Brand</label>
                  <input
                    className="form-control"
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    placeholder="e.g. Chanel"
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select className="form-control" name="category" value={form.category} onChange={handleChange}>
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 24 }}>
              <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Pricing & Stock</h3>

              <div className="grid-3">
                <div className="form-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Sale Price ($)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="salePrice"
                    value={form.salePrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    disabled={!form.onSale}
                    style={{ opacity: form.onSale ? 1 : 0.5 }}
                  />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Images</h3>
              <ImageUpload images={images} onChange={setImages} maxImages={5} />
            </div>
          </div>

          <div>
            <div className="card" style={{ marginBottom: 24 }}>
              <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Sale Settings</h3>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>On Sale</label>
                <label className="toggle-switch">
                  <input type="checkbox" name="onSale" checked={form.onSale} onChange={handleChange} />
                  <span className="toggle-slider" />
                </label>
              </div>

              {form.onSale && (
                <div className="form-group">
                  <label>Sale Tape</label>
                  <input
                    className="form-control"
                    name="saleTape"
                    value={form.saleTape}
                    onChange={handleChange}
                    placeholder="e.g. 20% OFF"
                  />
                  {form.saleTape && (
                    <div
                      style={{
                        marginTop: 8,
                        display: 'inline-block',
                        padding: '4px 12px',
                        background: '#e74c3c',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        borderRadius: 4,
                        transform: 'rotate(-3deg)',
                      }}
                    >
                      {form.saleTape}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="card" style={{ marginBottom: 24 }}>
              <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Options</h3>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Featured Product</label>
                <label className="toggle-switch">
                  <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary"
              style={{ width: '100%', padding: 14, fontSize: '1rem', justifyContent: 'center' }}
            >
              <MdSave size={20} />
              {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </motion.button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default ProductForm;
