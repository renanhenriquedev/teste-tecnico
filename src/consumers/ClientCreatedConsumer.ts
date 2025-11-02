import { MessageQueueService } from '../services/MessageQueueService';
import { AuditModel } from '../infra/db/AuditModel';

export async function startClientCreatedConsumer() {
  const mq = MessageQueueService.getInstance();
  await mq.consume('clientes', async (msg) => {
    await AuditModel.create({ type: 'cliente.created', payload: msg });
  });
}
