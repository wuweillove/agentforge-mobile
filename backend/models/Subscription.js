const { query } = require('../config/database');
const logger = require('../config/logger');

class Subscription {
  // Create subscription
  static async create({
    userId,
    stripeSubscriptionId,
    tier,
    status,
    currentPeriodStart,
    currentPeriodEnd,
  }) {
    try {
      const result = await query(
        `INSERT INTO subscriptions 
         (user_id, stripe_subscription_id, tier, status, current_period_start, current_period_end)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          userId,
          stripeSubscriptionId,
          tier,
          status,
          currentPeriodStart,
          currentPeriodEnd,
        ]
      );

      // Update user's subscription tier
      await query(
        'UPDATE users SET subscription_tier = $1 WHERE id = $2',
        [tier, userId]
      );

      return result.rows[0];
    } catch (error) {
      logger.error('Subscription create error:', error);
      throw error;
    }
  }

  // Find by user ID
  static async findByUserId(userId) {
    try {
      const result = await query(
        `SELECT * FROM subscriptions
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT 1`,
        [userId]
      );
      return result.rows[0];
    } catch (error) {
      logger.error('Subscription findByUserId error:', error);
      throw error;
    }
  }

  // Find by Stripe subscription ID
  static async findByStripeId(stripeSubscriptionId) {
    try {
      const result = await query(
        'SELECT * FROM subscriptions WHERE stripe_subscription_id = $1',
        [stripeSubscriptionId]
      );
      return result.rows[0];
    } catch (error) {
      logger.error('Subscription findByStripeId error:', error);
      throw error;
    }
  }

  // Update subscription
  static async update(id, updates) {
    try {
      const fields = [];
      const values = [];
      let paramCount = 1;

      Object.keys(updates).forEach((key) => {
        if (updates[key] !== undefined) {
          fields.push(`${key} = $${paramCount}`);
          values.push(updates[key]);
          paramCount++;
        }
      });

      values.push(id);
      const result = await query(
        `UPDATE subscriptions SET ${fields.join(', ')}
         WHERE id = $${paramCount}
         RETURNING *`,
        values
      );

      // Update user tier if tier changed
      if (updates.tier) {
        const subscription = result.rows[0];
        await query(
          'UPDATE users SET subscription_tier = $1 WHERE id = $2',
          [updates.tier, subscription.user_id]
        );
      }

      return result.rows[0];
    } catch (error) {
      logger.error('Subscription update error:', error);
      throw error;
    }
  }

  // Get subscription counts by tier (admin)
  static async getCountsByTier() {
    try {
      const result = await query(
        `SELECT tier, COUNT(*) as count
         FROM subscriptions
         WHERE status = 'active'
         GROUP BY tier`
      );
      
      const counts = {
        free: 0,
        premium: 0,
        enterprise: 0,
      };
      
      result.rows.forEach((row) => {
        counts[row.tier] = parseInt(row.count);
      });
      
      // Add free tier users (users without active subscriptions)
      const freeUsersResult = await query(
        `SELECT COUNT(*) as count FROM users
         WHERE subscription_tier = 'free'`
      );
      counts.free = parseInt(freeUsersResult.rows[0].count);
      
      return counts;
    } catch (error) {
      logger.error('Subscription getCountsByTier error:', error);
      throw error;
    }
  }

  // Calculate MRR (admin)
  static async calculateMRR() {
    try {
      // Premium: $9.99, Enterprise: $49.99
      const result = await query(
        `SELECT 
          SUM(CASE WHEN tier = 'premium' THEN 9.99 ELSE 0 END) as premium_mrr,
          SUM(CASE WHEN tier = 'enterprise' THEN 49.99 ELSE 0 END) as enterprise_mrr
         FROM subscriptions
         WHERE status = 'active'`
      );
      
      const { premium_mrr, enterprise_mrr } = result.rows[0];
      return parseFloat(premium_mrr || 0) + parseFloat(enterprise_mrr || 0);
    } catch (error) {
      logger.error('Subscription calculateMRR error:', error);
      throw error;
    }
  }
}

module.exports = Subscription;
