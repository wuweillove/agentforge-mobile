import request from 'supertest';
import app from '../../server';
import { prisma } from '../../utils/prisma';
import { generateAccessToken } from '../../utils/jwt';
import { hashPassword } from '../../utils/encryption';

describe('Credit Controller', () => {
  let token: string;
  let userId: string;

  beforeEach(async () => {
    const password = await hashPassword('Test123!@#');
    
    const user = await prisma.user.create({
      data: {
        email: 'credit@example.com',
        password,
        name: 'Credit Test',
      },
    });

    userId = user.id;

    // Create credit account
    await prisma.credit.create({
      data: {
        userId: user.id,
        balance: 500,
      },
    });

    token = generateAccessToken(user.id);
  });

  describe('GET /api/credits/balance', () => {
    it('should return credit balance', async () => {
      const response = await request(app)
        .get('/api/credits/balance')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.balance).toBe(500);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/credits/balance');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/credits/history', () => {
    beforeEach(async () => {
      await prisma.creditTransaction.create({
        data: {
          userId,
          type: 'CREDIT',
          amount: 100,
          balanceAfter: 100,
          source: 'purchase_pack_100',
        },
      });

      await prisma.creditTransaction.create({
        data: {
          userId,
          type: 'DEBIT',
          amount: 10,
          balanceAfter: 90,
          reason: 'workflow_execution',
        },
      });
    });

    it('should return transaction history', async () => {
      const response = await request(app)
        .get('/api/credits/history')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.transactions).toHaveLength(2);
    });

    it('should respect limit parameter', async () => {
      const response = await request(app)
        .get('/api/credits/history?limit=1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.transactions).toHaveLength(1);
    });
  });

  describe('POST /api/credits/usage/track', () => {
    it('should track usage and deduct credits', async () => {
      const response = await request(app)
        .post('/api/credits/usage/track')
        .set('Authorization', `Bearer ${token}`)
        .send({
          workflowId: 'test-workflow',
          resourceType: 'workflow_execution',
          amount: 1,
        });

      expect(response.status).toBe(200);
      expect(response.body.data.creditsCharged).toBe(1);
      expect(response.body.data.remainingBalance).toBe(499);
    });

    it('should return 402 with insufficient credits', async () => {
      // Set balance to 0
      await prisma.credit.update({
        where: { userId },
        data: { balance: 0 },
      });

      const response = await request(app)
        .post('/api/credits/usage/track')
        .set('Authorization', `Bearer ${token}`)
        .send({
          workflowId: 'test-workflow',
          resourceType: 'workflow_execution',
          amount: 1,
        });

      expect(response.status).toBe(402);
    });
  });
});
