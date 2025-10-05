import { apiClient, handleApiResponse } from '../utils/apiClient.js';

export class CategoryService {
  static async getCategories() {
    try {
      const response = await apiClient.get('/categories');
      return handleApiResponse(response);
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  }

  static async getCategoryById(id) {
    try {
      const response = await apiClient.get(`/categories/${id}`);
      return handleApiResponse(response);
    } catch (error) {
      console.error('Get category by ID error:', error);
      throw error;
    }
  }

  static async getProductsByCategory(id, options = {}) {
    try {
      const params = {
        page: options.page || 1,
        limit: options.limit || 10,
        sortBy: options.sortBy,
        sortOrder: options.sortOrder
      };

      const response = await apiClient.get(`/categories/${id}/products`, { params });
      return handleApiResponse(response);
    } catch (error) {
      console.error('Get products by category error:', error);
      throw error;
    }
  }

  static async createCategory(categoryData) {
    try {
      const response = await apiClient.post('/categories', categoryData);
      return handleApiResponse(response);
    } catch (error) {
      console.error('Create category error:', error);
      throw error;
    }
  }

  static async updateCategory(id, categoryData) {
    try {
      const response = await apiClient.put(`/categories/${id}`, categoryData);
      return handleApiResponse(response);
    } catch (error) {
      console.error('Update category error:', error);
      throw error;
    }
  }

  static async deleteCategory(id) {
    try {
      const response = await apiClient.delete(`/categories/${id}`);
      return handleApiResponse(response);
    } catch (error) {
      console.error('Delete category error:', error);
      throw error;
    }
  }
}

export default CategoryService;
