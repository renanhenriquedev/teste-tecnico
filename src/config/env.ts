// src/config/env.ts
import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  PORT: z.coerce.number().int().positive().default(3000),

  MONGO_URI: z
    .string()
    .min(1)
    .default('mongodb://localhost:27017/customers'),

  REDIS_URI: z
    .string()
    .min(1)
    .default('redis://localhost:6379'),

  RABBIT_URI: z
    .string()
    .min(1)
    .default('amqp://localhost:5672'),

  REDIS_TTL_SECONDS: z.coerce.number().int().positive().default(300),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('[ENV] Invalid configuration:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = {
  port: parsed.data.PORT,
  mongoUri: parsed.data.MONGO_URI,
  redisUri: parsed.data.REDIS_URI,
  rabbitUri: parsed.data.RABBIT_URI,
  redisTTL: parsed.data.REDIS_TTL_SECONDS,
  nodeEnv: parsed.data.NODE_ENV,
} as const;
