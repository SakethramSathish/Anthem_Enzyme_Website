import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();

  const [cartItems, setCartItems] = useState(() => {
    if (!user) return [];
    try {
      const savedCart = localStorage.getItem(`cartItems_${user.uid}`);
      const parsed = savedCart ? JSON.parse(savedCart) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    if (user) {
      try {
        const savedCart = localStorage.getItem(`cartItems_${user.uid}`);
        const parsed = savedCart ? JSON.parse(savedCart) : [];
        setCartItems(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`cartItems_${user.uid}`, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = (item) => {
    setCartItems(prevItems => {
      // Check if item with same id and unit size already exists
      const existingItemIndex = prevItems.findIndex(
        i => i.id === item.id && i.unitId === item.unitId
      );

      if (existingItemIndex > -1) {
        // Increment quantity of existing item
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += item.quantity;
        return newItems;
      } else {
        // Add new item
        return [...prevItems, item];
      }
    });
  };

  const removeFromCart = (id, unitId) => {
    setCartItems(prevItems => 
      prevItems.filter(item => !(item.id === id && item.unitId === unitId))
    );
  };
  
  const updateQuantity = (id, unitId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === id && item.unitId === unitId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
