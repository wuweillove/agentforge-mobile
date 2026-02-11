const { query } = require('../config/database');
const bcrypt = require('bcryptjs');
const logger = require('../config/logger');

class User {
  // Create new user
  static async create({ email, password, name }) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const result = await query(
        `INSERT INTO users (email, password, name, subscription_tier)
         VALUES ($1, $2, $3, 'free')
         RETURNING id, email, name, subscription_tier, created_at`,
        [email, hashedPassword, name]
      );

      return result.rows[0];
    } catch (error) {
      logger.error('User create error:', error);
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const result = await query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      return result.rows[0];
    } catch (error) {
      logger.error('User findByEmail error:', error);
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const result = await query(
        `SELECT id, email, name, subscription_tier, stripe_customer_id, created_at, updated_at
         FROM users WHERE id = $1`,
        [id]
      );
      return result.rows[0];
    } catch (error) {
      logger.error('User findById error:', error);
      throw error;
    }
  }

  // Update user
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

      if (fields.length === 0) {
        return await User.findById(id);
      }

      values.push(id);
      const result = await query(
        `UPDATE users SET ${fields.join(', ')}, updated_at = NOW()
         WHERE id = $${paramCount}
         RETURNING id, email, name, subscription_tier, created_at, updated_at`,
        values
      );

      return result.rows[0];
    } catch (error) {
      logger.error('User update error:', error);
      throw error;
    }
  }

  // Verify password
  static async verifyPassword(user, password) {
    return await bcrypt.compare(password, user.password);
  }

  // Update stripe customer ID
  static async updateStripeCustomer(userId, customerId) {
    try {
      await query(
        'UPDATE users SET stripe_customer_id = $1 WHERE id = $2',
        [customerId, userId]
      );
    } catch (error) {
      logger.error('Update stripe customer error:', error);
      throw error;
    }
  }

  // Get all users (admin)
  static async findAll(limit = 50, offset = 0) {
    try {
      const result = await query(
        `SELECT id, email, name, subscription_tier, created_at
         FROM users
         ORDER BY created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      return result.rows;
    } catch (error) {
      logger.error('User findAll error:', error);
      throw error;
    }
  }

  // Count users
  static async count() {
    try {
      const result = await query('SELECT COUNT(*) as count FROM users');
      return parseInt(result.rows[0].count);
    } catch (error) {
      logger.error('User count error:', error);
      throw error;
    }
  }
}

module.exports = User;
