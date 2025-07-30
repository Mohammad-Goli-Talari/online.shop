/**
 * Mock Setup and Initialization
 * Main entry point for mock system configuration
 */

import { startMockServiceWorker } from './browser.js';
import { API_CONFIG, switchToRealApi, switchToMocks } from '../config/api.js';
import { updateApiClient } from '../utils/apiClient.js';

// Initialize mock system
export const initializeMockSystem = async () => {
  // Only start MSW if we're using mocks
  if (API_CONFIG.USE_MOCKS) {
    await startMockServiceWorker();
    console.log('🎭 Mock system initialized');
    console.log('📋 Available mock data:');
    console.log('  • 50+ users (including admin@telar.dev)');
    console.log('  • 12 product categories');
    console.log('  • 100+ products with realistic data');
    console.log('  • 200+ order history records');
    console.log('  • Cart functionality');
    console.log('  • Dashboard analytics');
    console.log('');
    console.log('🔧 To switch to real API when ready:');
    console.log('  import { switchToRealApi } from "/src/config/api.js"');
    console.log('  switchToRealApi()');
  } else {
    console.log('🌐 Using real API backend');
  }
};

// Helper functions for runtime API switching
export const enableMocks = async () => {
  switchToMocks();
  updateApiClient();
  await startMockServiceWorker();
  window.location.reload(); // Reload to ensure clean state
};

export const enableRealApi = () => {
  switchToRealApi();
  updateApiClient();
  // Stop MSW worker if it's running
  if (window.msw?.worker) {
    window.msw.worker.stop();
  }
  window.location.reload(); // Reload to ensure clean state
};

// Global functions for easy access in browser console
if (typeof window !== 'undefined') {
  window.__TELAR_DEV__ = {
    enableMocks,
    enableRealApi,
    switchToMocks,
    switchToRealApi,
    currentConfig: () => ({ ...API_CONFIG })
  };
}
