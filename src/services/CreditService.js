import StorageService from './StorageService';
import StripePayments from './StripePayments';

class CreditService {
  // Credit packages
  CREDIT_PACKAGES = [
    { id: 'pack_100', credits: 100, price: 9.99, bonus: 0 },
    { id: 'pack_500', credits: 500, price: 39.99, bonus: 50 },
    { id: 'pack_1000', credits: 1000, price: 69.99, bonus: 150 },
    { id: 'pack_5000', credits: 5000, price: 299.99, bonus: 1000 },
  ];

  // Credit costs per operation
  CREDIT_COSTS = {
    workflow_execution: 1,
    node_execution: 0.1,
    api_call_openai: 2,
    api_call_anthropic: 3,
    api_call_google: 2,
    storage_mb: 0.01,
  };

  async getBalance() {
    try {
      const credits = await StorageService.getCredits();
      return credits.balance || 0;
    } catch (error) {
      console.error('Failed to get credit balance:', error);
      return 0;
    }
  }

  async addCredits(amount, source = 'purchase') {
    try {
      const credits = await StorageService.getCredits();
      const newBalance = (credits.balance || 0) + amount;
      
      const transaction = {
        id: `txn_${Date.now()}`,
        type: 'credit',
        amount,
        source,
        timestamp: new Date().toISOString(),
        balanceAfter: newBalance,
      };

      await StorageService.saveCredits({
        balance: newBalance,
        history: [transaction, ...(credits.history || [])],
      });

      return newBalance;
    } catch (error) {
      throw new Error('Failed to add credits');
    }
  }

  async deductCredits(amount, reason = 'usage') {
    try {
      const credits = await StorageService.getCredits();
      const currentBalance = credits.balance || 0;

      if (currentBalance < amount) {
        throw new Error('Insufficient credits');
      }

      const newBalance = currentBalance - amount;
      
      const transaction = {
        id: `txn_${Date.now()}`,
        type: 'debit',
        amount,
        reason,
        timestamp: new Date().toISOString(),
        balanceAfter: newBalance,
      };

      await StorageService.saveCredits({
        balance: newBalance,
        history: [transaction, ...(credits.history || [])],
      });

      return newBalance;
    } catch (error) {
      throw error;
    }
  }

  async purchaseCredits(packageId, paymentMethodId) {
    try {
      const package_ = this.CREDIT_PACKAGES.find(p => p.id === packageId);
      if (!package_) {
        throw new Error('Invalid package');
      }

      // Process payment through Stripe
      const payment = await StripePayments.purchaseCredits(
        package_.price,
        paymentMethodId
      );

      if (payment.status === 'succeeded') {
        const totalCredits = package_.credits + package_.bonus;
        await this.addCredits(totalCredits, `purchase_${packageId}`);
        return {
          success: true,
          credits: totalCredits,
          transactionId: payment.id,
        };
      }

      throw new Error('Payment failed');
    } catch (error) {
      throw error;
    }
  }

  async getHistory(limit = 50) {
    try {
      const credits = await StorageService.getCredits();
      const history = credits.history || [];
      return history.slice(0, limit);
    } catch (error) {
      console.error('Failed to get credit history:', error);
      return [];
    }
  }

  async calculateCost(operation, metadata = {}) {
    const baseCost = this.CREDIT_COSTS[operation] || 0;
    
    // Apply multipliers based on metadata
    let cost = baseCost;
    
    if (operation === 'workflow_execution' && metadata.nodeCount) {
      cost += metadata.nodeCount * this.CREDIT_COSTS.node_execution;
    }

    return Math.ceil(cost * 10) / 10; // Round to 1 decimal
  }

  async trackUsage(operation, metadata = {}) {
    try {
      const cost = await this.calculateCost(operation, metadata);
      await this.deductCredits(cost, operation);
      
      // Also track in backend for analytics
      await StripePayments.trackUsage(
        metadata.workflowId,
        operation,
        cost
      );

      return { cost, success: true };
    } catch (error) {
      if (error.message === 'Insufficient credits') {
        return { cost: 0, success: false, error: 'insufficient_credits' };
      }
      throw error;
    }
  }

  async checkSufficientCredits(operation, metadata = {}) {
    const cost = await this.calculateCost(operation, metadata);
    const balance = await this.getBalance();
    return balance >= cost;
  }
}

export default new CreditService();