const express = require('express');
const User = require('../models/User');
const Credit = require('../models/Credit');
const Subscription = require('../models/Subscription');
const Workflow = require('../models/Workflow');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { query } = require('../config/database');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// Get dashboard stats
router.get('/stats', async (req, res, next) => {
  try {
    const [userCount, workflowCount, subscriptionCounts, creditsSold, mrr] = await Promise.all([
      User.count(),
      Workflow.count(),
      Subscription.getCountsByTier(),
      Credit.getTotalSold(),
      Subscription.calculateMRR(),
    ]);

    // Get new users this month
    const newUsersResult = await query(
      `SELECT COUNT(*) as count FROM users
       WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)`
    );
    const newUsersThisMonth = parseInt(newUsersResult.rows[0].count);

    // Calculate total revenue (approximate)
    const totalRevenue = mrr * 12 + (creditsSold * 0.01); // Assuming average credit price

    res.json({
      users: {
        total: userCount,
        newThisMonth: newUsersThisMonth,
      },
      workflows: {
        total: workflowCount,
      },
      subscriptions: {
        counts: subscriptionCounts,
        mrr,
      },
      credits: {
        totalSold: creditsSold,
      },
      revenue: {
        total: totalRevenue,
        mrr,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get users list
router.get('/users', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const users = await User.findAll(limit, offset);
    const total = await User.count();

    res.json({
      users,
      total,
      limit,
      offset,
    });
  } catch (error) {
    next(error);
  }
});

// Get user details
router.get('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
    }

    const [subscription, credits, workflows] = await Promise.all([
      Subscription.findByUserId(user.id),
      Credit.getBalance(user.id),
      Workflow.findByUserId(user.id, 10, 0),
    ]);

    res.json({
      user,
      subscription,
      credits,
      workflows: workflows.length,
    });
  } catch (error) {
    next(error);
  }
});

// Get recent transactions
router.get('/transactions', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    const result = await query(
      `SELECT 
        ct.id,
        ct.type,
        ct.amount,
        ct.source,
        ct.reason,
        ct.created_at,
        u.email as user_email
       FROM credit_transactions ct
       JOIN users u ON ct.user_id = u.id
       ORDER BY ct.created_at DESC
       LIMIT $1`,
      [limit]
    );

    res.json({
      transactions: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    next(error);
  }
});

// Get analytics data
router.get('/analytics', async (req, res, next) => {
  try {
    const period = req.query.period || 'month'; // day, week, month, year

    let dateFilter = 'DATE_TRUNC(\'month\', CURRENT_DATE)';
    if (period === 'day') dateFilter = 'CURRENT_DATE';
    if (period === 'week') dateFilter = 'DATE_TRUNC(\'week\', CURRENT_DATE)';
    if (period === 'year') dateFilter = 'DATE_TRUNC(\'year\', CURRENT_DATE)';

    // Revenue by day
    const revenueResult = await query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as transactions,
        SUM(amount) as total_credits
       FROM credit_transactions
       WHERE type = 'credit' AND source LIKE 'purchase%'
       AND created_at >= ${dateFilter}
       GROUP BY DATE(created_at)
       ORDER BY date DESC`
    );

    // User signups by day
    const signupsResult = await query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as signups
       FROM users
       WHERE created_at >= ${dateFilter}
       GROUP BY DATE(created_at)
       ORDER BY date DESC`
    );

    res.json({
      period,
      revenue: revenueResult.rows,
      signups: signupsResult.rows,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
