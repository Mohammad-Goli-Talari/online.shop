import { apiClient, handleApiResponse } from '../utils/apiClient.js';

export class ProductService {
  static async getProducts(filters = {}, options = {}) {
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

      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === '') {
          delete params[key];
        }
      });

      const config = { params };
      if (options.signal) {
        config.signal = options.signal;
      }

      const response = await apiClient.get('/products', config);
      return handleApiResponse(response);
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  }

  static async getProductById(id) {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return handleApiResponse(response);
    } catch (error) {
      console.error('Get product by ID error:', error);
      throw error;
    }
  }

  static async searchProducts(params = {}, options = {}) {
    try {
      const searchParams = {
        q: params.search || '',
        page: params.page || 1,
        limit: params.limit || 10,
        categoryId: params.categoryId,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        inStock: params.inStock,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder
      };

      Object.keys(searchParams).forEach(key => {
        if (searchParams[key] === undefined || searchParams[key] === '') {
          delete searchParams[key];
        }
      });

      const config = { params: searchParams };
      if (options.signal) {
        config.signal = options.signal;
      }

      const response = await apiClient.get('/products/search', config);
      return handleApiResponse(response);
    } catch (error) {
      console.error('Search products error:', error);
      throw error;
    }
  }

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

  static async createProduct(productData) {
    try {
      const response = await apiClient.post('/products', productData);
      return handleApiResponse(response);
    } catch (error) {
      console.error('Create product error:', error);
      throw error;
    }
  }

  static async updateProduct(id, productData) {
    try {
      const response = await apiClient.put(`/products/${id}`, productData);
      return handleApiResponse(response);
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  }

  static async deleteProduct(id) {
    try {
      const response = await apiClient.delete(`/products/${id}`);
      return handleApiResponse(response);
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    }
  }

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
