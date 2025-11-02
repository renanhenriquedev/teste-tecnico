import { ClienteRepository } from '../repositories/ClienteRepository';
import { Cliente } from '../entities/Cliente';
import { MessageQueueService } from '../services/MessageQueueService';

export class ClienteUseCase {
  private clienteRepository: ClienteRepository;
  private messageQueueService: MessageQueueService;

  constructor(clienteRepository: ClienteRepository, messageQueueService: MessageQueueService) {
    this.clienteRepository = clienteRepository;
    this.messageQueueService = messageQueueService;
  }

  // Método para criar um cliente
  async createCliente(nome: string, email: string, telefone: string): Promise<Cliente> {
      const cliente = new Cliente({ nome, email, telefone });
      const createdCliente = await this.clienteRepository.create(cliente);
      await this.messageQueueService.produceMessage('clientes', JSON.stringify(cliente));
      return createdCliente;
  }
}
