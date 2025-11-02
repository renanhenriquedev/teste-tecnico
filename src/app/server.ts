import { buildApp } from './index';
import { connectMongo } from '../infra/db/mongoose';
import { MessageQueueService } from '../services/MessageQueueService';
import { startClientCreatedConsumer } from '../consumers/ClientCreatedConsumer';

const app = buildApp();
const PORT = Number(process.env.PORT ?? 3000);

connectMongo().then(() => {
  app.listen(PORT, async () => {
    console.log(`Server running at http://localhost:${PORT}`);
    await startClientCreatedConsumer();
    const mq = MessageQueueService.getInstance();
    const start = () =>
      mq.consume('clientes', async (msg) => console.log('[MQ] Novo cliente recebido:', msg))
      .catch(err => console.error('[MQ] falha ao iniciar consumo (retry interno cuidará):', err));
    start();
  });
}).catch((err) => console.error('Error starting the server:', err));
