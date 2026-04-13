import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import API from '../api/axios';
import ProductCard from './ProductCard';
import AnimatedSection from './AnimatedSection';
import LoadingSpinner from './LoadingSpinner';

const PLACEHOLDER_PRODUCTS = [
  { _id: '1', name: 'Rose Élégante', brand: 'KARÉME', price: 1250, images: ['https://placehold.co/400x500/F5F0E8/8B7355?text=Rose+Elegante'], rating: 4.8, numReviews: 124 },
  { _id: '2', name: 'Oud Mystique', brand: 'KARÉME', price: 1800, salePrice: 1440, onSale: true, images: ['https://placehold.co/400x500/F5F0E8/2D5016?text=Oud+Mystique'], rating: 4.9, numReviews: 89 },
  { _id: '3', name: 'Amber Noir', brand: 'KARÉME', price: 950, images: ['https://placehold.co/400x500/F5F0E8/1A1A1A?text=Amber+Noir'], rating: 4.5, numReviews: 67 },
  { _id: '4', name: 'Jasmine Dreams', brand: 'KARÉME', price: 1100, images: ['https://placehold.co/400x500/F5F0E8/C4A265?text=Jasmine+Dreams'], rating: 4.7, numReviews: 203 },
  { _id: '5', name: 'Velvet Santal', brand: 'KARÉME', price: 2200, salePrice: 1760, onSale: true, images: ['https://placehold.co/400x500/F5F0E8/8B7355?text=Velvet+Santal'], rating: 5.0, numReviews: 56 },
  { _id: '6', name: 'Musk Impérial', brand: 'KARÉME', price: 1450, images: ['https://placehold.co/400x500/F5F0E8/2D5016?text=Musk+Imperial'], rating: 4.6, numReviews: 145 },
];

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await API.get('/products/featured');
        setProducts(data.products?.length ? data.products : PLACEHOLDER_PRODUCTS);
      } catch {
        setProducts(PLACEHOLDER_PRODUCTS);
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
      backgroundColor: 'var(--light)',
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
      color: 'var(--gold)',
      marginBottom: '0.75rem',
    },
    title: {
      fontFamily: 'var(--font-heading)',
      fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
      fontWeight: 500,
      color: 'var(--text)',
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
          <Slider {...settings}>
            {products.map((product) => (
              <div key={product._id} style={styles.slideItem}>
                <div style={{ padding: '0 8px' }}>
                  <ProductCard product={product} />
                </div>
              </div>
            ))}
          </Slider>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FeaturedProducts;
