import { z } from 'zod';

const schema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  MONGO_URI: z.string().url().or(z.string().startsWith('mongodb://')),
  REDIS_URI: z.string().url().or(z.string().startsWith('redis://')),
  RABBIT_URI: z.string().url().or(z.string().startsWith('amqp://')),
  NODE_ENV: z.enum(['development','test','production']).default('development')
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('[ENV] invalid configuration:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const cfg = parsed.data;
