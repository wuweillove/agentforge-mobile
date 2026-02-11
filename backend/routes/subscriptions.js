const express = require('express');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const {
  getOrCreateCustomer,
  createSubscription,
  updateSubscription,
  cancelSubscription,
  PRICE_IDS,
} = require('../config/stripe');
const logger = require('../config/logger');

const router = express.Router();

// Subscription limits
const SUBSCRIPTION_LIMITS = {
  free: {
    maxWorkflows: 3,
    maxNodes: 10,
    apiCallsPerMonth: 100,
    storageMB: 100,
  },
  premium: {
    maxWorkflows: -1, // unlimited
    maxNodes: 50,
    apiCallsPerMonth: 10000,
    storageMB: 10240,
  },
  enterprise: {
    maxWorkflows: -1,
    maxNodes: -1,
    apiCallsPerMonth: -1,
    storageMB: 102400,
  },
};

// Get current subscription
router.get('/current', authenticate, async (req, res, next) => {
  try {
    const subscription = await Subscription.findByUserId(req.user.id);
    
    const tier = req.user.subscription_tier || 'free';
    const limits = SUBSCRIPTION_LIMITS[tier];
    
    if (!subscription) {
      return res.json({
        tier,
        status: 'active',
        limits,
      });
    }
    
    res.json({
      tier: subscription.tier,
      status: subscription.status,
      currentPeriodStart: subscription.current_period_start,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      limits,
    });
  } catch (error) {
    next(error);
  }
});

// Create subscription
router.post('/create', authenticate, validate(schemas.createSubscription), async (req, res, next) => {
  try {
    const { priceId, paymentMethodId } = req.body;
    
    // Determine tier from price ID
    let tier = 'premium';
    if (priceId === PRICE_IDS.enterprise) {
      tier = 'enterprise';
    }
    
    // Get or create Stripe customer
    const customer = await getOrCreateCustomer(
      req.user.id,
      req.user.email,
      req.user.name
    );
    
    // Update user's Stripe customer ID
    await User.updateStripeCustomer(req.user.id, customer.id);
    
    // Create Stripe subscription
    const stripeSubscription = await createSubscription(
      customer.id,
      priceId,
      paymentMethodId
    );
    
    // Save to database
    const subscription = await Subscription.create({
      userId: req.user.id,
      stripeSubscriptionId: stripeSubscription.id,
      tier,
      status: stripeSubscription.status,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
    });
    
    logger.info('Subscription created:', {
      userId: req.user.id,
      tier,
      subscriptionId: stripeSubscription.id,
    });
    
    res.status(201).json({
      subscription: {
        tier: subscription.tier,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
      },
      clientSecret: stripeSubscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (error) {
    next(error);
  }
});

// Update subscription
router.put('/update', authenticate, validate(schemas.updateSubscription), async (req, res, next) => {
  try {
    const { priceId } = req.body;
    
    const subscription = await Subscription.findByUserId(req.user.id);
    
    if (!subscription) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'No active subscription found',
      });
    }
    
    // Determine new tier
    let tier = 'premium';
    if (priceId === PRICE_IDS.enterprise) {
      tier = 'enterprise';
    }
    
    // Update Stripe subscription
    const stripeSubscription = await updateSubscription(
      subscription.stripe_subscription_id,
      priceId
    );
    
    // Update database
    const updatedSubscription = await Subscription.update(subscription.id, {
      tier,
      status: stripeSubscription.status,
    });
    
    logger.info('Subscription updated:', {
      userId: req.user.id,
      oldTier: subscription.tier,
      newTier: tier,
    });
    
    res.json({
      subscription: {
        tier: updatedSubscription.tier,
        status: updatedSubscription.status,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Cancel subscription
router.post('/cancel', authenticate, async (req, res, next) => {
  try {
    const subscription = await Subscription.findByUserId(req.user.id);
    
    if (!subscription) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'No active subscription found',
      });
    }
    
    // Cancel at period end
    await cancelSubscription(subscription.stripe_subscription_id, false);
    
    // Update database
    await Subscription.update(subscription.id, {
      cancel_at_period_end: true,
    });
    
    logger.info('Subscription canceled:', {
      userId: req.user.id,
      subscriptionId: subscription.id,
    });
    
    res.json({
      message: 'Subscription will be canceled at the end of the current period',
      endsAt: subscription.current_period_end,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
