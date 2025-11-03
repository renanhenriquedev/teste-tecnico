import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import 'express-async-errors';
import { liveness, readiness } from './health';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { ClienteController } from '../controllers/ClienteController';
import { ClienteUseCase } from '../use-cases/ClienteUseCases';
import { ClienteRepository } from '../repositories/ClienteRepository';
import { validateBody } from '../middlewares/validate';
import { errorHandler } from '../middlewares/error';
import { createClienteSchema, updateClienteSchema } from '../validation/cliente.schema';
import { mountSwagger } from './swagger';


export function buildApp() {
  dotenv.config();
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan('combined'));
  app.use(rateLimit({ windowMs: 60_000, max: 120 }));

  mountSwagger(app);

  const repo = new ClienteRepository();
  const use = new ClienteUseCase(repo);
  const controller = new ClienteController(use);

  app.get('/health', liveness);
  app.get('/ready', readiness);
  app.post('/clientes', validateBody(createClienteSchema), (req, res) => controller.create(req, res));
  app.put('/clientes/:id', validateBody(updateClienteSchema), (req, res) => controller.update(req, res));
  app.get('/clientes/:id', (req, res) => controller.getById(req, res));
  app.get('/clientes', (req, res) => controller.listAll(req, res));
  app.delete('/clientes/:id', (req, res) => controller.remove(req, res));


  app.use(errorHandler);
  return app;
}
