import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export interface AppConfig {
  nodeEnv: string;
  port: number;
  corsOrigin: string | string[];
  apiPrefix: string;
  appName: string;
  appVersion: string;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
  maxConnections: number;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  ttl: number;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
}

export interface SecurityConfig {
  bcryptSaltRounds: number;
  rateLimit: {
    ttl: number;
    limit: number;
  };
  sessionSecret: string;
}

export interface EmailConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}

export interface AwsConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  s3Bucket: string;
  s3Endpoint?: string;
}

export interface StripeConfig {
  secretKey: string;
  webhookSecret: string;
  publishableKey: string;
}

export interface AppConfigType {
  app: AppConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
  jwt: JwtConfig;
  security: SecurityConfig;
  email?: EmailConfig;
  aws?: AwsConfig;
  stripe?: StripeConfig;
}

// FIXED VERSION - Added comma and kept interfaces optional
export default registerAs(
  'config',
  (): AppConfigType => ({
    app: {
      nodeEnv: process.env.NODE_ENV || 'development',
      port: parseInt(process.env.PORT || '3000', 10),
      corsOrigin: process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',')
        : ['http://localhost:3000', 'http://localhost:5173'],
      apiPrefix: process.env.API_PREFIX || 'api',
      appName: process.env.APP_NAME || 'E-commerce API',
      appVersion: process.env.APP_VERSION || '1.0.0',
    },

    database: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'ecommerce_db',
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      logging: process.env.DB_LOGGING === 'true',
      maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10', 10),
    },

    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD,
      ttl: parseInt(process.env.REDIS_TTL || '300', 10),
    },

    jwt: {
      secret:
        process.env.JWT_SECRET ||
        'your-super-secret-jwt-key-change-in-production',
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      refreshSecret:
        process.env.JWT_REFRESH_SECRET ||
        'your-super-secret-refresh-key-change-in-production',
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    },

    security: {
      bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
      rateLimit: {
        ttl: parseInt(process.env.RATE_LIMIT_TTL || '60', 10),
        limit: parseInt(process.env.RATE_LIMIT_LIMIT || '100', 10),
      },
      sessionSecret:
        process.env.SESSION_SECRET ||
        'your-session-secret-change-in-production',
    }, // FIX: Added missing comma here

    // Optional configurations - comment them out completely or make them optional
    // email: {
    //   host: process.env.SMTP_HOST || 'smtp.gmail.com',
    //   port: parseInt(process.env.SMTP_PORT || '587', 10),
    //   user: process.env.SMTP_USER || '',
    //   pass: process.env.SMTP_PASS || '',
    //   from: process.env.EMAIL_FROM || 'noreply@ecommerce.com',
    // },

    // aws: {
    //   accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    //   region: process.env.AWS_REGION || 'us-east-1',
    //   s3Bucket: process.env.S3_BUCKET_NAME || 'ecommerce-uploads',
    //   s3Endpoint: process.env.S3_ENDPOINT,
    // },

    // stripe: {
    //   secretKey: process.env.STRIPE_SECRET_KEY || '',
    //   webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    //   publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    // },
  }),
);

// Validation Schema - Simplified version
export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  CORS_ORIGIN: Joi.string(),
  API_PREFIX: Joi.string().default('api'),
  APP_NAME: Joi.string().default('E-commerce API'),
  APP_VERSION: Joi.string().default('1.0.0'),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_SYNCHRONIZE: Joi.boolean().default(false),
  DB_LOGGING: Joi.boolean().default(true),
  DB_MAX_CONNECTIONS: Joi.number().default(10),

  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().optional(),
  REDIS_TTL: Joi.number().default(300),

  JWT_SECRET: Joi.string().required().min(32),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  JWT_REFRESH_SECRET: Joi.string().required().min(32),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('30d'),

  BCRYPT_SALT_ROUNDS: Joi.number().default(10),
  RATE_LIMIT_TTL: Joi.number().default(60),
  RATE_LIMIT_LIMIT: Joi.number().default(100),
  SESSION_SECRET: Joi.string().required().min(32),
});
