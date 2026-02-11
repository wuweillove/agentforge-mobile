import { Router } from 'express';
import { body } from 'express-validator';
import { creditController } from '../controllers/credit.controller';
import { validate } from '../middleware/validator';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get credit balance
router.get('/balance', creditController.getBalance);

// Get credit history
router.get('/history', creditController.getHistory);

// Purchase credits
router.post(
  '/purchase',
  validate([
    body('amount').isNumeric().custom((value) => value > 0),
    body('paymentMethodId').notEmpty(),
  ]),
  creditController.purchaseCredits
);

// Track usage
router.post(
  '/usage/track',
  validate([
    body('workflowId').optional().isUUID(),
    body('resourceType').notEmpty(),
    body('amount').isNumeric(),
  ]),
  creditController.trackUsage
);

// Get usage stats
router.get('/usage/stats', creditController.getUsageStats);

export default router;
