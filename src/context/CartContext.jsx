import React, { useState, useEffect, useCallback } from 'react';
import CartService from '../services/cartService';
import { CartContext } from './CartContextInstance';

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  // On first load, always clear cart via API, then fetch cart, and only show user-added items
  useEffect(() => {
    const clearAndFetch = async () => {
      try {
        await CartService.clearCart();
      } catch {
        // ignore error
      }
      window.localStorage.setItem('user_cart_ids', JSON.stringify([]));
      setCartItems([]);
    };
    clearAndFetch();
  }, []);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await CartService.getCart();
      let items = res?.cart?.items || res?.items || [];
      const userCartIds = JSON.parse(window.localStorage.getItem('user_cart_ids') || '[]');
      setCartItems(items.filter(item => userCartIds.includes(item.id)));
    } catch (err) {
      setError(err.message || 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      const res = await CartService.addToCart(productId, quantity);
      const items = res?.cart?.items || res?.items || [];
      // Only keep the latest cart item for this productId
      let userCartIds = JSON.parse(window.localStorage.getItem('user_cart_ids') || '[]');
      // Remove any previous cart item for this productId
      const prevItems = items.filter(item => userCartIds.includes(item.id));
      const prevItemForProduct = prevItems.find(item => item.productId === productId);
      if (prevItemForProduct) {
        userCartIds = userCartIds.filter(id => id !== prevItemForProduct.id);
      }
      // Find the latest item for this productId (assume highest id or last in array)
      const newItems = items.filter(item => item.productId === productId);
      let latestItem = null;
      if (newItems.length > 0) {
        latestItem = newItems.reduce((a, b) => (a.id > b.id ? a : b));
        if (!userCartIds.includes(latestItem.id)) userCartIds.push(latestItem.id);
      }
      window.localStorage.setItem('user_cart_ids', JSON.stringify(userCartIds));
      setCartItems(items.filter(item => userCartIds.includes(item.id)));
    } catch (err) {
      setError(err.message || 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    setLoading(true);
    try {
      await CartService.removeFromCart(itemId);
      let userCartIds = JSON.parse(window.localStorage.getItem('user_cart_ids') || '[]');
      userCartIds = userCartIds.filter(id => id !== itemId);
      window.localStorage.setItem('user_cart_ids', JSON.stringify(userCartIds));
      const res = await CartService.getCart();
      const items = res?.cart?.items || res?.items || [];
      setCartItems(items.filter(item => userCartIds.includes(item.id)));
    } catch (err) {
      setError(err.message || 'Failed to remove from cart');
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, loading, error, addToCart, removeFromCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}
