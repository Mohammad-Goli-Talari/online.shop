/**
 * Products API Service
 * Handles all product-related API calls
 */

import { apiClient, handleApiResponse } from '../utils/apiClient.js';

export class ProductService {
  // Get all products with filters and pagination
  static async getProducts(filters = {}) {
    try {
      const params = {
        page: filters.page || 1,
        limit: filters.limit || 10,
        search: filters.search || '',
        categoryId: filters.categoryId,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        inStock: filters.inStock,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      };

      // Remove undefined values
      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === '') {
          delete params[key];
        }
      });

      const response = await apiClient.get('/products', { params });
      return handleApiResponse(response);
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  }

  // Get product by ID
  static async getProductById(id) {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return handleApiResponse(response);
    } catch (error) {
      console.error('Get product by ID error:', error);
      throw error;
    }
  }

  // Search products
  static async searchProducts(query, options = {}) {
    try {
      const params = {
        q: query,
        page: options.page || 1,
        limit: options.limit || 10,
        ...options.filters
      };

      const response = await apiClient.get('/products/search', { params });
      return handleApiResponse(response);
    } catch (error) {
      console.error('Search products error:', error);
      throw error;
    }
  }

  // Get featured products
  static async getFeaturedProducts(limit = 8) {
    try {
      const response = await apiClient.get('/products/featured', {
        params: { limit }
      });
      return handleApiResponse(response);
    } catch (error) {
      console.error('Get featured products error:', error);
      throw error;
    }
  }

  // Admin: Create product
  static async createProduct(productData) {
    try {
      const response = await apiClient.post('/products', productData);
      return handleApiResponse(response);
    } catch (error) {
      console.error('Create product error:', error);
      throw error;
    }
  }

  // Admin: Update product
  static async updateProduct(id, productData) {
    try {
      const response = await apiClient.put(`/products/${id}`, productData);
      return handleApiResponse(response);
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  }

  // Admin: Delete product
  static async deleteProduct(id) {
    try {
      const response = await apiClient.delete(`/products/${id}`);
      return handleApiResponse(response);
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    }
  }

  // Admin: Upload product images
  static async uploadProductImages(id, images) {
    try {
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append(`image${index}`, image);
      });

      const response = await apiClient.post(`/products/${id}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return handleApiResponse(response);
    } catch (error) {
      console.error('Upload product images error:', error);
      throw error;
    }
  }
}

export default ProductService;
