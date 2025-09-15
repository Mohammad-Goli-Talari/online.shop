// src/mocks/browser.jsx
/**
 * MSW Browser Setup
 * Configures Mock Service Worker for the browser environment
 */

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers/handlers.js';

// Configure the worker with all handlers
export const worker = setupWorker(...handlers);

const isDevelopment = true; // Since we're in dev mode with mocks

// Enhanced logging for development
if (isDevelopment) {
  worker.events.on('request:start', ({ request }) => {
    console.log(`[MSW] ${request.method} ${request.url}`);
  });

  worker.events.on('request:match', ({ request }) => {
    console.log(`[MSW] ✅ Intercepted ${request.method} ${request.url}`);
  });

  worker.events.on('request:unhandled', ({ request }) => {
    console.log(`[MSW] ⚠️ Unhandled ${request.method} ${request.url}`);
  });
}

// Start the worker
export const startMockServiceWorker = async () => {
  try {
    await worker.start({
      onUnhandledRequest: (request, print) => {
        // Only log unhandled requests that are API calls
        if (request.url.includes('/api/')) {
          print.warning();
        }
      },
      quiet: !isDevelopment
    });
    
    if (isDevelopment) {
      console.log('[MSW] 🚀 Mock Service Worker started successfully');
      console.log('[MSW] 📝 Intercepting API calls with mock data');
    }
  } catch (error) {
    console.error('[MSW] Failed to start Mock Service Worker:', error);
  }
};
