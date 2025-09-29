// src/context/CartContext.jsx
import React, { useState, useEffect, useCallback } from 'react';
import CartService from '../services/cartService';
import { isUsingMocks } from '../config/api.js';
import { CartContext } from './CartContextInstance';

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Do not show mock-generated cart until the user interacts with the cart.
  const [userCartInitialized, setUserCartInitialized] = useState(false);
  const markUserCartInitialized = () => setUserCartInitialized(true);

  // Always filter out mock/random items (no id or productId)
  const filterValidCartItems = (items) => {
    if (!Array.isArray(items) || items.length === 0) return [];
    return items.filter(item => item && item.id != null && item.productId != null);
  };

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await CartService.getCart();
      let items = res?.cart?.items || res?.items || [];
      if (!userCartInitialized && isUsingMocks()) {
        // Hide mock/random cart until the user interacts
        setCartItems([]);
      } else {
        setCartItems(filterValidCartItems(items));
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch cart');
      console.error('Fetch cart error:', err);
    } finally {
      setLoading(false);
    }
  }, [userCartInitialized]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    // Mark that user has interacted so fetchCart will surface server cart
    markUserCartInitialized();

    // Optimistically update UI: if product exists increment, else add temp item
    setCartItems(prev => {
      const existing = prev.find(it => it && it.productId === productId);
      if (existing) {
        return prev.map(it => it && it.productId === productId ? { ...it, quantity: (it.quantity || 1) + quantity } : it);
      }
      const tempItem = {
        id: `temp-${productId}-${Date.now()}`,
        productId,
        quantity,
        unitPrice: 0,
        totalPrice: 0,
      };
      return [ ...(prev || []), tempItem ];
    });

    setLoading(true);
    try {
      await CartService.addToCart(productId, quantity);
      // re-sync authoritative cart
      const res = await CartService.getCart();
      const items = res?.cart?.items || res?.items || [];
      setCartItems(filterValidCartItems(items));
      // no product-detail special tracking anymore; keep server cart as authoritative
    } catch (err) {
      // revert optimistic change by removing temp entries for this product
      setCartItems(prev => prev.filter(it => it && it.productId !== productId));
      setError(err.message || 'Failed to add to cart');
      console.error('Add to cart error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Remove items that were added from product detail (called by Home on entry)
    // Note: removed ProductDetail-specific removal logic to keep cart persistent across pages

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity <= 0) return removeFromCart(cartItemId);

    // Optimistic local update so UI responds immediately
    setCartItems(prev => prev.map(it => {
      if (!it || it.id !== cartItemId) return it;
      const unitPrice = it.unitPrice ?? it.product?.price ?? it.price ?? 0;
      return {
        ...it,
        quantity,
        totalPrice: unitPrice * quantity
      };
    }));

    setLoading(true);
    try {
      await CartService.updateCartItem(cartItemId, quantity);
      if (!isUsingMocks()) {
        // Re-sync with server only when not using mocks
        const res = await CartService.getCart();
        const items = res?.cart?.items || res?.items || [];
        setCartItems(filterValidCartItems(items));
      }
    } catch (err) {
      // Revert by fetching authoritative state
      try {
        const res = await CartService.getCart();
        const items = res?.cart?.items || res?.items || [];
        setCartItems(filterValidCartItems(items));
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
    // Optimistically remove locally
    const prevItems = cartItems;
    setCartItems(prev => prev.filter(it => it && it.id !== cartItemId));

    setLoading(true);
    try {
      await CartService.removeFromCart(cartItemId);
      if (!isUsingMocks()) {
        // re-sync only when not using mocks
        const res = await CartService.getCart();
        const items = res?.cart?.items || res?.items || [];
        setCartItems(filterValidCartItems(items));
      }
    } catch (err) {
      // Revert to previous state on failure
      setCartItems(prevItems);
      setError(err.message || 'Failed to remove from cart');
      console.error('Remove from cart error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      await CartService.clearCart();
      // After clear, always set to []
      setCartItems([]);
    } catch (err) {
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
