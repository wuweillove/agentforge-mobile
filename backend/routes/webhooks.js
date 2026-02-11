const express = require('express');
const Subscription = require('../models/Subscription');
const Credit = require('../models/Credit');
const { stripe } = require('../config/stripe');
const logger = require('../config/logger');

const router = express.Router();

// Stripe webhook handler
router.post('/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    logger.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  logger.info('Stripe webhook received:', { type: event.type });

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        logger.info('Invoice payment succeeded:', event.data.object.id);
        break;

      case 'invoice.payment_failed':
        logger.error('Invoice payment failed:', event.data.object.id);
        break;

      default:
        logger.info('Unhandled webhook event:', event.type);
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('Webhook handler error:', error);
    res.status(500).send('Webhook handler failed');
  }
});

async function handleSubscriptionUpdate(subscription) {
  try {
    const existingSubscription = await Subscription.findByStripeId(
      subscription.id
    );

    if (!existingSubscription) {
      logger.warn('Subscription not found in database:', subscription.id);
      return;
    }

    // Determine tier from price ID
    let tier = 'premium';
    if (subscription.items.data[0].price.id === process.env.STRIPE_PRICE_ENTERPRISE) {
      tier = 'enterprise';
    }

    await Subscription.update(existingSubscription.id, {
      status: subscription.status,
      tier,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000),
      cancel_at_period_end: subscription.cancel_at_period_end,
    });

    logger.info('Subscription updated from webhook:', {
      subscriptionId: subscription.id,
      status: subscription.status,
    });
  } catch (error) {
    logger.error('Error handling subscription update:', error);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription) {
  try {
    const existingSubscription = await Subscription.findByStripeId(
      subscription.id
    );

    if (!existingSubscription) {
      return;
    }

    await Subscription.update(existingSubscription.id, {
      status: 'canceled',
      tier: 'free',
    });

    logger.info('Subscription deleted from webhook:', subscription.id);
  } catch (error) {
    logger.error('Error handling subscription deletion:', error);
    throw error;
  }
}

async function handlePaymentSuccess(paymentIntent) {
  try {
    // Check if this is a credit purchase
    if (paymentIntent.metadata && paymentIntent.metadata.credits) {
      const { userId, credits, packageId } = paymentIntent.metadata;

      if (userId && credits) {
        await Credit.addCredits(
          userId,
          parseInt(credits),
          `purchase_${packageId}`
        );

        logger.info('Credits added from payment:', {
          userId,
          credits,
          paymentIntentId: paymentIntent.id,
        });
      }
    }
  } catch (error) {
    logger.error('Error handling payment success:', error);
    throw error;
  }
}

async function handlePaymentFailed(paymentIntent) {
  logger.error('Payment failed:', {
    paymentIntentId: paymentIntent.id,
    error: paymentIntent.last_payment_error,
  });
  // TODO: Send email notification to user
}

module.exports = router;
