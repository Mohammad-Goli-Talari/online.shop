import React, { useState, useEffect, useCallback } from 'react';
import CartService from '../services/cartService';
import { CartContext } from './CartContextInstance';

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const filterValidCartItems = (items) => {
    if (!Array.isArray(items) || items.length === 0) return [];
    return items.filter(item => item && item.id != null && item.productId != null);
  };

  const saveCartToStorage = (items) => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (err) {
      console.warn('Failed to save cart to localStorage:', err);
    }
  };

  const loadCartFromStorage = () => {
    try {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.warn('Failed to load cart from localStorage:', err);
      return [];
    }
  };

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await CartService.getCart();
      let items = res?.cart?.items || res?.items || [];
      const validItems = filterValidCartItems(items);
      setCartItems(validItems);
      saveCartToStorage(validItems);
    } catch (err) {
      setError(err.message || 'Failed to fetch cart');
      console.error('Fetch cart error:', err);
      const storedItems = loadCartFromStorage();
      setCartItems(storedItems);
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    const storedItems = loadCartFromStorage();
    setCartItems(storedItems);
    
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    setError(null);
    
    const originalCartItems = [...cartItems];
    setCartItems(prev => {
      const existing = prev.find(it => it && it.productId === productId);
      if (existing) {
        const updatedItems = prev.map(it => it && it.productId === productId ? { ...it, quantity: (it.quantity || 1) + quantity } : it);
        saveCartToStorage(updatedItems);
        return updatedItems;
      }
      const tempItem = {
        id: `temp-${productId}-${Date.now()}`,
        productId,
        quantity,
        unitPrice: 0,
        totalPrice: 0,
      };
      const newItems = [ ...(prev || []), tempItem ];
      saveCartToStorage(newItems);
      return newItems;
    });

    setLoading(true);
    try {
      await CartService.addToCart(productId, quantity);
      const res = await CartService.getCart();
      const items = res?.cart?.items || res?.items || [];
      const validItems = filterValidCartItems(items);
      setCartItems(validItems);
      saveCartToStorage(validItems);
    } catch (err) {
      setCartItems(originalCartItems);
      saveCartToStorage(originalCartItems);
      setError(err.message || 'Failed to add to cart');
      console.error('Add to cart error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity <= 0) return removeFromCart(cartItemId);

    setCartItems(prev => {
      const updatedItems = prev.map(it => {
        if (!it || it.id !== cartItemId) return it;
        const unitPrice = it.unitPrice ?? it.product?.price ?? it.price ?? 0;
        return {
          ...it,
          quantity,
          totalPrice: unitPrice * quantity
        };
      });
      saveCartToStorage(updatedItems);
      return updatedItems;
    });

    setLoading(true);
    try {
      await CartService.updateCartItem(cartItemId, quantity);
      const res = await CartService.getCart();
      const items = res?.cart?.items || res?.items || [];
      const validItems = filterValidCartItems(items);
      setCartItems(validItems);
      saveCartToStorage(validItems);
    } catch (err) {
      try {
        const res = await CartService.getCart();
        const revertItems = res?.cart?.items || res?.items || [];
        const validRevertItems = filterValidCartItems(revertItems);
        setCartItems(validRevertItems);
        saveCartToStorage(validRevertItems);
      } catch (fetchErr) {
        console.error('Failed to revert cart after update error:', fetchErr);
      }
      setError(err.message || 'Failed to update quantity');
      console.error('Update quantity error:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    const prevItems = cartItems;
    const updatedItems = cartItems.filter(it => it && it.id !== cartItemId);
    setCartItems(updatedItems);
    saveCartToStorage(updatedItems);

    setLoading(true);
    try {
      await CartService.removeFromCart(cartItemId);
      const res = await CartService.getCart();
      const items = res?.cart?.items || res?.items || [];
      const validItems = filterValidCartItems(items);
      setCartItems(validItems);
      saveCartToStorage(validItems);
    } catch (err) {
      setCartItems(prevItems);
      saveCartToStorage(prevItems);
      setError(err.message || 'Failed to remove from cart');
      console.error('Remove from cart error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    const prevItems = cartItems;
    setCartItems([]);
    saveCartToStorage([]);

    setLoading(true);
    try {
      await CartService.clearCart();
      setCartItems([]);
      saveCartToStorage([]);
    } catch (err) {
      setCartItems(prevItems);
      saveCartToStorage(prevItems);
      setError(err.message || 'Failed to clear cart');
      console.error('Clear cart error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        error,
        isInitialized,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
