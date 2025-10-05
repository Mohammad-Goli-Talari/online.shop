import { ENV_CONFIG } from './environment.js';

export const API_CONFIG = {
  USE_MOCKS: ENV_CONFIG.USE_MOCKS,
  
  REAL_API_URL: ENV_CONFIG.API_BASE_URL,
  
  MOCK_API_URL: '/api',
  
  TIMEOUT: 10000,
  
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

export const getApiBaseUrl = () => {
  return API_CONFIG.USE_MOCKS ? API_CONFIG.MOCK_API_URL : API_CONFIG.REAL_API_URL;
};

export const isUsingMocks = () => API_CONFIG.USE_MOCKS;

export const switchToRealApi = () => {
  API_CONFIG.USE_MOCKS = false;
  console.log('🔄 Switched to real API backend');
};

export const switchToMocks = () => {
  API_CONFIG.USE_MOCKS = true;
  console.log('🔄 Switched to mock API');
};
