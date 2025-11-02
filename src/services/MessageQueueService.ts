import * as amqp from 'amqplib';
import { env } from '../config/env';

// Tipagem relaxada para evitar conflitos locais
type Connection = any;
type Channel = any;

export class MessageQueueService {
  private static instance: MessageQueueService;
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private isConnecting = false;

  private constructor() {}

  static getInstance(): MessageQueueService {
    if (!MessageQueueService.instance) {
      MessageQueueService.instance = new MessageQueueService();
    }
    return MessageQueueService.instance;
  }

  private async ensureConnection(): Promise<Connection> {
    if (this.connection) return this.connection;
    if (this.isConnecting) {
      await new Promise(r => setTimeout(r, 100));
      return this.ensureConnection();
    }
    this.isConnecting = true;
    try {
      const conn = await amqp.connect(env.rabbitUri);
      this.connection = conn;

      conn.on('close', () => {
        this.connection = null;
        this.channel = null;
        this.isConnecting = false;
      });

      conn.on('error', (err: any) => {
        console.error('[MQ] Erro de conexão:', err);
        this.connection = null;
        this.channel = null;
        this.isConnecting = false;
      });

      return conn;
    } catch (error) {
      this.isConnecting = false;
      throw error;
    }
  }

  private async ensureChannel(): Promise<Channel> {
    if (this.channel) return this.channel;
    const conn = await this.ensureConnection();
    const ch = await conn.createChannel();

    await ch.assertQueue('clientes', { durable: true });

    this.channel = ch;

    ch.on('close', () => {
      this.channel = null;
    });

    ch.on('error', (err: Error) => {
      console.error('[MQ] Erro no channel:', err);
      this.channel = null;
    });

    return ch;
  }

  // retry exponencial para estabilizar na subida do RabbitMQ
  private async connectWithRetry(max = 10, baseMs = 500): Promise<void> {
    let attempt = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        await this.ensureChannel();
        return;
      } catch (err) {
        attempt++;
        if (attempt >= max) throw err;
        const wait = Math.min(5000, baseMs * Math.pow(2, attempt));
        console.error(`[MQ] retry ${attempt}/${max} em ${wait}ms`, err);
        await new Promise(r => setTimeout(r, wait));
      }
    }
  }

  async publish(queue: string, payload: unknown): Promise<boolean> {
    try {
      const ch = await this.ensureChannel();
      const data = Buffer.from(
        typeof payload === 'string' ? payload : JSON.stringify(payload)
      );
      return ch.sendToQueue(queue, data, {
        persistent: true,
        contentType: 'application/json',
      });
    } catch (error) {
      console.error('[MQ] Erro ao publicar:', error);
      throw error;
    }
  }

  async produceMessage(queue: string, payload: unknown): Promise<void> {
    const ok = await this.publish(queue, payload);
    if (!ok) throw new Error('Falha ao publicar mensagem');
  }

  async consume(
    queue: string,
    handler: (msg: unknown) => Promise<void> | void
  ): Promise<void> {
    await this.connectWithRetry(); // estabiliza antes de consumir
    const ch = await this.ensureChannel();

    await ch.consume(
      queue,
      async (msg: amqp.ConsumeMessage | null) => {
        if (!msg) return;
        try {
          const content = msg.content.toString();
          const parsed = tryParseJSON(content);
          await handler(parsed ?? content);
          ch.ack(msg);
        } catch (err) {
          console.error('[MQ] Erro ao processar mensagem:', err);
          ch.nack(msg, false, false); // descarta
        }
      },
      { noAck: false }
    );

    console.log(`[MQ] Consumindo da fila: ${queue}`);
  }

  async disconnect(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
        this.channel = null;
      }
    } catch (error) {
      console.error('[MQ] Erro ao fechar channel:', error);
    }

    try {
      if (this.connection) {
        await this.connection.close();
        this.connection = null;
      }
    } catch (error) {
      console.error('[MQ] Erro ao fechar connection:', error);
    }

    this.isConnecting = false;
  }

  isConnected(): boolean {
    return this.connection !== null && this.channel !== null;
  }
}

function tryParseJSON(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return s;
  }
}
