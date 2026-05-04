import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiHeart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ReviewStars from './ReviewStars';
import { getApiOrigin } from '../utils/apiBase';

const FALLBACK_PRODUCT_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22500%22%3E%3Crect width=%22100%25%22 height=%22100%25%22 fill=%22%23f0ede6%22/%3E%3C/svg%3E';

const normalizeImageUrl = (src) => {
  if (!src) return FALLBACK_PRODUCT_IMAGE;
  if (/^https?:\/\//i.test(src) || src.startsWith('data:image')) return src;
  const apiBase = getApiOrigin();
  return src.startsWith('/') ? `${apiBase}${src}` : `${apiBase}/${src}`;
};

/** Light-surface card with explicit contrast (avoids theme --white = green tint) */
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { _id, name, price, salePrice, images, rating, numReviews, brand, onSale, stock } = product;
  const displayImage = normalizeImageUrl(images?.[0]);
  const discount = onSale && salePrice ? Math.round((1 - salePrice / price) * 100) : 0;
  const isOutOfStock = (stock || 0) === 0;
  const isLastPiece = (stock || 0) === 1;
  const wished = isWishlisted(_id);

  const styles = {
    card: {
      position: 'relative',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(20, 32, 22, 0.07)',
      border: '1px solid rgba(20, 32, 22, 0.06)',
      cursor: 'pointer',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    imageWrapper: {
      position: 'relative',
      overflow: 'hidden',
      aspectRatio: '4/5',
      backgroundColor: '#f4f1ea',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
    saleTape: {
      position: 'absolute',
      top: '14px',
      left: '-28px',
      background: 'linear-gradient(90deg, #b91c1c, #dc2626)',
      color: '#fff',
      fontSize: '0.65rem',
      fontWeight: 700,
      padding: '5px 36px',
      transform: 'rotate(-45deg)',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      zIndex: 2,
      boxShadow: '0 2px 8px rgba(185, 28, 28, 0.35)',
    },
    addBtn: {
      position: 'absolute',
      bottom: '12px',
      right: '12px',
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      backgroundColor: isOutOfStock ? '#9ca3af' : '#014421',
      color: '#fff',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: isOutOfStock ? 'not-allowed' : 'pointer',
      fontSize: '1.05rem',
      zIndex: 4,
      boxShadow: isOutOfStock ? 'none' : '0 4px 14px rgba(1, 68, 33, 0.35)',
      opacity: isOutOfStock ? 0.6 : 1,
    },
    wishBtn: {
      position: 'absolute',
      top: '14px',
      right: '14px',
      width: '38px',
      height: '38px',
      borderRadius: '50%',
      border: '1px solid rgba(20, 32, 22, 0.18)',
      backgroundColor: wished ? '#014421' : 'rgba(255, 255, 255, 0.9)',
      color: wished ? '#fff' : '#4b5563',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      zIndex: 3,
      boxShadow: '0 4px 12px rgba(20, 32, 22, 0.12)',
    },
    info: {
      padding: '0.9rem 1.1rem 1.1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.35rem',
      flex: 1,
    },
    brand: {
      fontSize: '0.6875rem',
      fontWeight: 700,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--muted-on-light)',
    },
    name: {
      fontFamily: 'var(--font-heading)',
      fontSize: 'clamp(0.98rem, 2.4vw, 1.125rem)',
      fontWeight: 500,
      color: '#142016',
      lineHeight: 1.35,
      margin: 0,
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    priceRow: {
      display: 'flex',
      alignItems: 'baseline',
      flexWrap: 'wrap',
      gap: '0.4rem 0.6rem',
      marginTop: '0.35rem',
    },
    price: {
      fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
      fontWeight: 700,
      color: '#014421',
      letterSpacing: '-0.02em',
    },
    originalPrice: {
      fontSize: '0.875rem',
      color: '#9ca3af',
      textDecoration: 'line-through',
      fontWeight: 500,
    },
    discountBadge: {
      fontSize: '0.6875rem',
      fontWeight: 700,
      color: '#b91c1c',
      backgroundColor: '#fef2f2',
      padding: '3px 8px',
      borderRadius: '6px',
      letterSpacing: '0.02em',
    },
  };

  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(20, 32, 22, 0.12)' }}
      transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={styles.card}
    >
      <Link to={`/product/${_id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={styles.imageWrapper}>
          <motion.button
            type="button"
            style={styles.wishBtn}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FiHeart fill={wished ? 'currentColor' : 'none'} />
          </motion.button>
          {onSale && discount > 0 && <div style={styles.saleTape}>Sale {discount}%</div>}
          {isLastPiece && (
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: '#dc2626',
              color: '#fff',
              fontSize: '0.6rem',
              fontWeight: 700,
              padding: '4px 9px',
              borderRadius: '6px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              zIndex: 2,
              boxShadow: '0 2px 8px rgba(220, 38, 38, 0.4)',
            }}>
              Last Piece!
            </div>
          )}
          {isOutOfStock && (
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(255,255,255,0.65)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
            }}>
              <span style={{
                backgroundColor: '#6b7280',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '6px 14px',
                borderRadius: '8px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>Out of Stock</span>
            </div>
          )}
          <motion.img
            src={displayImage}
            alt={name}
            style={styles.image}
            loading="lazy"
            width={400}
            height={500}
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
          {/* Cart button inside image wrapper — keeps it away from the sale/price text */}
          <motion.button
            type="button"
            style={styles.addBtn}
            whileHover={isOutOfStock ? {} : { scale: 1.08 }}
            whileTap={isOutOfStock ? {} : { scale: 0.94 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isOutOfStock) addToCart(product);
            }}
            aria-label={isOutOfStock ? 'Out of stock' : 'Add to cart'}
            disabled={isOutOfStock}
          >
            <FiShoppingBag />
          </motion.button>
        </div>
        <div style={styles.info}>
          {brand && <span style={styles.brand}>{brand}</span>}
          <h3 style={styles.name}>{name}</h3>
          {rating > 0 && (
            <div style={{ marginTop: '0.15rem' }}>
              <ReviewStars rating={rating} count={numReviews} size={14} countColor="var(--muted-on-light)" />
            </div>
          )}
          <div style={styles.priceRow}>
            <span style={styles.price}>
              EGP {(onSale && salePrice ? salePrice : price)?.toFixed(2)}
            </span>
            {onSale && salePrice && (
              <>
                <span style={styles.originalPrice}>EGP {price?.toFixed(2)}</span>
                <span style={styles.discountBadge}>−{discount}%</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
