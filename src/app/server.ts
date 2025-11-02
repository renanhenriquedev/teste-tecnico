import { buildApp } from './index';
import { connectMongo } from '../infra/db/mongoose';
import { MessageQueueService } from '../services/MessageQueueService';

const app = buildApp();
const PORT = Number(process.env.PORT ?? 3000);

connectMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    const mq = MessageQueueService.getInstance();
    mq.consume('clientes', async (msg) => console.log('[MQ] Novo cliente recebido:', msg));
  });
}).catch((err) => console.error('Error starting the server:', err));
