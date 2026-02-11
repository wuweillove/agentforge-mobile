const rateLimit = require('express-rate-limit');
const { redisClient } = require('../config/database');
const logger = require('../config/logger');

// Create rate limiter with Redis store (if available)
const createRateLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn('Rate limit exceeded:', {
        ip: req.ip,
        url: req.originalUrl,
      });
      res.status(429).json({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
      });
    },
  };

  return rateLimit({
    ...defaultOptions,
    ...options,
  });
};

// Strict rate limiter for auth endpoints
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many authentication attempts, please try again later.',
});

// API rate limiter
const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

// Webhook rate limiter (more lenient)
const webhookLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 1000,
});

module.exports = {
  authLimiter,
  apiLimiter,
  webhookLimiter,
  createRateLimiter,
};
