import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../utils/prisma';
import { AppError } from '../utils/errors';
import Stripe from 'stripe';
import { config } from '../config';
import { logger } from '../utils/logger';

const stripe = new Stripe(config.stripeSecretKey, {
  apiVersion: '2023-10-16',
});

const CREDIT_PACKAGES = [
  { id: 'pack_100', credits: 100, price: 9.99, bonus: 0 },
  { id: 'pack_500', credits: 500, price: 39.99, bonus: 50 },
  { id: 'pack_1000', credits: 1000, price: 69.99, bonus: 150 },
  { id: 'pack_5000', credits: 5000, price: 299.99, bonus: 1000 },
];

const CREDIT_COSTS: Record<string, number> = {
  workflow_execution: 1,
  node_execution: 0.1,
  api_call_openai: 2,
  api_call_anthropic: 3,
  api_call_google: 2,
  storage_mb: 0.01,
};

class CreditController {
  async getBalance(req: AuthRequest, res: Response) {
    const credit = await prisma.credit.findUnique({
      where: { userId: req.userId },
    });

    res.json({
      success: true,
      data: {
        balance: credit?.balance || 0,
        lastUpdated: credit?.updatedAt,
      },
    });
  }

  async getHistory(req: AuthRequest, res: Response) {
    const { limit = 50, offset = 0 } = req.query;

    const transactions = await prisma.creditTransaction.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      skip: Number(offset),
    });

    const total = await prisma.creditTransaction.count({
      where: { userId: req.userId },
    });

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          total,
          limit: Number(limit),
          offset: Number(offset),
        },
      },
    });
  }

  async purchaseCredits(req: AuthRequest, res: Response) {
    const { amount, paymentMethodId } = req.body;

    // Find matching package
    const package_ = CREDIT_PACKAGES.find(p => p.price === amount);

    if (!package_) {
      throw new AppError('Invalid package', 400);
    }

    // Get or create Stripe customer
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    let customerId = user?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user?.email,
        metadata: { userId: req.userId! },
      });

      customerId = customer.id;

      await prisma.user.update({
        where: { id: req.userId },
        data: { stripeCustomerId: customerId },
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      customer: customerId,
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
      metadata: {
        userId: req.userId!,
        package: package_.id,
        credits: package_.credits + package_.bonus,
      },
    });

    if (paymentIntent.status === 'succeeded') {
      const totalCredits = package_.credits + package_.bonus;

      // Update credit balance
      const credit = await prisma.credit.update({
        where: { userId: req.userId },
        data: {
          balance: {
            increment: totalCredits,
          },
        },
      });

      // Create transaction record
      await prisma.creditTransaction.create({
        data: {
          userId: req.userId!,
          type: 'CREDIT',
          amount: totalCredits,
          balanceAfter: credit.balance,
          source: `purchase_${package_.id}`,
          stripePaymentId: paymentIntent.id,
        },
      });

      logger.info(`Credits purchased: ${totalCredits} for user ${req.userId}`);

      return res.json({
        success: true,
        data: {
          status: 'succeeded',
          credits: totalCredits,
          transactionId: paymentIntent.id,
          balance: credit.balance,
        },
      });
    }

    throw new AppError('Payment failed', 400);
  }

  async trackUsage(req: AuthRequest, res: Response) {
    const { workflowId, resourceType, amount } = req.body;

    const cost = CREDIT_COSTS[resourceType] || 0;
    const totalCost = cost * (amount || 1);

    // Get current balance
    const credit = await prisma.credit.findUnique({
      where: { userId: req.userId },
    });

    if (!credit || credit.balance < totalCost) {
      throw new AppError('Insufficient credits', 402);
    }

    // Deduct credits
    const updatedCredit = await prisma.credit.update({
      where: { userId: req.userId },
      data: {
        balance: {
          decrement: totalCost,
        },
      },
    });

    // Create transaction
    await prisma.creditTransaction.create({
      data: {
        userId: req.userId!,
        type: 'DEBIT',
        amount: totalCost,
        balanceAfter: updatedCredit.balance,
        reason: resourceType,
      },
    });

    // Create usage log
    await prisma.usageLog.create({
      data: {
        userId: req.userId!,
        workflowId,
        resourceType,
        amount,
        creditsCharged: totalCost,
      },
    });

    res.json({
      success: true,
      data: {
        creditsCharged: totalCost,
        remainingBalance: updatedCredit.balance,
      },
    });
  }

  async getUsageStats(req: AuthRequest, res: Response) {
    const { period = 'month' } = req.query;

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'day':
        startDate = new Date(now.setDate(now.getDate() - 1));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
    }

    const usageLogs = await prisma.usageLog.findMany({
      where: {
        userId: req.userId,
        createdAt: {
          gte: startDate,
        },
      },
    });

    const stats = usageLogs.reduce((acc, log) => {
      if (!acc[log.resourceType]) {
        acc[log.resourceType] = {
          count: 0,
          totalCredits: 0,
        };
      }
      acc[log.resourceType].count += log.amount;
      acc[log.resourceType].totalCredits += log.creditsCharged;
      return acc;
    }, {} as Record<string, { count: number; totalCredits: number }>);

    res.json({
      success: true,
      data: {
        period,
        stats,
        totalCreditsUsed: Object.values(stats).reduce((sum, s) => sum + s.totalCredits, 0),
      },
    });
  }
}

export const creditController = new CreditController();
