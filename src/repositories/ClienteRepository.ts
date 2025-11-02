// /src/repositories/ClienteRepository.ts
import { Cliente } from '../entities/Cliente';
import { ClientModel } from '../infra/db/ClientModel';

export class ClienteRepository {
  // Método para criar um cliente no banco
  async create(cliente: Cliente): Promise<Cliente> {
    const newCliente = new ClientModel(cliente); // Converte a entidade Cliente para o modelo do Mongoose
    await newCliente.save();
    return newCliente.toObject(); // Retorna o cliente criado
  }

  // Outros métodos como update, findById podem ser implementados aqui
}
