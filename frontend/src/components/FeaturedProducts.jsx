import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import API from '../api/axios';
import ProductCard from './ProductCard';
import AnimatedSection from './AnimatedSection';
import LoadingSpinner from './LoadingSpinner';

const FeaturedProducts = () => {
  const SliderComponent = Slider?.default || Slider;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await API.get('/products', {
          params: { featured: true, limit: 8 },
        });
        const safeProducts = Array.isArray(data?.products) ? data.products : [];
        setProducts(safeProducts);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 900, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1, centerMode: true, centerPadding: '30px' } },
    ],
  };

  const styles = {
    section: {
      padding: '6rem 0',
      backgroundColor: '#3a1010',
    },
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 1.5rem',
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem',
    },
    label: {
      fontSize: '0.8rem',
      fontWeight: 600,
      letterSpacing: '4px',
      textTransform: 'uppercase',
      color: 'rgba(242,235,227,0.75)',
      marginBottom: '0.75rem',
    },
    title: {
      fontFamily: 'var(--font-heading)',
      fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
      fontWeight: 500,
      color: '#f2ebe3',
    },
    slideItem: {
      padding: '0 10px',
    },
  };

  if (loading) return <LoadingSpinner />;

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <AnimatedSection>
          <div style={styles.header}>
            <p style={styles.label}>Curated Selection</p>
            <h2 style={styles.title}>Featured Fragrances</h2>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          {products.length > 0 ? (
            <SliderComponent {...settings}>
              {products.map((product) => (
                <div key={product._id} style={styles.slideItem}>
                  <div style={{ padding: '0 8px' }}>
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
            </SliderComponent>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--gray-500)' }}>No featured products available.</p>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FeaturedProducts;
