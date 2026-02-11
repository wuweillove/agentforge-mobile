const { query } = require('../config/database');
const logger = require('../config/logger');

class Credit {
  // Get user credits
  static async getBalance(userId) {
    try {
      const result = await query(
        'SELECT balance, updated_at FROM credits WHERE user_id = $1',
        [userId]
      );
      
      if (result.rows.length === 0) {
        // Initialize credits for new user
        await query(
          'INSERT INTO credits (user_id, balance) VALUES ($1, 0)',
          [userId]
        );
        return { balance: 0, updated_at: new Date() };
      }
      
      return result.rows[0];
    } catch (error) {
      logger.error('Credit getBalance error:', error);
      throw error;
    }
  }

  // Add credits
  static async addCredits(userId, amount, source = 'purchase') {
    try {
      const client = await query.pool.connect();
      
      try {
        await client.query('BEGIN');
        
        // Update balance
        const result = await client.query(
          `UPDATE credits SET balance = balance + $1, updated_at = NOW()
           WHERE user_id = $2
           RETURNING balance`,
          [amount, userId]
        );
        
        const newBalance = result.rows[0].balance;
        
        // Create transaction record
        await client.query(
          `INSERT INTO credit_transactions (user_id, type, amount, source, balance_after)
           VALUES ($1, 'credit', $2, $3, $4)`,
          [userId, amount, source, newBalance]
        );
        
        await client.query('COMMIT');
        return newBalance;
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Credit addCredits error:', error);
      throw error;
    }
  }

  // Deduct credits
  static async deductCredits(userId, amount, reason = 'usage') {
    try {
      const client = await query.pool.connect();
      
      try {
        await client.query('BEGIN');
        
        // Check balance
        const checkResult = await client.query(
          'SELECT balance FROM credits WHERE user_id = $1',
          [userId]
        );
        
        if (checkResult.rows.length === 0 || checkResult.rows[0].balance < amount) {
          throw new Error('Insufficient credits');
        }
        
        // Deduct credits
        const result = await client.query(
          `UPDATE credits SET balance = balance - $1, updated_at = NOW()
           WHERE user_id = $2
           RETURNING balance`,
          [amount, userId]
        );
        
        const newBalance = result.rows[0].balance;
        
        // Create transaction record
        await client.query(
          `INSERT INTO credit_transactions (user_id, type, amount, reason, balance_after)
           VALUES ($1, 'debit', $2, $3, $4)`,
          [userId, amount, reason, newBalance]
        );
        
        await client.query('COMMIT');
        return newBalance;
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Credit deductCredits error:', error);
      throw error;
    }
  }

  // Get transaction history
  static async getHistory(userId, limit = 50) {
    try {
      const result = await query(
        `SELECT id, type, amount, reason, source, balance_after, created_at
         FROM credit_transactions
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT $2`,
        [userId, limit]
      );
      return result.rows;
    } catch (error) {
      logger.error('Credit getHistory error:', error);
      throw error;
    }
  }

  // Get total credits sold (admin)
  static async getTotalSold() {
    try {
      const result = await query(
        `SELECT SUM(amount) as total
         FROM credit_transactions
         WHERE type = 'credit' AND source LIKE 'purchase%'`
      );
      return parseInt(result.rows[0].total) || 0;
    } catch (error) {
      logger.error('Credit getTotalSold error:', error);
      throw error;
    }
  }
}

module.exports = Credit;
