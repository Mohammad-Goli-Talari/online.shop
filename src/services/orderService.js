import { apiClient, handleApiResponse } from '../utils/apiClient.js';

export class OrderService {
  static async getOrders(options = {}) {
    try {
      const params = {
        page: options.page || 1,
        limit: options.limit || 10,
        status: options.status,
        sortBy: options.sortBy || 'createdAt',
        sortOrder: options.sortOrder || 'desc'
      };

      Object.keys(params).forEach(key => {
        if (params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await apiClient.get('/orders', { params });
      return handleApiResponse(response);
    } catch (error) {
      console.error('Get orders error:', error);
      throw error;
    }
  }

  static async getOrderById(id) {
    try {
      const response = await apiClient.get(`/orders/${id}`);
      return handleApiResponse(response);
    } catch (error) {
      console.error('Get order by ID error:', error);
      throw error;
    }
  }

  static async createOrder(checkoutData) {
    try {
      const response = await apiClient.post('/orders', checkoutData);
      return handleApiResponse(response);
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  }

  static async cancelOrder(id, reason = '') {
    try {
      const response = await apiClient.put(`/orders/${id}/cancel`, { reason });
      return handleApiResponse(response);
    } catch (error) {
      console.error('Cancel order error:', error);
      throw error;
    }
  }

  static async updateOrderStatus(id, status, notes = '') {
    try {
      const response = await apiClient.put(`/orders/${id}/status`, {
        status,
        notes
      });
      return handleApiResponse(response);
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  }

  static async confirmOrderByOrderNumber(orderNumber, transactionDetails = {}) {
    try {
      const response = await apiClient.put(`/orders/confirm-payment`, {
        orderNo: orderNumber,
        status: 'CONFIRMED',
        transactionId: transactionDetails.transactionId,
        paymentTimestamp: transactionDetails.timestamp,
        notes: `Payment confirmed. Transaction ID: ${transactionDetails.transactionId}`
      });
      return handleApiResponse(response);
    } catch (error) {
      console.error('Confirm order by order number error:', error);
      throw error;
    }
  }

  static async getAllOrders(options = {}) {
    try {
      const params = {
        page: options.page || 1,
        limit: options.limit || 10,
        status: options.status,
        userId: options.userId,
        dateFrom: options.dateFrom,
        dateTo: options.dateTo,
        sortBy: options.sortBy || 'createdAt',
        sortOrder: options.sortOrder || 'desc'
      };

      Object.keys(params).forEach(key => {
        if (params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await apiClient.get('/admin/orders', { params });
      return handleApiResponse(response);
    } catch (error) {
      console.error('Get all orders error:', error);
      throw error;
    }
  }
}

export default OrderService;
