// src/services/cartService.js
/**
 * Cart API Service
 * Handles all cart-related API calls
 */

import { apiClient, handleApiResponse } from '../utils/apiClient.js';

export class CartService {
  // Get current cart
  static async getCart() {
    try {
      const response = await apiClient.get('/cart');
      return handleApiResponse(response);
    } catch (error) {
      console.error('Get cart error:', error);
      throw error;
    }
  }

  // Add item to cart
  static async addToCart(productId, quantity = 1) {
    try {
      const response = await apiClient.post('/cart/items', {
        productId,
        quantity
      });
      return handleApiResponse(response);
    } catch (error) {
      console.error('Add to cart error:', error);
      throw error;
    }
  }

  // Update cart item quantity
  static async updateCartItem(itemId, quantity) {
    try {
      const response = await apiClient.put(`/cart/items/${itemId}`, {
        quantity
      });
      return handleApiResponse(response);
    } catch (error) {
      console.error('Update cart item error:', error);
      throw error;
    }
  }

  // Remove item from cart
  static async removeFromCart(itemId) {
    try {
      const response = await apiClient.delete(`/cart/items/${itemId}`);
      return handleApiResponse(response);
    } catch (error) {
      console.error('Remove from cart error:', error);
      throw error;
    }
  }

  // Clear entire cart
  static async clearCart() {
    try {
      const response = await apiClient.delete('/cart');
      return handleApiResponse(response);
    } catch (error) {
      console.error('Clear cart error:', error);
      throw error;
    }
  }

  // Merge guest cart with user cart (after login)
  static async mergeCart(guestCartData) {
    try {
      const response = await apiClient.post('/cart/merge', guestCartData);
      return handleApiResponse(response);
    } catch (error) {
      console.error('Merge cart error:', error);
      throw error;
    }
  }
}

export default CartService;
