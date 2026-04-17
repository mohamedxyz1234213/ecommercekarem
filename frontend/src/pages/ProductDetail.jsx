import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiHeart, FiMinus, FiPlus, FiArrowLeft } from 'react-icons/fi';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import ReviewStars from '../components/ReviewStars';
import ProductCard from '../components/ProductCard';
import AnimatedSection from '../components/AnimatedSection';
import LoadingSpinner from '../components/LoadingSpinner';
import { getApiOrigin } from '../utils/apiBase';

const FALLBACK_DETAIL_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22700%22%3E%3Crect width=%22100%25%22 height=%22100%25%22 fill=%22%23f5f0e8%22/%3E%3C/svg%3E';

const normalizeImageUrl = (src) => {
  if (!src) return FALLBACK_DETAIL_IMAGE;
  if (/^https?:\/\//i.test(src) || src.startsWith('data:image')) return src;
  const apiBase = getApiOrigin();
  return src.startsWith('/') ? `${apiBase}${src}` : `${apiBase}/${src}`;
};

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setSelectedImage(0);
      setQuantity(1);
      setSelectedSize('');
      try {
        const { data } = await API.get(`/products/${id}`);
        const fetchedProduct = data?.product || data || null;
        setProduct(fetchedProduct);

        if (fetchedProduct?.category) {
          const relRes = await API.get('/products', {
            params: { category: fetchedProduct.category, limit: 8 },
          });
          const relatedProducts = (relRes.data?.products || [])
            .filter((p) => p._id !== fetchedProduct._id)
            .slice(0, 4);
          setRelated(relatedProducts);
        } else {
          setRelated([]);
        }
      } catch {
        setProduct(null);
        setRelated([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div style={{ paddingTop: '120px' }}><LoadingSpinner /></div>;
  if (!product) {
    return (
      <div
        style={{
          paddingTop: '120px',
          minHeight: '50vh',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '1.05rem',
        }}
      >
        Product not found.
      </div>
    );
  }

  const { name, brand, price, salePrice, onSale, description, images, rating, numReviews, notes, reviews, sizes } = product;
  const discount = onSale && salePrice ? Math.round((1 - salePrice / price) * 100) : 0;
  const availableSizes =
    Array.isArray(product.sizeStocks) && product.sizeStocks.length > 0
      ? product.sizeStocks.filter((entry) => (entry.quantity || 0) > 0)
      : Array.isArray(sizes)
        ? sizes.map((size) => ({ size, quantity: null }))
        : [];

  const selectedSizeStock = availableSizes.find((entry) => entry.size === selectedSize)?.quantity ?? null;

  const styles = {
    page: {
      paddingTop: '100px',
      minHeight: '100vh',
      background: 'var(--bg-gradient)',
      color: 'var(--text)',
    },
    container: { maxWidth: '1200px', margin: '0 auto', padding: '1.75rem 1.25rem 4rem' },
    back: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#374151',
      fontSize: '0.875rem',
      fontWeight: 600,
      marginBottom: '1.75rem',
      cursor: 'pointer',
      textDecoration: 'none',
      letterSpacing: '0.02em',
    },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(2rem, 5vw, 3.5rem)', alignItems: 'start' },
    galleryCard: {
      background: '#ffffff',
      borderRadius: '20px',
      padding: '1rem',
      boxShadow: '0 8px 32px rgba(20, 32, 22, 0.08)',
      border: '1px solid rgba(20, 32, 22, 0.06)',
    },
    gallery: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    mainImage: {
      width: '100%',
      aspectRatio: '4/5',
      objectFit: 'cover',
      borderRadius: '14px',
      backgroundColor: '#f4f1ea',
    },
    thumbRow: { display: 'flex', gap: '0.625rem', flexWrap: 'wrap' },
    thumb: (active) => ({
      width: '72px',
      height: '88px',
      objectFit: 'cover',
      borderRadius: '10px',
      cursor: 'pointer',
      border: active ? '2px solid #014421' : '2px solid transparent',
      boxShadow: active ? '0 0 0 2px rgba(1, 68, 33, 0.2)' : 'none',
      opacity: active ? 1 : 0.72,
      transition: 'all 0.25s ease',
    }),
    infoCard: {
      background: '#ffffff',
      borderRadius: '20px',
      padding: 'clamp(1.5rem, 3vw, 2.25rem)',
      boxShadow: '0 8px 32px rgba(20, 32, 22, 0.08)',
      border: '1px solid rgba(20, 32, 22, 0.06)',
    },
    info: { display: 'flex', flexDirection: 'column', gap: '1.125rem' },
    brand: {
      fontSize: '0.75rem',
      fontWeight: 700,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: '#6b7280',
    },
    name: {
      fontFamily: 'var(--font-heading)',
      fontSize: 'clamp(1.75rem, 4.2vw, 2.375rem)',
      fontWeight: 500,
      lineHeight: 1.2,
      color: '#142016',
      margin: 0,
    },
    priceRow: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.65rem 1rem' },
    price: {
      fontSize: 'clamp(1.35rem, 3vw, 1.65rem)',
      fontWeight: 700,
      color: '#014421',
      letterSpacing: '-0.02em',
    },
    oldPrice: { fontSize: '1.05rem', color: '#9ca3af', textDecoration: 'line-through', fontWeight: 500 },
    discBadge: {
      backgroundColor: '#fef2f2',
      color: '#b91c1c',
      padding: '4px 12px',
      borderRadius: '999px',
      fontSize: '0.8125rem',
      fontWeight: 700,
    },
    desc: {
      fontSize: 'clamp(0.98rem, 1.8vw, 1.0625rem)',
      color: '#3d4a38',
      lineHeight: 1.75,
    },
    notesSection: { marginTop: '0.25rem' },
    noteTitle: {
      fontSize: '0.75rem',
      fontWeight: 700,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: '#142016',
      marginBottom: '0.65rem',
    },
    noteItem: { display: 'flex', gap: '0.5rem', fontSize: '0.9375rem', color: '#3d4a38', marginBottom: '0.35rem' },
    noteLabel: { fontWeight: 600, color: '#014421', minWidth: '72px' },
    divider: { borderTop: '1px solid #e5e7eb', margin: '0.35rem 0' },
    qtyRow: { display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' },
    fieldLabel: { fontSize: '0.8125rem', fontWeight: 700, color: '#142016', letterSpacing: '0.04em' },
    sizeRow: { display: 'flex', flexDirection: 'column', gap: '0.65rem' },
    sizeButtons: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
    sizeBtn: (active) => ({
      padding: '0.5rem 1rem',
      borderRadius: '10px',
      border: `1.5px solid ${active ? '#014421' : '#e5e7eb'}`,
      backgroundColor: active ? 'rgba(1, 68, 33, 0.08)' : '#fafaf8',
      color: active ? '#014421' : '#142016',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: '0.875rem',
      transition: 'border-color 0.2s, background 0.2s',
    }),
    qtyControl: {
      display: 'flex',
      alignItems: 'center',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      overflow: 'hidden',
      background: '#fff',
    },
    qtyBtn: {
      width: '44px',
      height: '44px',
      backgroundColor: '#f9faf8',
      border: 'none',
      fontSize: '1rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#142016',
    },
    qtyVal: {
      minWidth: '52px',
      textAlign: 'center',
      fontWeight: 700,
      fontSize: '1.0625rem',
      color: '#142016',
      border: 'none',
      borderLeft: '1px solid #e5e7eb',
      borderRight: '1px solid #e5e7eb',
      background: '#fff',
      padding: '0 8px',
    },
    btnRow: { display: 'flex', gap: '0.75rem', marginTop: '0.75rem' },
    addBtn: {
      flex: 1,
      padding: '1rem 1.5rem',
      backgroundColor: '#014421',
      color: '#fff',
      border: 'none',
      borderRadius: '14px',
      fontSize: '0.9375rem',
      fontWeight: 700,
      letterSpacing: '0.06em',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      boxShadow: '0 4px 20px rgba(1, 68, 33, 0.25)',
    },
    addBtnDisabled: { opacity: 0.45, cursor: 'not-allowed', boxShadow: 'none' },
    wishBtn: {
      width: '52px',
      height: '52px',
      border: '1px solid #e5e7eb',
      borderRadius: '14px',
      backgroundColor: '#fafaf8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.25rem',
      color: '#6b7280',
      cursor: 'pointer',
    },
    stockHint: { fontSize: '0.8125rem', color: '#6b7280' },
    reviewsSection: { marginTop: '3.5rem' },
    reviewCard: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '1.5rem 1.75rem',
      boxShadow: '0 4px 20px rgba(20, 32, 22, 0.06)',
      border: '1px solid rgba(20, 32, 22, 0.06)',
      marginBottom: '1rem',
    },
    reviewHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '1rem' },
    reviewer: { fontWeight: 700, fontSize: '1rem', color: '#142016' },
    reviewDate: { fontSize: '0.8125rem', color: '#6b7280', flexShrink: 0 },
    reviewText: { fontSize: '0.9375rem', color: '#3d4a38', lineHeight: 1.7 },
    relatedSection: { marginTop: '3.5rem' },
    relatedGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' },
    sectionTitle: {
      fontFamily: 'var(--font-heading)',
      fontSize: 'clamp(1.35rem, 3vw, 1.75rem)',
      fontWeight: 500,
      marginBottom: '1.35rem',
      color: '#142016',
    },
  };

  return (
    <motion.div style={styles.page} variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div style={styles.container}>
        <Link to="/shop" style={styles.back}>
          <FiArrowLeft size={18} strokeWidth={2.5} /> Back to Shop
        </Link>

        <div style={styles.grid} className="product-detail-grid">
          <AnimatedSection direction="left">
            <div style={styles.galleryCard}>
              <div style={styles.gallery}>
                <motion.img
                  key={selectedImage}
                  src={normalizeImageUrl(images?.[selectedImage])}
                  alt={name}
                  style={styles.mainImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                {images?.length > 1 && (
                  <div style={styles.thumbRow}>
                    {images.map((img, i) => (
                      <img
                        key={i}
                        src={normalizeImageUrl(img)}
                        alt={`${name} view ${i + 1}`}
                        style={styles.thumb(i === selectedImage)}
                        onClick={() => setSelectedImage(i)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div style={styles.infoCard}>
              <div style={styles.info}>
              {brand && <span style={styles.brand}>{brand}</span>}
              <h1 style={styles.name}>{name}</h1>
              <ReviewStars rating={rating || 0} count={numReviews} size={17} countColor="var(--muted-on-light)" />

              <div style={styles.priceRow}>
                <span style={styles.price}>EGP {(onSale && salePrice ? salePrice : price)?.toFixed(2)}</span>
                {onSale && salePrice && (
                  <>
                    <span style={styles.oldPrice}>EGP {price?.toFixed(2)}</span>
                    <span style={styles.discBadge}>-{discount}%</span>
                  </>
                )}
              </div>

              <div style={styles.divider} />

              <p style={styles.desc}>{description}</p>

              {notes && (
                <div style={styles.notesSection}>
                  <p style={styles.noteTitle}>Fragrance Notes</p>
                  {Object.entries(notes).map(([key, val]) => (
                    <div key={key} style={styles.noteItem}>
                      <span style={styles.noteLabel}>{key}:</span>
                      <span>{val}</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={styles.divider} />

              {availableSizes.length > 0 && (
                <div style={styles.sizeRow}>
                  <span style={styles.fieldLabel}>Size</span>
                  <div style={styles.sizeButtons}>
                    {availableSizes.map((entry) => (
                      <button
                        key={entry.size}
                        type="button"
                        style={styles.sizeBtn(selectedSize === entry.size)}
                        onClick={() => setSelectedSize(entry.size)}
                      >
                        {entry.size}
                      </button>
                    ))}
                  </div>
                  {selectedSize && selectedSizeStock !== null && (
                    <span style={styles.stockHint}>
                      {selectedSizeStock} in stock
                    </span>
                  )}
                </div>
              )}

              <div style={styles.qtyRow}>
                <span style={styles.fieldLabel}>Quantity</span>
                <div style={styles.qtyControl}>
                  <button style={styles.qtyBtn} onClick={() => setQuantity(Math.max(1, quantity - 1))}><FiMinus /></button>
                  <span style={styles.qtyVal}>{quantity}</span>
                  <button style={styles.qtyBtn} onClick={() => setQuantity(quantity + 1)}><FiPlus /></button>
                </div>
              </div>

              <div style={styles.btnRow}>
                <motion.button
                  style={{
                    ...styles.addBtn,
                    ...(availableSizes.length > 0 && !selectedSize ? styles.addBtnDisabled : {}),
                  }}
                  whileHover={availableSizes.length > 0 && !selectedSize ? {} : { scale: 1.01 }}
                  whileTap={availableSizes.length > 0 && !selectedSize ? {} : { scale: 0.99 }}
                  onClick={() => {
                    if (availableSizes.length > 0 && !selectedSize) {
                      return;
                    }
                    addToCart(product, quantity, selectedSize);
                  }}
                  disabled={availableSizes.length > 0 && !selectedSize}
                >
                  <FiShoppingBag /> {availableSizes.length > 0 && !selectedSize ? 'Select a size' : 'Add to bag'}
                </motion.button>
                <motion.button
                  style={styles.wishBtn}
                  whileHover={{ borderColor: '#014421', color: '#014421', backgroundColor: '#f0fdf4' }}
                  type="button"
                  aria-label="Wishlist"
                >
                  <FiHeart />
                </motion.button>
              </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Reviews */}
        {reviews?.length > 0 && (
          <div style={styles.reviewsSection}>
            <AnimatedSection>
              <h2 style={styles.sectionTitle}>Customer Reviews</h2>
              {reviews.map((review) => (
                <motion.div key={review._id} style={styles.reviewCard} whileHover={{ y: -2 }}>
                  <div style={styles.reviewHeader}>
                    <div>
                      <p style={styles.reviewer}>{review.user?.name || 'Anonymous'}</p>
                      <ReviewStars rating={review.rating} size={13} showCount={false} />
                    </div>
                    <span style={styles.reviewDate}>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p style={styles.reviewText}>{review.comment}</p>
                </motion.div>
              ))}
            </AnimatedSection>
          </div>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <div style={styles.relatedSection}>
            <AnimatedSection>
              <h2 style={styles.sectionTitle}>You May Also Like</h2>
              <div style={styles.relatedGrid}>
                {related.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </AnimatedSection>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .product-detail-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </motion.div>
  );
};

export default ProductDetail;
