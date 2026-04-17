import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdArrowBack, MdSave } from 'react-icons/md';
import API from '../api/axios';
import ImageUpload from '../components/ImageUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const CATEGORIES = ['Perfume', 'Cologne', 'Body Spray', 'Gift Set', 'Accessory', 'Unisex', 'Men', 'Women'];
const SIZE_OPTIONS = ['50ml', '75ml', '100ml'];

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
  sizeStocks: [],
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
        sizeStocks: Array.isArray(p.sizeStocks)
          ? p.sizeStocks.filter((entry) => SIZE_OPTIONS.includes(entry.size))
          : [],
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

  const toggleSize = (size) => {
    setForm((prev) => {
      const exists = prev.sizeStocks.some((entry) => entry.size === size);
      const nextSizeStocks = exists
        ? prev.sizeStocks.filter((entry) => entry.size !== size)
        : [...prev.sizeStocks, { size, quantity: 0 }];

      const computedStock = nextSizeStocks.reduce(
        (sum, entry) => sum + (Number(entry.quantity) || 0),
        0
      );

      return {
        ...prev,
        sizeStocks: nextSizeStocks,
        stock: computedStock,
      };
    });
  };

  const updateSizeQuantity = (size, quantity) => {
    setForm((prev) => {
      const nextSizeStocks = prev.sizeStocks.map((entry) =>
        entry.size === size ? { ...entry, quantity: Math.max(0, Number(quantity) || 0) } : entry
      );
      const computedStock = nextSizeStocks.reduce(
        (sum, entry) => sum + (Number(entry.quantity) || 0),
        0
      );
      return {
        ...prev,
        sizeStocks: nextSizeStocks,
        stock: computedStock,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nativeFormData = new FormData(e.currentTarget);
    const submitted = {
      name: String(nativeFormData.get('name') ?? form.name ?? '').trim(),
      description: String(nativeFormData.get('description') ?? form.description ?? '').trim(),
      brand: String(nativeFormData.get('brand') ?? form.brand ?? '').trim(),
      category: String(nativeFormData.get('category') ?? form.category ?? '').trim(),
      price: String(nativeFormData.get('price') ?? form.price ?? '').trim(),
      salePrice: String(nativeFormData.get('salePrice') ?? form.salePrice ?? '').trim(),
    };

    if (!submitted.name || !submitted.price || !submitted.description || !submitted.brand || !submitted.category) {
      toast.error('Name, description, brand, category, and price are required');
      return;
    }
    if (!CATEGORIES.includes(submitted.category)) {
      toast.error('Category must be Men, Women, or Unisex');
      return;
    }
    if (form.sizeStocks.length === 0) {
      toast.error('Please select at least one size');
      return;
    }

    setLoading(true);
    try {
      const existingImageUrls = images.filter((img) => typeof img === 'string');
      const newImageFiles = images.filter((img) => img instanceof File);

      let uploadedImageUrls = [];
      if (newImageFiles.length > 0) {
        const uploadData = new FormData();
        newImageFiles.forEach((file) => uploadData.append('images', file));
        const { data } = await API.post('/upload/multiple', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        uploadedImageUrls = Array.isArray(data) ? data.map((item) => item.url).filter(Boolean) : [];
      }

      const payload = {
        ...form,
        name: submitted.name,
        description: submitted.description,
        brand: submitted.brand,
        category: submitted.category,
        price: Number(submitted.price) || 0,
        salePrice: submitted.salePrice === '' ? null : Number(submitted.salePrice),
        stock: Number(form.stock) || 0,
        onSale: Boolean(form.onSale),
        featured: Boolean(form.featured),
        sizeStocks: form.sizeStocks.map((entry) => ({
          size: entry.size,
          quantity: Number(entry.quantity) || 0,
        })),
        images: [...existingImageUrls, ...uploadedImageUrls],
      };

      if (isEdit) {
        await API.put(`/products/${id}`, payload);
        toast.success('Product updated!');
      } else {
        await API.post('/products', payload);
        toast.success('Product created!');
      }
      navigate('/products');
    } catch (err) {
      const errorPayload = err.response?.data;
      const validationErrors = errorPayload?.errors;
      const validationMessage = Array.isArray(validationErrors)
        ? validationErrors.map((item) => item.msg).filter(Boolean).join(' | ')
        : null;
      toast.error(validationMessage || errorPayload?.message || 'Failed to save product');
      console.error('Product save failed:', errorPayload || err.message);
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
                    onChange={() => {}}
                    placeholder="0"
                    min="0"
                    readOnly
                  />
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Sizes & Quantity</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                  {SIZE_OPTIONS.map((size) => {
                    const active = form.sizeStocks.some((entry) => entry.size === size);
                    return (
                      <button
                        key={size}
                        type="button"
                        className={active ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                        onClick={() => toggleSize(size)}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>

                {form.sizeStocks.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                    {form.sizeStocks.map((entry) => (
                      <div key={entry.size} className="form-group" style={{ marginBottom: 0 }}>
                        <label>{entry.size} quantity</label>
                        <input
                          type="number"
                          className="form-control"
                          min="0"
                          value={entry.quantity}
                          onChange={(e) => updateSizeQuantity(entry.size, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                )}
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
