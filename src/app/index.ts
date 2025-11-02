import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import 'express-async-errors';
import { ClienteController } from '../controllers/ClienteController';
import { ClienteUseCase } from '../use-cases/ClienteUseCases';
import { ClienteRepository } from '../repositories/ClienteRepository';
import { validateBody } from '../middlewares/validate';
import { errorHandler } from '../middlewares/error';
import { createClienteSchema, updateClienteSchema } from '../validation/cliente.schema';
import { mountSwagger } from './swagger';

export function buildApp() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  mountSwagger(app);

  const repo = new ClienteRepository();
  const use = new ClienteUseCase(repo);
  const controller = new ClienteController(use);

  app.get('/health', (_req, res) => res.json({ ok: true }));
  app.post('/clientes', validateBody(createClienteSchema), (req, res) => controller.create(req, res));
  app.put('/clientes/:id', validateBody(updateClienteSchema), (req, res) => controller.update(req, res));
  app.get('/clientes/:id', (req, res) => controller.getById(req, res));
  app.get('/clientes', (req, res) => controller.listAll(req, res));
  app.delete('/clientes/:id', (req, res) => controller.remove(req, res));


  app.use(errorHandler);
  return app;
}
