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

const PLACEHOLDER = {
  _id: '1',
  name: 'Rose Élégante Eau de Parfum',
  brand: 'KARÉME',
  price: 1250,
  description: 'A captivating blend of Bulgarian rose, peony petals, and warm amber. This luxurious eau de parfum embodies timeless elegance with its delicate floral heart and a sophisticated base of sandalwood and white musk. Perfect for evening occasions and special moments.',
  images: [
    'https://placehold.co/600x700/F5F0E8/8B7355?text=Rose+Elegante',
    'https://placehold.co/600x700/F5F0E8/2D5016?text=Side+View',
    'https://placehold.co/600x700/F5F0E8/C4A265?text=Box',
  ],
  category: 'women',
  rating: 4.8,
  numReviews: 124,
  sizes: ['50ml', '100ml'],
  notes: { top: 'Bergamot, Pink Pepper', middle: 'Bulgarian Rose, Peony', base: 'Sandalwood, White Musk, Amber' },
  reviews: [
    { _id: 'r1', user: { name: 'Sarah M.' }, rating: 5, comment: 'Absolutely stunning fragrance! Lasts all day.', createdAt: '2024-01-15' },
    { _id: 'r2', user: { name: 'Nour A.' }, rating: 4, comment: 'Beautiful scent, very elegant. Perfect for special occasions.', createdAt: '2024-01-10' },
  ],
};

