// src/config/api.js
/**
 * API Configuration
 * Controls whether to use mock data or real API endpoints
 */

// Environment configuration
export const API_CONFIG = {
  // Set this to false when real API backend is ready
  USE_MOCKS: true,
  
  // Real API base URL (when backend is ready)
  REAL_API_URL: 'https://api.telar.dev',
  
  // Mock API base URL (handled by MSW)
  MOCK_API_URL: '/api',
  
  // Request timeout in milliseconds
  TIMEOUT: 10000,
  
  // Default headers for API requests
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Get the appropriate API base URL
export const getApiBaseUrl = () => {
  return API_CONFIG.USE_MOCKS ? API_CONFIG.MOCK_API_URL : API_CONFIG.REAL_API_URL;
};

// Check if we're using mocks
export const isUsingMocks = () => API_CONFIG.USE_MOCKS;

// Switch to real API (call this function when backend is ready)
export const switchToRealApi = () => {
  API_CONFIG.USE_MOCKS = false;
  console.log('🔄 Switched to real API backend');
};

// Switch back to mocks (useful for development/testing)
export const switchToMocks = () => {
  API_CONFIG.USE_MOCKS = true;
  console.log('🔄 Switched to mock API');
};
