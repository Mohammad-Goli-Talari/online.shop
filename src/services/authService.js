// src/services/authService.js
/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

import { apiClient, handleApiResponse } from '../utils/apiClient.js';

export class AuthService {
  // Login user
  static async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password
      });
      
      const data = handleApiResponse(response);
      
      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('refresh_token', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Register new user
  static async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', userData);
      const data = handleApiResponse(response);
      
      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('refresh_token', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Get current user profile
  static async getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/me');
      return handleApiResponse(response);
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  // Logout user
  static async logout() {
    try {
      await apiClient.post('/auth/logout');
      
      // Clear stored data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local data even if API call fails
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      throw error;
    }
  }

  // Refresh authentication token
  static async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post('/auth/refresh', {
        refreshToken
      });
      
      const data = handleApiResponse(response);
      
      // Update stored tokens
      localStorage.setItem('auth_token', data.token);
      if (data.refreshToken) {
        localStorage.setItem('refresh_token', data.refreshToken);
      }
      
      return data;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  // Forgot password
  static async forgotPassword(email) {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return handleApiResponse(response);
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  // Reset password
  static async resetPassword(token, password, confirmPassword) {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        token,
        password,
        confirmPassword
      });
      return handleApiResponse(response);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  // Update user profile
  static async updateProfile(profileData) {
    try {
      const response = await apiClient.put('/auth/profile', profileData);
      const data = handleApiResponse(response);
      
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  static isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  }

  // Get stored user data
  static getStoredUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }
}

export default AuthService;