const RELATED = [
  { _id: '4', name: 'Jasmine Dreams', brand: 'KARÉME', price: 1100, images: ['https://placehold.co/400x500/F5F0E8/C4A265?text=Jasmine+Dreams'], rating: 4.7, numReviews: 203 },
  { _id: '3', name: 'Amber Noir', brand: 'KARÉME', price: 950, images: ['https://placehold.co/400x500/F5F0E8/1A1A1A?text=Amber+Noir'], rating: 4.5, numReviews: 67 },
  { _id: '7', name: 'Fleur de Nuit', brand: 'KARÉME', price: 1600, images: ['https://placehold.co/400x500/F5F0E8/8B7355?text=Fleur+de+Nuit'], rating: 4.4, numReviews: 78 },
];

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

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setSelectedImage(0);
      setQuantity(1);
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data.product || PLACEHOLDER);
        const relRes = await API.get(`/products/${id}/related`);
        setRelated(relRes.data.products?.length ? relRes.data.products : RELATED);
      } catch {
        setProduct({ ...PLACEHOLDER, _id: id });
        setRelated(RELATED);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div style={{ paddingTop: '120px' }}><LoadingSpinner /></div>;
  if (!product) return null;

  const { name, brand, price, salePrice, onSale, description, images, rating, numReviews, notes, reviews, sizes } = product;
  const discount = onSale && salePrice ? Math.round((1 - salePrice / price) * 100) : 0;

  const styles = {
    page: { paddingTop: '100px', minHeight: '100vh', backgroundColor: 'var(--light)' },
    container: { maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem 4rem' },
    back: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gray-500)', fontSize: '0.9rem', marginBottom: '2rem', cursor: 'pointer', textDecoration: 'none' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' },
    gallery: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    mainImage: { width: '100%', aspectRatio: '4/5', objectFit: 'cover', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--secondary)' },
    thumbRow: { display: 'flex', gap: '0.75rem' },
    thumb: (active) => ({
      width: '70px', height: '85px', objectFit: 'cover',
      borderRadius: 'var(--radius-sm)', cursor: 'pointer',
      border: active ? '2px solid var(--primary)' : '2px solid transparent',
      opacity: active ? 1 : 0.6, transition: 'all 0.3s',
    }),
    info: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    brand: { fontSize: '0.8rem', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--accent)' },
    name: { fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 500, lineHeight: 1.2 },
    priceRow: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
    price: { fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' },
    oldPrice: { fontSize: '1.1rem', color: 'var(--gray-400)', textDecoration: 'line-through' },
    discBadge: { backgroundColor: '#FEE2E2', color: '#DC2626', padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 },
    desc: { fontSize: '0.95rem', color: 'var(--gray-500)', lineHeight: 1.8 },
    notesSection: { marginTop: '0.5rem' },
    noteTitle: { fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text)', marginBottom: '0.5rem' },
    noteItem: { display: 'flex', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--gray-500)', marginBottom: '0.25rem' },
    noteLabel: { fontWeight: 600, color: 'var(--accent)', minWidth: '60px' },
    divider: { borderTop: '1px solid var(--gray-200)', margin: '0.5rem 0' },
    qtyRow: { display: 'flex', alignItems: 'center', gap: '1rem' },
    qtyControl: { display: 'flex', alignItems: 'center', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' },
    qtyBtn: { width: '40px', height: '40px', backgroundColor: 'var(--white)', border: 'none', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    qtyVal: { width: '50px', textAlign: 'center', fontWeight: 600, fontSize: '1rem', border: 'none', borderLeft: '1px solid var(--gray-200)', borderRight: '1px solid var(--gray-200)' },
    btnRow: { display: 'flex', gap: '1rem', marginTop: '0.5rem' },
    addBtn: {
      flex: 1, padding: '1rem 2rem', backgroundColor: 'var(--primary)', color: '#fff',
      border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '0.95rem', fontWeight: 600,
      letterSpacing: '1px', cursor: 'pointer', display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: '0.5rem',
    },
    wishBtn: {
      width: '48px', height: '48px', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-sm)',
      backgroundColor: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1.2rem', color: 'var(--gray-400)', cursor: 'pointer',
    },
    reviewsSection: { marginTop: '4rem' },
    reviewCard: { backgroundColor: 'var(--white)', borderRadius: 'var(--radius-md)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', marginBottom: '1rem' },
    reviewHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' },
    reviewer: { fontWeight: 600, fontSize: '0.95rem' },
    reviewDate: { fontSize: '0.8rem', color: 'var(--gray-400)' },
    reviewText: { fontSize: '0.9rem', color: 'var(--gray-500)', lineHeight: 1.7 },
    relatedSection: { marginTop: '4rem' },
    relatedGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' },
    sectionTitle: { fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 500, marginBottom: '1.5rem' },
  };

  return (
    <motion.div style={styles.page} variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div style={styles.container}>
        <Link to="/shop" style={styles.back}>
          <FiArrowLeft /> Back to Shop
        </Link>

        <div style={styles.grid} className="product-detail-grid">
          <AnimatedSection direction="left">
            <div style={styles.gallery}>
              <motion.img
                key={selectedImage}
                src={images?.[selectedImage] || 'https://placehold.co/600x700/F5F0E8/8B7355?text=Perfume'}
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
                      src={img}
                      alt={`${name} view ${i + 1}`}
                      style={styles.thumb(i === selectedImage)}
                      onClick={() => setSelectedImage(i)}
                    />
                  ))}
                </div>
              )}
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div style={styles.info}>
              {brand && <span style={styles.brand}>{brand}</span>}
              <h1 style={styles.name}>{name}</h1>
              <ReviewStars rating={rating || 0} count={numReviews} size={16} />

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

              <div style={styles.qtyRow}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Quantity:</span>
                <div style={styles.qtyControl}>
                  <button style={styles.qtyBtn} onClick={() => setQuantity(Math.max(1, quantity - 1))}><FiMinus /></button>
                  <span style={styles.qtyVal}>{quantity}</span>
                  <button style={styles.qtyBtn} onClick={() => setQuantity(quantity + 1)}><FiPlus /></button>
                </div>
              </div>

              <div style={styles.btnRow}>
                <motion.button
                  style={styles.addBtn}
                  whileHover={{ opacity: 0.9, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addToCart(product, quantity)}
                >
                  <FiShoppingBag /> Add to Bag
                </motion.button>
                <motion.button
                  style={styles.wishBtn}
                  whileHover={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                >
                  <FiHeart />
                </motion.button>
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
