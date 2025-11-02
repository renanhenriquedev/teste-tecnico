export const env = {
  port: Number(process.env.PORT ?? 3000),
  mongoUri: process.env.MONGO_URI ?? 'mongodb://localhost:27017/customers',
  redisUri: process.env.REDIS_URI ?? 'redis://localhost:6379',
  rabbitUri: process.env.RABBIT_URI ?? 'amqp://localhost:5672',
  redisTTL: Number(process.env.REDIS_TTL_SECONDS ?? 300),
} as const;
