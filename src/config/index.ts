import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(val => parseInt(val, 10)).default('3000'),
  HOST: z.string().default('0.0.0.0'),
  
  POSTGRES_HOST: z.string().default('localhost'),
  POSTGRES_PORT: z.string().transform(val => parseInt(val, 10)).default('5432'),
  POSTGRES_DB: z.string().default('amrutam_telemedicine'),
  POSTGRES_USER: z.string().default('postgres'),
  POSTGRES_PASSWORD: z.string().default('postgres_password_secure'),
  POSTGRES_MAX_CONNECTIONS: z.string().transform(val => parseInt(val, 10)).default('20'),
  
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().transform(val => parseInt(val, 10)).default('6379'),
  REDIS_PASSWORD: z.string().optional().default(''),
  
  JWT_SECRET: z.string().default('super_secret_jwt_key_amrutam_production_2026_change_me'),
  JWT_EXPIRES_IN: z.string().default('1h'),
  REFRESH_TOKEN_SECRET: z.string().default('super_secret_refresh_token_key_amrutam_2026'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
  
  // 32-byte (64 hex characters) key for AES-256-GCM
  ENCRYPTION_KEY: z.string().default('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'),
  
  MFA_APP_NAME: z.string().default('Amrutam Telemedicine'),
  RATE_LIMIT_WINDOW_MS: z.string().transform(val => parseInt(val, 10)).default('60000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(val => parseInt(val, 10)).default('100'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const config = parsed.data;
