const express = require('express');
const Credit = require('../models/Credit');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const { getOrCreateCustomer, createPaymentIntent, CREDIT_PACKAGES } = require('../config/stripe');
const logger = require('../config/logger');

const router = express.Router();

// Get credit balance
router.get('/balance', authenticate, async (req, res, next) => {
  try {
    const credits = await Credit.getBalance(req.user.id);
    
    res.json({
      balance: credits.balance,
      lastUpdated: credits.updated_at,
    });
  } catch (error) {
    next(error);
  }
});

// Get credit history
router.get('/history', authenticate, async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const history = await Credit.getHistory(req.user.id, limit);
    
    res.json({
      transactions: history,
      count: history.length,
    });
  } catch (error) {
    next(error);
  }
});

// Purchase credits
router.post('/purchase', authenticate, validate(schemas.purchaseCredits), async (req, res, next) => {
  try {
    const { packageId } = req.body;
    
    const package_ = CREDIT_PACKAGES[packageId];
    if (!package_) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid package ID',
      });
    }

    // Get or create Stripe customer
    const customer = await getOrCreateCustomer(
      req.user.id,
      req.user.email,
      req.user.name
    );

    // Create payment intent
    const paymentIntent = await createPaymentIntent(customer.id, packageId);

    logger.info('Credit purchase initiated:', {
      userId: req.user.id,
      packageId,
      amount: package_.amount,
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: package_.amount / 100,
      credits: package_.credits + package_.bonus,
    });
  } catch (error) {
    next(error);
  }
});

// Track usage and deduct credits
router.post('/usage/track', authenticate, validate(schemas.trackUsage), async (req, res, next) => {
  try {
    const { workflowId, resourceType, amount } = req.body;
    
    // Calculate credit cost
    const costPerUnit = {
      workflow_execution: 1,
      node_execution: 0.1,
      api_call_openai: 2,
      api_call_anthropic: 3,
      api_call_google: 2,
      storage_mb: 0.01,
    };
    
    const creditCost = (costPerUnit[resourceType] || 1) * amount;
    
    // Deduct credits
    try {
      const newBalance = await Credit.deductCredits(
        req.user.id,
        creditCost,
        `${resourceType}:${workflowId}`
      );
      
      logger.info('Usage tracked:', {
        userId: req.user.id,
        workflowId,
        resourceType,
        creditsCharged: creditCost,
      });
      
      res.json({
        success: true,
        creditsCharged: creditCost,
        remainingBalance: newBalance,
      });
    } catch (error) {
      if (error.message === 'Insufficient credits') {
        return res.status(402).json({
          error: 'Payment Required',
          message: 'Insufficient credits',
          creditsNeeded: creditCost,
        });
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
