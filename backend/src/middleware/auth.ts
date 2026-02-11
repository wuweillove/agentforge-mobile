import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { prisma } from '../utils/prisma';
import { AppError } from '../utils/errors';

export interface AuthRequest extends Request {
  userId?: string;
  user?: any;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          subscriptionTier: true,
          emailVerified: true,
        },
      });

      if (!user) {
        throw new AppError('User not found', 401);
      }

      req.userId = user.id;
      req.user = user;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Invalid token', 401);
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Token expired', 401);
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    // Check if user is admin (you can add admin field to User model)
    // For now, check if email is admin email
    const adminEmails = ['admin@agentforge.io'];
    
    if (!adminEmails.includes(req.user.email)) {
      throw new AppError('Admin access required', 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const requireSubscription = (minTier: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const tierHierarchy = ['FREE', 'PREMIUM', 'ENTERPRISE'];
      const userTierIndex = tierHierarchy.indexOf(req.user.subscriptionTier);
      const requiredTierIndex = tierHierarchy.indexOf(minTier);

      if (userTierIndex < requiredTierIndex) {
        throw new AppError(`This feature requires ${minTier} subscription`, 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
