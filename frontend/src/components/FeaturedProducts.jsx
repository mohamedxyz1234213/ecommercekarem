import { useState, useEffect, useMemo, useSyncExternalStore } from 'react';
import Slider from 'react-slick';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import API from '../api/axios';
import ProductCard from './ProductCard';
import AnimatedSection from './AnimatedSection';
import LoadingSpinner from './LoadingSpinner';

const arrowBaseStyle = {
  width: 48,
  height: 48,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  border: '1px solid rgba(1, 68, 33, 0.18)',
  color: '#014421',
  cursor: 'pointer',
  zIndex: 2,
  transition: 'background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
};
const arrowBorder = 'rgba(1, 68, 33, 0.18)';
const arrowBorderHover = 'rgba(1, 68, 33, 0.35)';

function CarouselPrev({ className, style, onClick }) {
  return (
    <button
      type="button"
      className={className}
      style={{ ...style, ...arrowBaseStyle }}
      onClick={onClick}
      aria-label="Previous fragrances"
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(1, 68, 33, 0.1)';
        e.currentTarget.style.borderColor = arrowBorderHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = arrowBaseStyle.backgroundColor;
        e.currentTarget.style.borderColor = arrowBorder;
      }}
    >
      <FiChevronLeft size={24} strokeWidth={2.25} aria-hidden />
    </button>
  );
}

const MOBILE_CAROUSEL_MQ = '(max-width: 768px)';

function subscribeMobileViewport(cb) {
  if (typeof window === 'undefined') return () => {};
  const mq = window.matchMedia(MOBILE_CAROUSEL_MQ);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}

function getMobileViewportSnapshot() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(MOBILE_CAROUSEL_MQ).matches;
}

function getMobileViewportServerSnapshot() {
  return false;
}

function useFeaturedMobileLayout() {
  return useSyncExternalStore(
    subscribeMobileViewport,
    getMobileViewportSnapshot,
    getMobileViewportServerSnapshot,
  );
}

function CarouselNext({ className, style, onClick }) {
  return (
    <button
      type="button"
      className={className}
      style={{ ...style, ...arrowBaseStyle }}
      onClick={onClick}
      aria-label="Next fragrances"
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(1, 68, 33, 0.1)';
        e.currentTarget.style.borderColor = arrowBorderHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = arrowBaseStyle.backgroundColor;
        e.currentTarget.style.borderColor = arrowBorder;
      }}
    >
      <FiChevronRight size={24} strokeWidth={2.25} aria-hidden />
    </button>
  );
}

const FeaturedProducts = () => {
  const SliderComponent = Slider?.default || Slider;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobileLayout = useFeaturedMobileLayout();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await API.get('/products', {
          params: { featured: true, limit: 12 },
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

  const n = products.length;

  const settings = useMemo(() => {
    const col4 = Math.min(4, Math.max(1, n));
    const col3 = Math.min(3, Math.max(1, n));
    const col2 = Math.min(2, Math.max(1, n));
    const multi = n > 1;

    return {
      className: 'featured-fragrances-carousel',
      dots: true,
      infinite: multi,
      speed: 480,
      cssEase: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      slidesToShow: col4,
      slidesToScroll: 1,
      swipeToSlide: true,
      touchThreshold: 8,
      autoplay: multi,
      autoplaySpeed: 4500,
      pauseOnHover: true,
      pauseOnFocus: true,
      arrows: multi,
      prevArrow: <CarouselPrev />,
      nextArrow: <CarouselNext />,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: col3,
            slidesToScroll: 1,
            infinite: multi,
            arrows: multi,
          },
        },
        {
          breakpoint: 900,
          settings: {
            slidesToShow: col2,
            slidesToScroll: 1,
            infinite: multi,
            arrows: multi,
          },
        },
        {
          breakpoint: 640,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            centerMode: multi,
            centerPadding: multi ? '20px' : '0',
            infinite: multi,
            arrows: false,
            dots: true,
          },
        },
      ],
    };
  }, [n]);

  const styles = {
    section: {
      paddingTop: '6rem',
      background: 'linear-gradient(180deg, #e4e2db 0%, #dcd8cf 100%)',
    },
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 1.5rem',
    },
    carouselWrap: {
      position: 'relative',
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingLeft: 'clamp(0px, 2vw, 12px)',
      paddingRight: 'clamp(0px, 2vw, 12px)',
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
      color: 'var(--text-muted)',
      marginBottom: '0.75rem',
    },
    title: {
      fontFamily: 'var(--font-heading)',
      fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
      fontWeight: 500,
      color: 'var(--text)',
    },
    slideItem: {
      padding: '0 12px',
      height: '100%',
    },
    slideInner: {
      height: '100%',
    },
    empty: {
      textAlign: 'center',
      color: 'var(--text-muted)',
    },
  };

  if (loading) return <LoadingSpinner />;

  return (
    <section style={styles.section} className="featured-fragrances-section">
      <div style={styles.container}>
        <AnimatedSection>
          <div style={styles.header}>
            <p style={styles.label}>Curated Selection</p>
            <h2 style={styles.title}>Featured Fragrances</h2>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          {products.length > 0 ? (
            isMobileLayout ? (
              <div className="featured-mobile-carousel" role="region" aria-label="Featured fragrances">
                {products.map((product) => (
                  <div key={product._id} className="featured-mobile-carousel__card">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.carouselWrap}>
                <SliderComponent {...settings}>
                  {products.map((product) => (
                    <div key={product._id}>
                      <div style={styles.slideItem}>
                        <div style={styles.slideInner}>
                          <ProductCard product={product} />
                        </div>
                      </div>
                    </div>
                  ))}
                </SliderComponent>
              </div>
            )
          ) : (
            <p style={styles.empty}>No featured products available.</p>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FeaturedProducts;
