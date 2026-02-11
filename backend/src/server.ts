import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { config } from './config';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';

// Routes
import authRoutes from './routes/auth.routes';
import creditRoutes from './routes/credit.routes';
import subscriptionRoutes from './routes/subscription.routes';
import workflowRoutes from './routes/workflow.routes';
import executionRoutes from './routes/execution.routes';
import adminRoutes from './routes/admin.routes';
import webhookRoutes from './routes/webhook.routes';
import healthRoutes from './routes/health.routes';

const app: Express = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// CORS
app.use(cors({
  origin: config.corsOrigin.split(','),
  credentials: true,
}));

// Body parsing (except for webhooks)
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(rateLimiter);

// Health check (no auth required)
app.use('/health', healthRoutes);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/credits', creditRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/executions', executionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/webhooks', webhookRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`🚀 AgentForge API server running on port ${PORT}`);
  logger.info(`📝 Environment: ${config.nodeEnv}`);
  logger.info(`🔗 API URL: ${config.apiUrl}`);
});

export default app;
