/**
 * Environment-aware configuration utility
 * Handles development vs production URL configuration
 */

export const ENV_CONFIG = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8088/api',
  USE_MOCKS: import.meta.env.VITE_USE_MOCKS === 'true',
  
  // Payment Gateway Configuration
  BANK_GATEWAY_URL: import.meta.env.VITE_BANK_GATEWAY_URL || 'http://localhost:4000',
  
  // Frontend URLs for callbacks
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || window.location.origin,
  PAYMENT_SUCCESS_URL: import.meta.env.VITE_PAYMENT_SUCCESS_URL || `${window.location.origin}/payment-success`,
  PAYMENT_FAILURE_URL: import.meta.env.VITE_PAYMENT_FAILURE_URL || `${window.location.origin}/payment-failure`,
  PAYMENT_CANCELLED_URL: import.meta.env.VITE_PAYMENT_CANCELLED_URL || `${window.location.origin}/payment-cancelled`,
  
  // Webhook Configuration
  WEBHOOK_BASE_URL: import.meta.env.VITE_WEBHOOK_BASE_URL || 'http://localhost:8088',
  
  // Environment Detection
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
  NODE_ENV: import.meta.env.MODE
};

/**
 * Get the appropriate callback URL based on environment
 */
export const getCallbackUrl = (type) => {
  const baseUrl = ENV_CONFIG.IS_DEVELOPMENT ? window.location.origin : ENV_CONFIG.FRONTEND_URL;
  
  switch (type) {
    case 'success':
      return ENV_CONFIG.PAYMENT_SUCCESS_URL;
    case 'failure':
      return ENV_CONFIG.PAYMENT_FAILURE_URL;
    case 'cancelled':
      return ENV_CONFIG.PAYMENT_CANCELLED_URL;
    default:
      return `${baseUrl}/${type}`;
  }
};

/**
 * Get the webhook URL for the backend
 */
export const getWebhookUrl = () => {
  return `${ENV_CONFIG.WEBHOOK_BASE_URL}/webhook`;
};

/**
 * Log current configuration (development only)
 */
export const logEnvironmentConfig = () => {
  if (ENV_CONFIG.IS_DEVELOPMENT) {
    console.log('🔧 Environment Configuration:', {
      mode: ENV_CONFIG.NODE_ENV,
      apiUrl: ENV_CONFIG.API_BASE_URL,
      bankGatewayUrl: ENV_CONFIG.BANK_GATEWAY_URL,
      frontendUrl: ENV_CONFIG.FRONTEND_URL,
      webhookUrl: getWebhookUrl(),
      useMocks: ENV_CONFIG.USE_MOCKS
    });
  }
};

// Auto-log configuration in development
if (ENV_CONFIG.IS_DEVELOPMENT) {
  logEnvironmentConfig();
}
