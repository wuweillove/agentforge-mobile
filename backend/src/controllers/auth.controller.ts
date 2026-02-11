import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../utils/prisma';
import { hashPassword, comparePassword } from '../utils/encryption';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

class AuthController {
  async register(req: AuthRequest, res: Response) {
    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('User already exists', 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        subscriptionTier: 'FREE',
      },
      select: {
        id: true,
        email: true,
        name: true,
        subscriptionTier: true,
        createdAt: true,
      },
    });

    // Create default credit account
    await prisma.credit.create({
      data: {
        userId: user.id,
        balance: 0,
      },
    });

    // Create default subscription
    await prisma.subscription.create({
      data: {
        userId: user.id,
        tier: 'FREE',
        status: 'ACTIVE',
      },
    });

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    logger.info(`User registered: ${email}`);

    res.status(201).json({
      success: true,
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  }

  async login(req: AuthRequest, res: Response) {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          subscriptionTier: user.subscriptionTier,
        },
        accessToken,
        refreshToken,
      },
    });
  }

  async refreshToken(req: AuthRequest, res: Response) {
    const { refreshToken } = req.body;

    try {
      const { userId } = verifyRefreshToken(refreshToken);

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const newAccessToken = generateAccessToken(user.id);
      const newRefreshToken = generateRefreshToken(user.id);

      res.json({
        success: true,
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      });
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  async getMe(req: AuthRequest, res: Response) {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: {
        subscription: true,
        credits: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        subscriptionTier: user.subscriptionTier,
        subscription: user.subscription,
        credits: user.credits,
      },
    });
  }

  async updateProfile(req: AuthRequest, res: Response) {
    const { name, avatar } = req.body;

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(name && { name }),
        ...(avatar && { avatar }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
      },
    });

    res.json({
      success: true,
      data: user,
    });
  }

  async changePassword(req: AuthRequest, res: Response) {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isValidPassword = await comparePassword(currentPassword, user.password);

    if (!isValidPassword) {
      throw new AppError('Current password is incorrect', 401);
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: req.userId },
      data: { password: hashedPassword },
    });

    logger.info(`Password changed for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  }

  async requestPasswordReset(req: AuthRequest, res: Response) {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Don't reveal if user exists
    if (!user) {
      return res.json({
        success: true,
        message: 'If the email exists, a reset link has been sent',
      });
    }

    // TODO: Send password reset email
    logger.info(`Password reset requested for: ${email}`);

    res.json({
      success: true,
      message: 'If the email exists, a reset link has been sent',
    });
  }
}

export const authController = new AuthController();
