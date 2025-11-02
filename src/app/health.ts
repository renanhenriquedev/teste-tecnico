// src/app/health.ts
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { CacheService } from '../services/CacheService';
import { MessageQueueService } from '../services/MessageQueueService';

export function liveness(_req: Request, res: Response) {
  res.status(200).json({ status: 'ok' });
}

export async function readiness(_req: Request, res: Response) {
  const checks: Record<string, { ok: boolean; detail?: string }> = {};

  // Mongo
  const mongoOk = mongoose.connection.readyState === 1; // 1 = connected
  checks.mongo = { ok: mongoOk, detail: mongoOk ? 'connected' : 'not-connected' };

  // Redis
  const redisOk = await CacheService.getInstance().ping();
  checks.redis = { ok: redisOk, detail: redisOk ? 'pong' : 'no-pong' };

  // RabbitMQ
  const mqOk = MessageQueueService.getInstance().isConnected();
  checks.rabbit = { ok: mqOk, detail: mqOk ? 'connected' : 'not-connected' };

  const allOk = Object.values(checks).every(c => c.ok);
  const code = allOk ? 200 : 503;
  res.status(code).json({ allOk, checks });
}
