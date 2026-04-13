import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import ReviewStars from './ReviewStars';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { _id, name, price, salePrice, images, rating, numReviews, brand, onSale } = product;
  const displayImage = images?.[0] || 'https://placehold.co/400x500/F5F0E8/8B7355?text=Perfume';
  const discount = onSale && salePrice ? Math.round((1 - salePrice / price) * 100) : 0;

  const styles = {
    card: {
      position: 'relative',
      backgroundColor: 'var(--white)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
      cursor: 'pointer',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    imageWrapper: {
      position: 'relative',
      overflow: 'hidden',
      aspectRatio: '3/4',
      backgroundColor: 'var(--secondary)',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s ease',
    },
    saleTape: {
      position: 'absolute',
      top: '16px',
      left: '-30px',
      backgroundColor: '#DC2626',
      color: '#fff',
      fontSize: '0.7rem',
      fontWeight: 700,
      padding: '4px 40px',
      transform: 'rotate(-45deg)',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      zIndex: 2,
    },
    addBtn: {
      position: 'absolute',
      bottom: '12px',
      right: '12px',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: 'var(--primary)',
      color: '#fff',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '1rem',
      zIndex: 2,
    },
    info: {
      padding: '1rem 1.25rem 1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.35rem',
      flex: 1,
    },
    brand: {
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      color: 'var(--accent)',
    },
    name: {
      fontFamily: 'var(--font-heading)',
      fontSize: '1.05rem',
      fontWeight: 500,
      color: 'var(--text)',
      lineHeight: 1.3,
    },
    priceRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginTop: '0.25rem',
    },
    price: {
      fontSize: '1.1rem',
      fontWeight: 700,
      color: 'var(--primary)',
    },
    originalPrice: {
      fontSize: '0.9rem',
      color: 'var(--gray-400)',
      textDecoration: 'line-through',
    },
    discountBadge: {
      fontSize: '0.7rem',
      fontWeight: 700,
      color: '#DC2626',
      backgroundColor: '#FEE2E2',
      padding: '2px 6px',
      borderRadius: '4px',
    },
  };

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}
      transition={{ duration: 0.3 }}
      style={styles.card}
    >
      <Link to={`/product/${_id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={styles.imageWrapper}>
          {onSale && discount > 0 && <div style={styles.saleTape}>SALE {discount}%</div>}
          <motion.img
            src={displayImage}
            alt={name}
            style={styles.image}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div style={styles.info}>
          {brand && <span style={styles.brand}>{brand}</span>}
          <h3 style={styles.name}>{name}</h3>
          {rating > 0 && <ReviewStars rating={rating} count={numReviews} size={13} />}
          <div style={styles.priceRow}>
            <span style={styles.price}>
              EGP {(onSale && salePrice ? salePrice : price)?.toFixed(2)}
            </span>
            {onSale && salePrice && (
              <>
                <span style={styles.originalPrice}>EGP {price?.toFixed(2)}</span>
                <span style={styles.discountBadge}>-{discount}%</span>
              </>
            )}
          </div>
        </div>
      </Link>
      <motion.button
        style={styles.addBtn}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          addToCart(product);
        }}
        aria-label="Add to cart"
      >
        <FiShoppingBag />
      </motion.button>
    </motion.div>
  );
};

export default ProductCard;
