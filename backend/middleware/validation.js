const Joi = require('joi');
const logger = require('../config/logger');

// Generic validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      logger.warn('Validation error:', { errors, body: req.body });

      return res.status(400).json({
        error: 'Validation Error',
        errors,
      });
    }

    next();
  };
};

// Validation schemas
const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(100).required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(100),
    email: Joi.string().email(),
  }),

  createWorkflow: Joi.object({
    name: Joi.string().min(1).max(200).required(),
    description: Joi.string().max(1000),
    nodes: Joi.array().items(Joi.object()).required(),
    connections: Joi.array().items(Joi.object()).required(),
    status: Joi.string().valid('draft', 'active'),
  }),

  updateWorkflow: Joi.object({
    name: Joi.string().min(1).max(200),
    description: Joi.string().max(1000),
    nodes: Joi.array().items(Joi.object()),
    connections: Joi.array().items(Joi.object()),
    status: Joi.string().valid('draft', 'active'),
  }),

  purchaseCredits: Joi.object({
    packageId: Joi.string().valid('pack_100', 'pack_500', 'pack_1000', 'pack_5000').required(),
  }),

  createSubscription: Joi.object({
    priceId: Joi.string().required(),
    paymentMethodId: Joi.string().required(),
  }),

  updateSubscription: Joi.object({
    priceId: Joi.string().required(),
  }),

  trackUsage: Joi.object({
    workflowId: Joi.string().required(),
    resourceType: Joi.string().required(),
    amount: Joi.number().positive().required(),
  }),
};

module.exports = {
  validate,
  schemas,
};
