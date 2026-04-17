import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

const loadCart = () => {
  try {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(loadCart);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((product, quantity = 1, selectedSize = '') => {
    setItems((prev) => {
      const existing = prev.find(
        (item) => item._id === product._id && (item.selectedSize || '') === (selectedSize || '')
      );
      if (existing) {
        toast.success('Cart updated!');
        return prev.map((item) =>
          item._id === product._id && (item.selectedSize || '') === (selectedSize || '')
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      toast.success('Added to cart!');
      return [...prev, { ...product, quantity, selectedSize: selectedSize || '' }];
    });
    setIsDrawerOpen(true);
  }, []);

  const removeFromCart = useCallback((productId, selectedSize = '') => {
    setItems((prev) =>
      prev.filter(
        (item) => !(item._id === productId && (item.selectedSize || '') === (selectedSize || ''))
      )
    );
    toast.success('Removed from cart');
  }, []);

  const updateQuantity = useCallback((productId, selectedSize = '', quantity) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((item) =>
        item._id === productId && (item.selectedSize || '') === (selectedSize || '')
          ? { ...item, quantity }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const cartCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const cartTotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const price = item.salePrice || item.price;
        return sum + price * item.quantity;
      }, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        cartTotal,
        isDrawerOpen,
        setIsDrawerOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
