// /src/repositories/ClienteRepository.ts
import { Cliente } from '../entities/Cliente';
import { ClientModel } from '../infra/db/ClientModel';

export class ClienteRepository {
  async create(entity: Cliente): Promise<Cliente> {
    const doc = await ClientModel.create({
      nome: entity.nome,        
      email: entity.email,
      telefone: entity.telefone,
    });
    return mapDocToEntity(doc);
  }

  async update(id: string, entity: Partial<Cliente>): Promise<Cliente> {
    const doc = await ClientModel.findByIdAndUpdate(
      id,
      {
        ...(entity.nome !== undefined ? { name: entity.nome } : {}),
        ...(entity.email !== undefined ? { email: entity.email } : {}),
        ...(entity.telefone !== undefined ? { phone: entity.telefone } : {}),
      },
      { new: true }
    );
    if (!doc) throw new Error('Cliente não encontrado');
    return mapDocToEntity(doc);
  }

  async findById(id: string): Promise<Cliente | null> {
    const doc = await ClientModel.findById(id);
    return doc ? mapDocToEntity(doc) : null;
  }

  async findAll(): Promise<Cliente[]> {
    const docs = await ClientModel.find().lean();
    return docs.map(mapLeanToEntity);
  }
}

function mapDocToEntity(doc: any): Cliente {
  return new Cliente({
    id: doc._id.toString(),
    nome: doc.nome, 
    email: doc.email,
    telefone: doc.telefone,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  });
}

function mapLeanToEntity(d: any): Cliente {
  return new Cliente({
    id: d._id.toString(),
    nome: d.nome,         
    email: d.email,
    telefone: d.telefone,   
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  });
}
