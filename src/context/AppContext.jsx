import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const addToCart = useCallback((book) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === book.id);
      if (existing) {
        return prev.map(item =>
          item.id === book.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...book, qty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateQty = useCallback((id, delta) => {
    setCart(prev => {
      const item = prev.find(i => i.id === id);
      if (!item) return prev;
      if (item.qty + delta <= 0) return prev.filter(i => i.id !== id);
      return prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i);
    });
  }, []);

  const clearCart = useCallback(() => setCart([]), []);
  const login  = useCallback((user) => setCurrentUser(user), []);
  const logout = useCallback(() => setCurrentUser(null), []);

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const isInCart  = useCallback((id) => cart.some(i => i.id === id), [cart]);

  return (
    <AppContext.Provider value={{
      cart, addToCart, removeFromCart, updateQty, clearCart,
      currentUser, login, logout,
      toast, showToast,
      cartCount, isInCart,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}