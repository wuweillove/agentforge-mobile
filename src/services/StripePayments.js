import axios from 'axios';
import StorageService from './StorageService';

const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api'
  : 'https://api.agentforge.io';

class StripePayments {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests
    this.client.interceptors.request.use(
      async (config) => {
        const user = await StorageService.getUserProfile();
        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  // Credit Purchases
  async purchaseCredits(amount, paymentMethodId) {
    try {
      const response = await this.client.post('/credits/purchase', {
        amount,
        paymentMethodId,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to purchase credits');
    }
  }

  async getCreditBalance() {
    try {
      const response = await this.client.get('/credits/balance');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch credit balance');
    }
  }

  async getCreditHistory(limit = 50) {
    try {
      const response = await this.client.get('/credits/history', {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch credit history');
    }
  }

  // Subscription Management
  async createSubscription(priceId, paymentMethodId) {
    try {
      const response = await this.client.post('/subscriptions/create', {
        priceId,
        paymentMethodId,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create subscription');
    }
  }

  async getSubscription() {
    try {
      const response = await this.client.get('/subscriptions/current');
      return response.data;
    } catch (error) {
      // Return default free tier if no subscription exists
      return {
        tier: 'free',
        status: 'active',
        features: {
          maxWorkflows: 3,
          maxNodes: 10,
          apiCalls: 100,
        },
      };
    }
  }

  async updateSubscription(newPriceId) {
    try {
      const response = await this.client.put('/subscriptions/update', {
        priceId: newPriceId,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update subscription');
    }
  }

  async cancelSubscription() {
    try {
      const response = await this.client.post('/subscriptions/cancel');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to cancel subscription');
    }
  }

  // Payment Methods
  async addPaymentMethod(paymentMethodId) {
    try {
      const response = await this.client.post('/payment-methods/add', {
        paymentMethodId,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add payment method');
    }
  }

  async getPaymentMethods() {
    try {
      const response = await this.client.get('/payment-methods');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch payment methods');
    }
  }

  async deletePaymentMethod(paymentMethodId) {
    try {
      await this.client.delete(`/payment-methods/${paymentMethodId}`);
      return true;
    } catch (error) {
      throw new Error('Failed to delete payment method');
    }
  }

  async setDefaultPaymentMethod(paymentMethodId) {
    try {
      const response = await this.client.put('/payment-methods/default', {
        paymentMethodId,
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to set default payment method');
    }
  }

  // Invoices
  async getInvoices(limit = 20) {
    try {
      const response = await this.client.get('/invoices', {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch invoices');
    }
  }

  async downloadInvoice(invoiceId) {
    try {
      const response = await this.client.get(`/invoices/${invoiceId}/pdf`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to download invoice');
    }
  }

  // Usage Tracking
  async trackUsage(workflowId, resourceType, amount) {
    try {
      await this.client.post('/usage/track', {
        workflowId,
        resourceType,
        amount,
        timestamp: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error('Failed to track usage:', error);
      return false;
    }
  }

  async getUsageStats(period = 'month') {
    try {
      const response = await this.client.get('/usage/stats', {
        params: { period },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch usage stats');
    }
  }
}

export default new StripePayments();