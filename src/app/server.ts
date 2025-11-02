// /src/app/server.ts
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import 'express-async-errors';
import { connectMongo } from '../infra/db/mongoose';
import { ClienteController } from '../controllers/ClienteController';
import { ClienteUseCase } from '../use-cases/ClienteUseCases';
import { ClienteRepository } from '../repositories/ClienteRepository';
import { MessageQueueService } from '../services/MessageQueueService';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

const clienteRepository = new ClienteRepository();
const messageQueueService = MessageQueueService.getInstance();
const clienteUseCase = new ClienteUseCase(clienteRepository, messageQueueService);
const clienteController = new ClienteController(clienteUseCase);

app.get('/health', (_req, res) => res.json({ ok: true }));

// Endpoint para criar cliente
app.post('/clientes', (req, res) => clienteController.create(req, res));

const PORT = Number(process.env.PORT ?? 3000);

connectMongo()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);

      const mq = MessageQueueService.getInstance();
      mq.consume('clientes', async (msg) => {
        console.log('[MQ] Novo cliente recebido:', msg);
      });
    });
  })
  .catch((err) => {
    console.error('Error starting the server:', err);
  });