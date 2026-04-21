import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import API from '../api/axios';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      return;
    }

    setLoadingWishlist(true);
    try {
      const { data } = await API.get('/auth/wishlist');
      setWishlistItems(Array.isArray(data?.wishlist) ? data.wishlist : []);
    } catch {
      setWishlistItems([]);
    } finally {
      setLoadingWishlist(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isWishlisted = useCallback(
    (productId) => wishlistItems.some((item) => item?._id === productId),
    [wishlistItems]
  );

  const addToWishlist = useCallback(
    async (product) => {
      if (!isAuthenticated) {
        toast.error('Please sign in to use wishlist');
        return false;
      }
      if (!product?._id) return false;

      try {
        await API.post(`/auth/wishlist/${product._id}`);
        setWishlistItems((prev) =>
          prev.some((item) => item?._id === product._id) ? prev : [product, ...prev]
        );
        toast.success('Added to wishlist');
        return true;
      } catch {
        toast.error('Failed to add to wishlist');
        return false;
      }
    },
    [isAuthenticated]
  );

  const removeFromWishlist = useCallback(
    async (productId, options = {}) => {
      if (!isAuthenticated || !productId) return false;
      try {
        await API.delete(`/auth/wishlist/${productId}`);
        setWishlistItems((prev) => prev.filter((item) => item?._id !== productId));
        if (!options.silent) toast.success('Removed from wishlist');
        return true;
      } catch {
        toast.error('Failed to remove from wishlist');
        return false;
      }
    },
    [isAuthenticated]
  );

  const toggleWishlist = useCallback(
    async (product) => {
      if (!product?._id) return false;
      if (isWishlisted(product._id)) {
        return removeFromWishlist(product._id, { silent: true });
      }
      return addToWishlist(product);
    },
    [addToWishlist, isWishlisted, removeFromWishlist]
  );

  const value = useMemo(
    () => ({
      wishlistItems,
      wishlistCount: wishlistItems.length,
      loadingWishlist,
      isWishlisted,
      fetchWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
    }),
    [
      wishlistItems,
      loadingWishlist,
      isWishlisted,
      fetchWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
    ]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
