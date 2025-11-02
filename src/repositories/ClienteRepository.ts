import { Cliente } from '../entities/Cliente';
import { ClientModel } from '../infra/db/ClientModel';
import { BaseRepository, FindAllParams, Page } from './BaseRepository';

export class ClienteRepository implements BaseRepository<Cliente> {
  async create(entity: Cliente): Promise<Cliente> {
    const doc = await ClientModel.create({
      nome: entity.nome,        
      email: entity.email,
      telefone: entity.telefone,
    });
    return mapDocToEntity(doc);
  }

  async update(id: string, partial: Partial<Cliente>): Promise<Cliente> {
    const doc = await ClientModel.findByIdAndUpdate(
      id,
      {
        ...(partial.nome      !== undefined ? { name: partial.nome } : {}),
        ...(partial.email     !== undefined ? { email: partial.email } : {}),
        ...(partial.telefone  !== undefined ? { phone: partial.telefone } : {}),
      },
      { new: true, runValidators: true }
    );
    if (!doc) throw Object.assign(new Error('Cliente não encontrado'), { status: 404 });
    return mapDocToEntity(doc);
  }

  async findById(id: string): Promise<Cliente | null> {
    const doc = await ClientModel.findById(id);
    return doc ? mapDocToEntity(doc) : null;
  }

// src/repositories/ClienteRepository.ts
  async findAll(params?: FindAllParams): Promise<Page<Cliente>> {
    const page = Math.max(1, params?.page ?? 1);
    const limit = Math.min(100, Math.max(1, params?.limit ?? 20));
    const sort = params?.sort === 'asc' ? 1 : -1;

    const docs = await ClientModel.find()
      .sort({ createdAt: sort })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const items = docs.map(mapLeanToEntity);
    const total = await ClientModel.countDocuments();
    return { items, page, limit, total, pages: Math.ceil(total / limit) };
  }

  async delete(id: string): Promise<void> {
    const r = await ClientModel.findByIdAndDelete(id);
    if (!r) throw Object.assign(new Error('Cliente não encontrado'), { status: 404 });
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
