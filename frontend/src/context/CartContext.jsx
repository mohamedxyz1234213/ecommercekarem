import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

/**
 * Returns the maximum purchasable stock for an item or product given a selected size.
 * Works with both cart items (which have selectedSize set) and raw product objects.
 */
export const getItemMaxStock = (item, selectedSize) => {
  const size = (selectedSize !== undefined && selectedSize !== null) ? selectedSize : (item.selectedSize || '');
  if (Array.isArray(item.sizeStocks) && item.sizeStocks.length > 0 && size) {
    const entry = item.sizeStocks.find((e) => e.size === size);
    return entry ? (entry.quantity || 0) : 0;
  }
  return item.stock || 0;
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
      const maxStock = getItemMaxStock(product, selectedSize);
      const existing = prev.find(
        (item) => item._id === product._id && (item.selectedSize || '') === (selectedSize || '')
      );
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, maxStock);
        if (newQty === existing.quantity) {
          toast.error(`Only ${maxStock} in stock!`);
          return prev;
        }
        toast.success('Cart updated!');
        return prev.map((item) =>
          item._id === product._id && (item.selectedSize || '') === (selectedSize || '')
            ? { ...item, quantity: newQty }
            : item
        );
      }
      if (maxStock === 0) {
        toast.error('This item is out of stock');
        return prev;
      }
      const clampedQty = Math.min(quantity, maxStock);
      toast.success('Added to cart!');
      return [...prev, { ...product, quantity: clampedQty, selectedSize: selectedSize || '' }];
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
      prev.map((item) => {
        if (item._id === productId && (item.selectedSize || '') === (selectedSize || '')) {
          const maxStock = getItemMaxStock(item, selectedSize);
          const capped = maxStock > 0 ? Math.min(quantity, maxStock) : quantity;
          return { ...item, quantity: capped };
        }
        return item;
      })
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
