import PaymentService from './paymentService.js';
import CartService from './cartService.js';
import OrderService from './orderService.js';

export class CheckoutService {
  static async processCheckout(cartItems, checkoutData = {}) {
    try {
      console.log('🛒 Starting checkout process with', cartItems.length, 'items');

      if (!cartItems || cartItems.length === 0) {
        throw new Error('Cart is empty');
      }

      const totals = this.calculateTotals(cartItems);
      
      let backendOrder;
      try {
        const orderData = {
          items: cartItems.map(item => ({
            productId: item.productId || item.id,
            quantity: this.getItemQuantity(item)
          })),
          shippingAddress: checkoutData.shippingAddress,
          billingAddress: checkoutData.billingAddress,
          paymentMethod: checkoutData.paymentMethod || { type: 'bank_gateway' }
        };

        backendOrder = await OrderService.createOrder(orderData);
        console.log('📝 Order created in backend:', backendOrder.orderNo);
      } catch (orderError) {
        console.error('❌ Failed to create order in backend:', orderError);
        throw new Error(`Failed to create order: ${orderError.message}`);
      }

      const orderId = backendOrder.orderNo;
      
      const paymentData = {
        orderId,
        amount: totals.total,
        currency: checkoutData.currency || 'USD',
        merchantName: 'Telar Online Shop',
        metadata: {
          cartItems: cartItems.map(item => ({
            productId: item.productId || item.id,
            name: this.getItemName(item),
            quantity: this.getItemQuantity(item),
            unitPrice: this.getItemPrice(item),
            totalPrice: this.getItemPrice(item) * this.getItemQuantity(item)
          })),
          totals,
          customerInfo: checkoutData.customerInfo || {},
          checkoutTimestamp: new Date().toISOString()
        }
      };

      console.log('💰 Payment data prepared:', {
        orderId,
        amount: totals.total,
        itemCount: cartItems.length,
        backendOrderId: backendOrder.id
      });

      const paymentResult = await PaymentService.initiatePayment(paymentData);
      
      if (!paymentResult.success) {
        throw new Error('Payment initiation failed');
      }

      console.log('✅ Checkout process completed, redirecting to payment gateway');

      return {
        success: true,
        orderId,
        backendOrderId: backendOrder.id,
        totals,
        payment: paymentResult
      };

    } catch (error) {
      console.error('❌ Checkout process failed:', error);
      throw new Error(`Checkout failed: ${error.message}`);
    }
  }

  static calculateTotals(cartItems) {
    const subtotal = cartItems.reduce((acc, item) => {
      const price = this.getItemPrice(item);
      const quantity = this.getItemQuantity(item);
      return acc + (price * quantity);
    }, 0);

    const tax = subtotal * 0.08;
    const shipping = subtotal > 50 ? 0 : 9.99;
    const total = subtotal + tax + shipping;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      shipping: Math.round(shipping * 100) / 100,
      total: Math.round(total * 100) / 100
    };
  }

  static getItemName(item) {
    return item?.product?.name || item?.name || 'Unknown Item';
  }

  static getItemPrice(item) {
    return item?.product?.price || item?.unitPrice || item?.price || 0;
  }

  static getItemQuantity(item) {
    return item?.quantity || 1;
  }

  static validateCheckout(cartItems) {
    const errors = [];

    if (!cartItems || cartItems.length === 0) {
      errors.push('Cart is empty');
    }

    cartItems.forEach((item, index) => {
      if (!item.id && !item.productId) {
        errors.push(`Item ${index + 1} is missing ID`);
      }
      if (this.getItemPrice(item) <= 0) {
        errors.push(`Item ${index + 1} has invalid price`);
      }
      if (this.getItemQuantity(item) <= 0) {
        errors.push(`Item ${index + 1} has invalid quantity`);
      }
    });

    let totals = null;
    try {
      totals = this.calculateTotals(cartItems);
      if (totals.total <= 0) {
        errors.push('Total amount must be greater than zero');
      }
    } catch {
      errors.push('Unable to calculate totals');
    }

    return {
      isValid: errors.length === 0,
      errors,
      totals
    };
  }

  static async testCheckoutSystem() {
    const results = {
      gateway: false,
      cart: false,
      orders: false
    };

    try {
      results.gateway = await PaymentService.testGatewayHealth();
    } catch (error) {
      console.error('Gateway health check failed:', error);
    }

    try {
      await CartService.getCart();
      results.cart = true;
    } catch (error) {
      console.error('Cart service check failed:', error);
    }

    try {
      await OrderService.getOrders({ limit: 1 });
      results.orders = true;
    } catch (error) {
      console.warn('Order service check failed (might be using mocks):', error.message);
    }

    return results;
  }
}

export default CheckoutService;