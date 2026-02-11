import { Router } from 'express';
import { body } from 'express-validator';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middleware/validator';
import { authRateLimiter } from '../middleware/rateLimiter';
import { authenticate } from '../middleware/auth';

const router = Router();

// Register
router.post(
  '/register',
  authRateLimiter,
  validate([
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('name').optional().trim(),
  ]),
  authController.register
);

// Login
router.post(
  '/login',
  authRateLimiter,
  validate([
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ]),
  authController.login
);

// Refresh token
router.post(
  '/refresh',
  validate([
    body('refreshToken').notEmpty(),
  ]),
  authController.refreshToken
);

// Get current user
router.get('/me', authenticate, authController.getMe);

// Update profile
router.put(
  '/profile',
  authenticate,
  validate([
    body('name').optional().trim(),
    body('avatar').optional().isURL(),
  ]),
  authController.updateProfile
);

// Change password
router.post(
  '/change-password',
  authenticate,
  validate([
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 8 }),
  ]),
  authController.changePassword
);

// Request password reset
router.post(
  '/reset-password',
  authRateLimiter,
  validate([
    body('email').isEmail().normalizeEmail(),
  ]),
  authController.requestPasswordReset
);

export default router;
