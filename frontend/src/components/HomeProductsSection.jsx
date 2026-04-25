import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api/axios';
import ProductCard from './ProductCard';
import AnimatedSection from './AnimatedSection';
import LoadingSpinner from './LoadingSpinner';

const HomeProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get('/products', { params: { limit: 8 } });
        const list = Array.isArray(data?.products) ? data.products : [];
        setProducts(list.slice(0, 4));
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section style={{ padding: '0 0 5rem', backgroundColor: 'transparent' }}>
      {/* Separation header */}
      <AnimatedSection>
        <div style={{
          textAlign: 'center',
          padding: '5rem 1.5rem 3.5rem',
          position: 'relative',
        }}>
          {/* Decorative line left */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            pointerEvents: 'none',
          }}>
            <div style={{ height: '1px', flex: 1, maxWidth: '120px', background: 'linear-gradient(to right, transparent, rgba(1,68,33,0.2))' }} />
            <span style={{ fontSize: '0.6rem', color: 'rgba(1,68,33,0.4)', letterSpacing: '0.25em' }}>✦</span>
            <div style={{ height: '1px', flex: 1, maxWidth: '120px', background: 'linear-gradient(to left, transparent, rgba(1,68,33,0.2))' }} />
          </div>

          <p style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            marginBottom: '0.85rem',
          }}>
            Our Collection
          </p>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontWeight: 400,
            color: 'var(--text)',
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
          }}>
            Discover Your<br />
            <em style={{ fontStyle: 'italic', color: 'var(--primary)' }}>Signature Scent</em>
          </h2>
          <p style={{
            marginTop: '1rem',
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            maxWidth: '380px',
            margin: '1rem auto 0',
            lineHeight: 1.7,
          }}>
            Handpicked fragrances for every mood, occasion, and personality.
          </p>
        </div>
      </AnimatedSection>

      {/* Products grid */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
        {loading ? (
          <LoadingSpinner />
        ) : products.length > 0 ? (
          <AnimatedSection delay={0.15}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'clamp(0.75rem, 2vw, 1.5rem)',
            }}>
              {products.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.42, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        ) : null}

        {/* Show More button */}
        <AnimatedSection delay={0.3}>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{ display: 'inline-block' }}
            >
              <Link
                to="/shop"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.9rem 2.5rem',
                  backgroundColor: '#014421',
                  color: '#f2ebe3',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  borderRadius: '50px',
                  boxShadow: '0 6px 24px rgba(1, 68, 33, 0.28)',
                  transition: 'box-shadow 0.25s ease',
                }}
              >
                Show More
                <span style={{ fontSize: '1rem', lineHeight: 1 }}>→</span>
              </Link>
            </motion.div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default HomeProductsSection;
