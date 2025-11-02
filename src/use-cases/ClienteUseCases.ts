import { ClienteRepository } from '../repositories/ClienteRepository';
import { Cliente } from '../entities/Cliente';
import { MessageQueueService } from '../services/MessageQueueService';
import { CacheService } from '../services/CacheService';
import { Page } from '../repositories/BaseRepository';

const KEY = (id: string) => `cliente:${id}`;
const TTL_SECONDS = 300;

export class ClienteUseCase {
  private readonly repo: ClienteRepository;
  private readonly mq = MessageQueueService.getInstance();
  private readonly cache = CacheService.getInstance();

  constructor(clienteRepository: ClienteRepository) {
    this.repo = clienteRepository;
  }

  async createCliente(nome: string, email: string, telefone: string): Promise<Cliente> {
    const entity = new Cliente({ nome, email, telefone });
    const created = await this.repo.create(entity);
    await this.mq.produceMessage('clientes', created);
    if (created.id) {
      await this.cache.del(KEY(created.id));
    }
    return created;
  }

  async updateCliente(id: string, nome?: string, email?: string, telefone?: string): Promise<Cliente | null> {
    const updated = await this.repo.update(id, { nome, email, telefone });
    if (!updated) return null;
    await this.cache.set(KEY(id), updated, TTL_SECONDS);
    return updated;
  }

  async getClienteById(id: string): Promise<Cliente | null> {
    const key = KEY(id);
    const cached = await this.cache.get<Cliente>(key);
    if (cached) return cached;

    const found = await this.repo.findById(id);
    if (found) await this.cache.set(key, found, TTL_SECONDS);
    return found;
  }

  async getAllClientes(page?: number, limit?: number, sort?: 'asc' | 'desc'): Promise<Page<Cliente>> {
    return this.repo.findAll({ page, limit, sort });
  }

  async deleteCliente(id: string): Promise<void> {
    await this.repo.delete(id);
    await this.cache.del(KEY(id));
  }
}
