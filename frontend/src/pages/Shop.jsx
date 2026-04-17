import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import AnimatedSection from '../components/AnimatedSection';
import LoadingSpinner from '../components/LoadingSpinner';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.brand) params.append('brand', filters.brand);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.sort) params.append('sort', filters.sort);

        const { data } = await API.get(`/products?${params.toString()}`);
        setProducts(data.products || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  const filteredProducts = products.filter((p) => {
    if (filters.category && p.category !== filters.category) return false;
    if (filters.brand && p.brand !== filters.brand) return false;
    const price = p.salePrice || p.price;
    if (filters.minPrice && price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && price > Number(filters.maxPrice)) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.salePrice || a.price;
    const priceB = b.salePrice || b.price;
    switch (filters.sort) {
      case 'price-low': return priceA - priceB;
      case 'price-high': return priceB - priceA;
      case 'rating': return (b.rating || 0) - (a.rating || 0);
      default: return 0;
    }
  });

  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))];

  const styles = {
    page: { paddingTop: '100px', minHeight: '100vh', backgroundColor: 'transparent' },
    container: { maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' },
    header: { textAlign: 'center', marginBottom: '2.5rem', paddingTop: '2rem' },
    label: { fontSize: '0.8rem', fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' },
    title: {
      fontFamily: 'var(--font-heading)',
      fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
      fontWeight: 500,
      color: 'var(--text)',
    },
    topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
    count: { fontSize: '0.9rem', color: 'var(--gray-500)' },
    controls: { display: 'flex', gap: '1rem', alignItems: 'center' },
    filterBtn: {
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      padding: '0.6rem 1.25rem', border: '1px solid var(--gray-200)',
      borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--white)',
      fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text)',
    },
    select: {
      padding: '0.6rem 2rem 0.6rem 1rem', border: '1px solid var(--gray-200)',
      borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--white)',
      fontSize: '0.85rem', color: 'var(--text)', cursor: 'pointer',
      appearance: 'none', backgroundImage: 'none',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: '1.5rem',
      paddingBottom: '4rem',
    },
    filtersPanel: {
      backgroundColor: 'var(--white)',
      borderRadius: 'var(--radius-md)',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: 'var(--shadow-sm)',
    },
    filterGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1.5rem',
    },
    filterGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    filterLabel: { fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--gray-500)' },
    filterInput: {
      padding: '0.6rem 1rem', border: '1px solid var(--gray-200)',
      borderRadius: 'var(--radius-sm)', fontSize: '0.85rem',
    },
    clearBtn: {
      padding: '0.6rem 1.25rem', backgroundColor: 'var(--secondary)',
      border: 'none', borderRadius: 'var(--radius-sm)',
      fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text)',
    },
    noProducts: {
      gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0',
      color: 'var(--gray-400)', fontSize: '1.1rem',
      fontFamily: 'var(--font-heading)',
    },
  };

  return (
    <motion.div style={styles.page} variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div style={styles.container}>
        <AnimatedSection>
          <div style={styles.header}>
            <p style={styles.label}>Our Collection</p>
            <h1 style={styles.title}>Shop All Fragrances</h1>
          </div>
        </AnimatedSection>

        <div style={styles.topBar}>
          <p style={styles.count}>{sortedProducts.length} products</p>
          <div style={styles.controls}>
            <button style={styles.filterBtn} onClick={() => setFiltersOpen(!filtersOpen)}>
              {filtersOpen ? <FiX /> : <FiFilter />}
              Filters
            </button>
            <div style={{ position: 'relative' }}>
              <select
                style={styles.select}
                value={filters.sort}
                onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {filtersOpen && (
          <motion.div
            style={styles.filtersPanel}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div style={styles.filterGrid}>
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Category</label>
                <select
                  style={styles.filterInput}
                  value={filters.category}
                  onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
                >
                  <option value="">All Categories</option>
                  <option value="Women">Women</option>
                  <option value="Men">Men</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>

              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Brand</label>
                <select
                  style={styles.filterInput}
                  value={filters.brand}
                  onChange={(e) => setFilters((f) => ({ ...f, brand: e.target.value }))}
                >
                  <option value="">All Brands</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Min Price (EGP)</label>
                <input
                  type="number"
                  style={styles.filterInput}
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))}
                />
              </div>

              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Max Price (EGP)</label>
                <input
                  type="number"
                  style={styles.filterInput}
                  placeholder="10000"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
                />
              </div>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                style={styles.clearBtn}
                onClick={() => setFilters({ category: '', brand: '', minPrice: '', maxPrice: '', sort: 'newest' })}
              >
                Clear All
              </button>
            </div>
          </motion.div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div style={styles.grid}>
            {sortedProducts.length > 0 ? (
              sortedProducts.map((product, i) => (
                <AnimatedSection key={product._id} delay={Math.min(i * 0.05, 0.3)}>
                  <ProductCard product={product} />
                </AnimatedSection>
              ))
            ) : (
              <p style={styles.noProducts}>No products found matching your filters.</p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Shop;
