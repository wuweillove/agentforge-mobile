const { query } = require('../config/database');
const logger = require('../config/logger');

class Workflow {
  // Create workflow
  static async create({ userId, name, description, nodes, connections, status = 'draft' }) {
    try {
      const result = await query(
        `INSERT INTO workflows (user_id, name, description, nodes, connections, status)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [userId, name, description, JSON.stringify(nodes), JSON.stringify(connections), status]
      );
      return result.rows[0];
    } catch (error) {
      logger.error('Workflow create error:', error);
      throw error;
    }
  }

  // Find by ID
  static async findById(id, userId) {
    try {
      const result = await query(
        'SELECT * FROM workflows WHERE id = $1 AND user_id = $2',
        [id, userId]
      );
      return result.rows[0];
    } catch (error) {
      logger.error('Workflow findById error:', error);
      throw error;
    }
  }

  // Find by user ID
  static async findByUserId(userId, limit = 50, offset = 0) {
    try {
      const result = await query(
        `SELECT * FROM workflows
         WHERE user_id = $1
         ORDER BY updated_at DESC
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );
      return result.rows;
    } catch (error) {
      logger.error('Workflow findByUserId error:', error);
      throw error;
    }
  }

  // Update workflow
  static async update(id, userId, updates) {
    try {
      const fields = [];
      const values = [];
      let paramCount = 1;

      Object.keys(updates).forEach((key) => {
        if (updates[key] !== undefined) {
          let value = updates[key];
          if (key === 'nodes' || key === 'connections') {
            value = JSON.stringify(value);
          }
          fields.push(`${key} = $${paramCount}`);
          values.push(value);
          paramCount++;
        }
      });

      values.push(id, userId);
      const result = await query(
        `UPDATE workflows SET ${fields.join(', ')}, updated_at = NOW()
         WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
         RETURNING *`,
        values
      );

      return result.rows[0];
    } catch (error) {
      logger.error('Workflow update error:', error);
      throw error;
    }
  }

  // Delete workflow
  static async delete(id, userId) {
    try {
      const result = await query(
        'DELETE FROM workflows WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, userId]
      );
      return result.rowCount > 0;
    } catch (error) {
      logger.error('Workflow delete error:', error);
      throw error;
    }
  }

  // Count workflows for user
  static async countByUserId(userId) {
    try {
      const result = await query(
        'SELECT COUNT(*) as count FROM workflows WHERE user_id = $1',
        [userId]
      );
      return parseInt(result.rows[0].count);
    } catch (error) {
      logger.error('Workflow countByUserId error:', error);
      throw error;
    }
  }

  // Get total workflows (admin)
  static async count() {
    try {
      const result = await query('SELECT COUNT(*) as count FROM workflows');
      return parseInt(result.rows[0].count);
    } catch (error) {
      logger.error('Workflow count error:', error);
      throw error;
    }
  }
}

module.exports = Workflow;
