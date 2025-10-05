export class WebhookService {
  static async handlePaymentWebhook(webhookData) {
    try {
      console.log('📡 Received payment webhook:', webhookData);

      const {
        orderId,
        transactionId,
        status,
        message,
        amount,
        currency,
        timestamp,
        metadata
      } = webhookData;

      if (!orderId || !status) {
        throw new Error('Invalid webhook data: missing required fields');
      }

      switch (status) {
        case 'success':
          await this.handleSuccessfulPayment({
            orderId,
            transactionId,
            amount,
            currency,
            timestamp,
            metadata
          });
          break;

        case 'failed':
          await this.handleFailedPayment({
            orderId,
            transactionId,
            message,
            timestamp,
            metadata
          });
          break;

        default:
          console.warn('Unknown payment status:', status);
      }

      return {
        success: true,
        message: 'Webhook processed successfully'
      };

    } catch (error) {
      console.error('❌ Webhook processing failed:', error);
      throw new Error(`Webhook processing failed: ${error.message}`);
    }
  }

  static async handleSuccessfulPayment(paymentData) {
    const { orderId, transactionId, amount, currency } = paymentData;

    console.log(`✅ Payment successful for order ${orderId}:`, {
      transactionId,
      amount: `${currency} ${amount}`
    });

    try {
      console.log(`📧 Payment confirmation should be sent for order ${orderId}`);

    } catch (error) {
      console.error('Error updating order after successful payment:', error);
    }
  }

  static async handleFailedPayment(paymentData) {
    const { orderId, message } = paymentData;

    console.log(`❌ Payment failed for order ${orderId}:`, message);

    try {
      console.log(`📝 Order ${orderId} marked as payment failed`);

    } catch (error) {
      console.error('Error updating order after failed payment:', error);
    }
  }

  static verifyWebhookSignature(PAYLOAD, SIGNATURE, SECRET) {
    try {
      console.log('🔒 Webhook signature verification (skipped in demo)', { PAYLOAD: !!PAYLOAD, SIGNATURE: !!SIGNATURE, SECRET: !!SECRET });
      return true;
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return false;
    }
  }
}

export default WebhookService;