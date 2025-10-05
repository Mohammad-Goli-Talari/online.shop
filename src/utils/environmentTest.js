/**
 * Environment Configuration Test Utility
 * Tests that all environment variables are properly configured
 */

import { ENV_CONFIG, getCallbackUrl, getWebhookUrl } from '../config/environment.js';

export const testEnvironmentConfiguration = () => {
  console.log('🧪 Testing Environment Configuration...\n');
  
  const tests = [
    {
      name: 'API Base URL',
      value: ENV_CONFIG.API_BASE_URL,
      isValid: (url) => url && url.startsWith('http'),
      required: true
    },
    {
      name: 'Bank Gateway URL',
      value: ENV_CONFIG.BANK_GATEWAY_URL,
      isValid: (url) => url && url.startsWith('http'),
      required: true
    },
    {
      name: 'Frontend URL',
      value: ENV_CONFIG.FRONTEND_URL,
      isValid: (url) => url && url.startsWith('http'),
      required: true
    },
    {
      name: 'Payment Success URL',
      value: ENV_CONFIG.PAYMENT_SUCCESS_URL,
      isValid: (url) => url && url.startsWith('http'),
      required: true
    },
    {
      name: 'Payment Failure URL',
      value: ENV_CONFIG.PAYMENT_FAILURE_URL,
      isValid: (url) => url && url.startsWith('http'),
      required: true
    },
    {
      name: 'Webhook Base URL',
      value: ENV_CONFIG.WEBHOOK_BASE_URL,
      isValid: (url) => url && url.startsWith('http'),
      required: true
    }
  ];

  let passed = 0;
  let failed = 0;

  console.log('📋 Environment Variable Tests:');
  console.log('================================');

  tests.forEach(test => {
    const isValid = test.value && test.isValid(test.value);
    const status = isValid ? '✅' : '❌';
    const required = test.required ? '(REQUIRED)' : '(OPTIONAL)';
    
    console.log(`${status} ${test.name} ${required}`);
    console.log(`   Value: ${test.value || 'NOT SET'}`);
    
    if (isValid) {
      passed++;
    } else {
      failed++;
      if (test.required) {
        console.log(`   ⚠️  This is a required configuration!`);
      }
    }
    console.log('');
  });

  // Test callback URL generation
  console.log('🔗 Callback URL Tests:');
  console.log('======================');
  
  const callbackTests = ['success', 'failure', 'cancelled'];
  callbackTests.forEach(type => {
    const url = getCallbackUrl(type);
    const isValid = url && url.startsWith('http');
    const status = isValid ? '✅' : '❌';
    
    console.log(`${status} ${type} callback URL: ${url}`);
  });
  console.log('');

  // Test webhook URL
  console.log('📡 Webhook URL Test:');
  console.log('====================');
  const webhookUrl = getWebhookUrl();
  const webhookValid = webhookUrl && webhookUrl.startsWith('http');
  const webhookStatus = webhookValid ? '✅' : '❌';
  
  console.log(`${webhookStatus} Webhook URL: ${webhookUrl}`);
  console.log('');

  // Environment detection
  console.log('🌍 Environment Detection:');
  console.log('=========================');
  console.log(`✅ Mode: ${ENV_CONFIG.NODE_ENV}`);
  console.log(`✅ Development: ${ENV_CONFIG.IS_DEVELOPMENT}`);
  console.log(`✅ Production: ${ENV_CONFIG.IS_PRODUCTION}`);
  console.log(`✅ Use Mocks: ${ENV_CONFIG.USE_MOCKS}`);
  console.log('');

  // Summary
  console.log('📊 Test Summary:');
  console.log('================');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  console.log('');

  if (failed === 0) {
    console.log('🎉 All environment configuration tests passed!');
    console.log('✅ Ready for production deployment');
  } else {
    console.log('⚠️  Some environment configuration tests failed');
    console.log('🔧 Please check the failed configurations above');
  }

  return {
    passed,
    failed,
    successRate: Math.round((passed / (passed + failed)) * 100),
    isReady: failed === 0
  };
};

// Auto-run test in development
if (ENV_CONFIG.IS_DEVELOPMENT) {
  console.log('🔧 Running environment configuration test...\n');
  testEnvironmentConfiguration();
}
