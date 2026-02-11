import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '../../utils/jwt';

describe('JWT Utilities', () => {
  const testUserId = 'test-user-id';

  describe('generateAccessToken', () => {
    it('should generate a valid access token', () => {
      const token = generateAccessToken(testUserId);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should encode userId in token', () => {
      const token = generateAccessToken(testUserId);
      const decoded = verifyAccessToken(token);
      expect(decoded.userId).toBe(testUserId);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const token = generateRefreshToken(testUserId);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should encode userId in refresh token', () => {
      const token = generateRefreshToken(testUserId);
      const decoded = verifyRefreshToken(token);
      expect(decoded.userId).toBe(testUserId);
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify valid token', () => {
      const token = generateAccessToken(testUserId);
      const decoded = verifyAccessToken(token);
      expect(decoded.userId).toBe(testUserId);
    });

    it('should throw error for invalid token', () => {
      expect(() => {
        verifyAccessToken('invalid-token');
      }).toThrow();
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify valid refresh token', () => {
      const token = generateRefreshToken(testUserId);
      const decoded = verifyRefreshToken(token);
      expect(decoded.userId).toBe(testUserId);
    });

    it('should throw error for invalid refresh token', () => {
      expect(() => {
        verifyRefreshToken('invalid-token');
      }).toThrow();
    });
  });
});
