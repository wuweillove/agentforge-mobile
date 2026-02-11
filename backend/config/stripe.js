const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const logger = require('./logger');

// Price IDs from environment
const PRICE_IDS = {
  premium: process.env.STRIPE_PRICE_PREMIUM,
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE,
};

// Credit package prices (in cents)
const CREDIT_PACKAGES = {
  pack_100: { credits: 100, bonus: 0, amount: 999 },
  pack_500: { credits: 500, bonus: 50, amount: 3999 },
  pack_1000: { credits: 1000, bonus: 150, amount: 6999 },
  pack_5000: { credits: 5000, bonus: 1000, amount: 29999 },
};

// Create or retrieve customer
const getOrCreateCustomer = async (userId, email, name) => {
  try {
    // Search for existing customer
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (customers.data.length > 0) {
      return customers.data[0];
    }

    // Create new customer
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId,
      },
    });

    return customer;
  } catch (error) {
    logger.error('Stripe customer error:', error);
    throw error;
  }
};

// Create subscription
const createSubscription = async (customerId, priceId, paymentMethodId) => {
  try {
    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    return subscription;
  } catch (error) {
    logger.error('Stripe subscription error:', error);
    throw error;
  }
};

// Update subscription
const updateSubscription = async (subscriptionId, newPriceId) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    const updatedSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        items: [
          {
            id: subscription.items.data[0].id,
            price: newPriceId,
          },
        ],
        proration_behavior: 'create_prorations',
      }
    );

    return updatedSubscription;
  } catch (error) {
    logger.error('Stripe subscription update error:', error);
    throw error;
  }
};

// Cancel subscription
const cancelSubscription = async (subscriptionId, immediately = false) => {
  try {
    if (immediately) {
      return await stripe.subscriptions.cancel(subscriptionId);
    } else {
      return await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    }
  } catch (error) {
    logger.error('Stripe subscription cancel error:', error);
    throw error;
  }
};

// Create payment intent for credits
const createPaymentIntent = async (customerId, packageId) => {
  try {
    const package_ = CREDIT_PACKAGES[packageId];
    if (!package_) {
      throw new Error('Invalid package ID');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: package_.amount,
      currency: 'usd',
      customer: customerId,
      metadata: {
        packageId,
        credits: package_.credits + package_.bonus,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return paymentIntent;
  } catch (error) {
    logger.error('Stripe payment intent error:', error);
    throw error;
  }
};

// List payment methods
const listPaymentMethods = async (customerId) => {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    return paymentMethods.data;
  } catch (error) {
    logger.error('Stripe payment methods list error:', error);
    throw error;
  }
};

// Detach payment method
const detachPaymentMethod = async (paymentMethodId) => {
  try {
    return await stripe.paymentMethods.detach(paymentMethodId);
  } catch (error) {
    logger.error('Stripe payment method detach error:', error);
    throw error;
  }
};

// List invoices
const listInvoices = async (customerId, limit = 20) => {
  try {
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit,
    });

    return invoices.data;
  } catch (error) {
    logger.error('Stripe invoices list error:', error);
    throw error;
  }
};

module.exports = {
  stripe,
  PRICE_IDS,
  CREDIT_PACKAGES,
  getOrCreateCustomer,
  createSubscription,
  updateSubscription,
  cancelSubscription,
  createPaymentIntent,
  listPaymentMethods,
  detachPaymentMethod,
  listInvoices,
};
