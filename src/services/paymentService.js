import { ENV_CONFIG, getCallbackUrl } from '../config/environment.js';

export class PaymentService {
  static BANK_GATEWAY_URL = ENV_CONFIG.BANK_GATEWAY_URL;

  static async initiatePayment(paymentData) {
    try {
      console.log('🔄 Initiating payment with bank gateway:', paymentData);

      const response = await fetch(`${this.BANK_GATEWAY_URL}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          orderId: paymentData.orderId,
          amount: paymentData.amount,
          currency: paymentData.currency || 'USD',
          merchantName: paymentData.merchantName || 'Telar Online Shop',
          merchantId: 'TELAR_SHOP_001',
          merchantCategory: 'E-Commerce',
          callbackUrl: getCallbackUrl('success'),
          metadata: {
            ...paymentData.metadata,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            sessionId: this.generateSessionId()
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Payment initiation failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Payment initiated successfully:', result);

      return {
        success: true,
        redirectUrl: result.redirectUrl,
        sessionTimeout: result.sessionTimeout,
        transactionExpiry: result.transactionExpiry,
        bankName: result.bankName,
        timestamp: result.timestamp
      };

    } catch (error) {
      console.error('❌ Payment initiation error:', error);
      throw new Error(`Failed to initiate payment: ${error.message}`);
    }
  }

  static async checkPaymentStatus(orderId) {
    try {
      console.log('📊 Checking payment status for order:', orderId);

      const response = await fetch(`${this.BANK_GATEWAY_URL}/status/${orderId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Status check failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('📋 Payment status:', result);

      return result;

    } catch (error) {
      console.error('❌ Payment status check error:', error);
      throw new Error(`Failed to check payment status: ${error.message}`);
    }
  }

  static async testGatewayHealth() {
    try {
      const response = await fetch(`${this.BANK_GATEWAY_URL}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        return false;
      }

      const result = await response.json();
      return result.status === 'healthy';

    } catch (error) {
      console.error('❌ Gateway health check failed:', error);
      return false;
    }
  }

  static generateSessionId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `sess_${timestamp}_${random}`;
  }

  static generateOrderId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `ORD_${timestamp}_${random}`;
  }

  static redirectToGateway(redirectUrl) {
    console.log('🔀 Redirecting to bank gateway:', redirectUrl);
    
    const currentCart = localStorage.getItem('cartBackup');
    if (currentCart) {
      localStorage.setItem('cartBeforePayment', currentCart);
    }

    window.location.href = redirectUrl;
  }

  static getPaymentCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const orderId = urlParams.get('orderId');
    const transactionId = urlParams.get('transactionId');
    const timestamp = urlParams.get('timestamp');

    if (!status || !orderId) {
      return null;
    }

    let normalizedStatus;
    switch (status.toLowerCase()) {
      case 'approved':
      case 'success':
      case 'completed':
        normalizedStatus = 'success';
        break;
      case 'declined':
      case 'failed':
      case 'error':
        normalizedStatus = 'failed';
        break;
      case 'cancelled':
      case 'canceled':
        normalizedStatus = 'cancelled';
        break;
      default:
        normalizedStatus = status.toLowerCase();
    }

    return {
      status: normalizedStatus,
      orderId,
      transactionId,
      timestamp: timestamp ? new Date(parseInt(timestamp)) : null
    };
  }

  static clearPaymentCallback() {
    const url = new URL(window.location);
    url.searchParams.delete('status');
    url.searchParams.delete('orderId');
    url.searchParams.delete('transactionId');
    url.searchParams.delete('timestamp');
    
    window.history.replaceState({}, document.title, url.toString());
  }
}

export default PaymentService;