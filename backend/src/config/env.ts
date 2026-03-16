// Environment Configuration
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Database
  databaseUrl: process.env.DATABASE_URL!,

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',

  // Email
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    fromName: process.env.SMTP_FROM_NAME || 'RealEstateAI',
    fromEmail: process.env.SMTP_FROM_EMAIL || 'noreply@realestateai.com',
  },

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // File Upload
  maxFileSize: parseInt(process.env.MAX_FILE_UPLOAD_SIZE || '5', 10) * 1024 * 1024, // Convert MB to bytes
  uploadPath: process.env.UPLOAD_PATH || './uploads',

  // Logging
  logLevel: process.env.LOG_LEVEL || 'debug',
  logToFile: process.env.LOG_TO_FILE === 'true',
  logFilePath: process.env.LOG_FILE_PATH || 'logs/app.log',

  // Feature Flags
  features: {
    emailVerification: process.env.FEATURE_EMAIL_VERIFICATION === 'true',
    phoneVerification: process.env.FEATURE_PHONE_VERIFICATION === 'true',
    twoFactor: process.env.FEATURE_2FA === 'true',
  },
};

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export default config;
