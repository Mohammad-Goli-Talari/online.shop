/**
 * API Client
 * Unified HTTP client for both mock and real API endpoints
 */

import { API_CONFIG, getApiBaseUrl } from '../config/api.js';

// Generic API error class
export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

// HTTP methods enum
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
};

// Generic API client
class ApiClient {
  constructor() {
    this.baseUrl = getApiBaseUrl();
    this.timeout = API_CONFIG.TIMEOUT;
    this.defaultHeaders = { ...API_CONFIG.DEFAULT_HEADERS };
  }

  // Update base URL when switching between mock/real API
  updateBaseUrl() {
    this.baseUrl = getApiBaseUrl();
  }

  // Build full URL
  buildUrl(endpoint) {
    // Remove leading slash from endpoint if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    
    // For mock APIs (relative URLs), don't use URL constructor
    if (API_CONFIG.USE_MOCKS) {
      return `${this.baseUrl}/${cleanEndpoint}`;
    }
    
    // For real APIs (absolute URLs), use URL constructor
    return `${this.baseUrl}/${cleanEndpoint}`;
  }

  // Get authentication token from localStorage
  getAuthToken() {
    return localStorage.getItem('auth_token');
  }

  // Build headers with authentication
  buildHeaders(customHeaders = {}) {
    const headers = { ...this.defaultHeaders, ...customHeaders };
    
    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Generic request method
  async request(method, endpoint, options = {}) {
    const { data, params, headers: customHeaders, ...fetchOptions } = options;
    
    let requestUrl = this.buildUrl(endpoint);
    
    // Add query parameters
    if (params) {
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          searchParams.append(key, params[key]);
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        requestUrl = `${requestUrl}?${queryString}`;
      }
    }

    const config = {
      method,
      headers: this.buildHeaders(customHeaders),
      ...fetchOptions
    };

    // Add body for non-GET requests
    if (data && method !== HTTP_METHODS.GET) {
      config.body = JSON.stringify(data);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(requestUrl, {
        ...config,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Parse response
      const contentType = response.headers.get('content-type');
      let responseData;
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      // Handle API errors
      if (!response.ok) {
        const errorMessage = responseData?.message || `HTTP ${response.status}: ${response.statusText}`;
        const errorCode = responseData?.code || `HTTP_${response.status}`;
        throw new ApiError(errorMessage, response.status, errorCode);
      }

      return responseData;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408, 'TIMEOUT');
      }
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Network or other errors
      throw new ApiError(error.message || 'Network error', 0, 'NETWORK_ERROR');
    }
  }

  // Convenience methods
  async get(endpoint, options = {}) {
    return this.request(HTTP_METHODS.GET, endpoint, options);
  }

  async post(endpoint, data, options = {}) {
    return this.request(HTTP_METHODS.POST, endpoint, { ...options, data });
  }

  async put(endpoint, data, options = {}) {
    return this.request(HTTP_METHODS.PUT, endpoint, { ...options, data });
  }

  async delete(endpoint, options = {}) {
    return this.request(HTTP_METHODS.DELETE, endpoint, options);
  }

  async patch(endpoint, data, options = {}) {
    return this.request(HTTP_METHODS.PATCH, endpoint, { ...options, data });
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient();

// Helper function to handle API responses consistently
export const handleApiResponse = (response) => {
  // Check if response follows our API format
  if (response && typeof response === 'object' && 'status' in response) {
    if (response.status === true) {
      return response.data;
    } else {
      throw new ApiError(response.message || 'API Error', 400, response.code);
    }
  }
  
  // Return response as-is if it doesn't follow our format
  return response;
};

// Update API client when switching between mock/real API
export const updateApiClient = () => {
  apiClient.updateBaseUrl();
  console.log(`📡 API Client updated - Base URL: ${apiClient.baseUrl}`);
};
