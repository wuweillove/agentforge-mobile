import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  
  // Database
  databaseUrl: process.env.DATABASE_URL!,
  
  // Redis
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET!,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  
  // Stripe
  stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  stripePricePremium: process.env.STRIPE_PRICE_PREMIUM!,
  stripePriceEnterprise: process.env.STRIPE_PRICE_ENTERPRISE!,
  
  // OpenClaw
  openclawApiUrl: process.env.OPENCLAW_API_URL!,
  openclawApiKey: process.env.OPENCLAW_API_KEY!,
  
  // AWS
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  awsRegion: process.env.AWS_REGION || 'us-east-1',
  awsS3Bucket: process.env.AWS_S3_BUCKET!,
  
  // Email
  smtpHost: process.env.SMTP_HOST!,
  smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
  smtpUser: process.env.SMTP_USER!,
  smtpPassword: process.env.SMTP_PASSWORD!,
  emailFrom: process.env.EMAIL_FROM || 'noreply@agentforge.io',
  
  // Security
  encryptionKey: process.env.ENCRYPTION_KEY!,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:19006',
  
  // Rate Limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
};

// Validate required config
const requiredConfig = [
  'jwtSecret',
  'jwtRefreshSecret',
  'databaseUrl',
  'stripeSecretKey',
  'stripeWebhookSecret',
];

requiredConfig.forEach((key) => {
  if (!config[key as keyof typeof config]) {
    throw new Error(`Missing required config: ${key}`);
  }
});
