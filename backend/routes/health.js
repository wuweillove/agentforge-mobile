const express = require('express');
const { pool, redisClient } = require('../config/database');
const logger = require('../config/logger');

const router = express.Router();

// Health check endpoint
router.get('/', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      database: 'unknown',
      redis: 'unknown',
    },
  };

  try {
    // Check database
    await pool.query('SELECT 1');
    health.services.database = 'connected';
  } catch (error) {
    health.services.database = 'disconnected';
    health.status = 'degraded';
    logger.error('Database health check failed:', error);
  }

  try {
    // Check Redis
    if (redisClient) {
      await redisClient.ping();
      health.services.redis = 'connected';
    } else {
      health.services.redis = 'not configured';
    }
  } catch (error) {
    health.services.redis = 'disconnected';
    health.status = 'degraded';
    logger.error('Redis health check failed:', error);
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});

// Readiness check
router.get('/ready', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'ready' });
  } catch (error) {
    res.status(503).json({ status: 'not ready', error: error.message });
  }
});

// Liveness check
router.get('/live', (req, res) => {
  res.status(200).json({ status: 'alive' });
});

module.exports = router;
