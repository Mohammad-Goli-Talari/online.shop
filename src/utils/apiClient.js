import { API_CONFIG, getApiBaseUrl } from '../config/api.js';

export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
};

class ApiClient {
  constructor() {
    this.baseUrl = getApiBaseUrl();
    this.timeout = API_CONFIG.TIMEOUT;
    this.defaultHeaders = { ...API_CONFIG.DEFAULT_HEADERS };
  }

  updateBaseUrl() {
    this.baseUrl = getApiBaseUrl();
  }

  buildUrl(endpoint) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    
    if (API_CONFIG.USE_MOCKS) {
      return `${this.baseUrl}/${cleanEndpoint}`;
    }
    
    return `${this.baseUrl}/${cleanEndpoint}`;
  }

  getAuthToken() {
    return localStorage.getItem('auth_token');
  }

  getSessionId() {
    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = `frontend-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  }

  buildHeaders(customHeaders = {}) {
    const headers = { ...this.defaultHeaders, ...customHeaders };
    
    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const sessionId = this.getSessionId();
    headers['x-session-id'] = sessionId;
    
    return headers;
  }

  async request(method, endpoint, options = {}) {
    const { data, params, headers: customHeaders, ...fetchOptions } = options;
    
    let requestUrl = this.buildUrl(endpoint);
    
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

      const contentType = response.headers.get('content-type');
      let responseData;
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

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
      
      throw new ApiError(error.message || 'Network error', 0, 'NETWORK_ERROR');
    }
  }

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

export const apiClient = new ApiClient();

export const handleApiResponse = (response) => {
  if (response && typeof response === 'object') {
    if ('error' in response || ('success' in response && response.success === false)) {
      throw new ApiError(response.error || response.message || 'API Error', 400, response.code);
    }
    
    if ('success' in response && response.success === true) {
      if ('data' in response) {
        return response.data;
      }
      const { success: _success, message: _message, ...data } = response;
      return Object.keys(data).length > 0 ? data : response;
    }
    
    if ('data' in response) {
      return response.data;
    }
  }
  
  return response;
};

export const updateApiClient = () => {
  apiClient.updateBaseUrl();
  console.log(`📡 API Client updated - Base URL: ${apiClient.baseUrl}`);
};
