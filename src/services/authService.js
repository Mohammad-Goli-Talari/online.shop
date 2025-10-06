import { apiClient, handleApiResponse } from '../utils/apiClient.js';

export class AuthService {
  static async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password
      });
      
      const data = handleApiResponse(response);
      
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        if (data.refreshToken) {
          localStorage.setItem('refresh_token', data.refreshToken);
        }
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async register(userData) {
    try {
      const registerData = {
        email: userData.email,
        password: userData.password,
        fullName: userData.firstName && userData.lastName 
          ? `${userData.firstName} ${userData.lastName}` 
          : userData.fullName || userData.firstName || userData.lastName
      };
      
      const response = await apiClient.post('/auth/register', registerData);
      const data = handleApiResponse(response);
      
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        if (data.refreshToken) {
          localStorage.setItem('refresh_token', data.refreshToken);
        }
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  static async getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/me');
      return handleApiResponse(response);
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  static async logout() {
    try {
      await apiClient.post('/auth/logout');
      
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      throw error;
    }
  }

  static async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        const response = await apiClient.post('/auth/refresh');
        const data = handleApiResponse(response);
        
        localStorage.setItem('auth_token', data.token);
        if (data.refreshToken) {
          localStorage.setItem('refresh_token', data.refreshToken);
        }
        
        return data;
      }

      const response = await apiClient.post('/auth/refresh', {
        refreshToken
      });
      
      const data = handleApiResponse(response);
      
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

  static async forgotPassword(email) {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return handleApiResponse(response);
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

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

  static async updateProfile(profileData) {
    try {
      const response = await apiClient.put('/auth/profile', profileData);
      const data = handleApiResponse(response);
      
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  static isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  }

  static getStoredUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }
}

export default AuthService;
