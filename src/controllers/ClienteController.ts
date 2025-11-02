import { Request, Response } from 'express';
import { ClienteUseCase } from '../use-cases/ClienteUseCases';

export class ClienteController {
  constructor(private readonly useCase: ClienteUseCase) {}

  async create(req: Request, res: Response): Promise<Response> {
    const { nome, email, telefone } = req.body;
    const out = await this.useCase.createCliente(nome, email, telefone);
    return res.status(201).json(out);
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const out = await this.useCase.getClienteById(id);
    if (!out) return res.status(404).json({ message: 'Cliente não encontrado' });
    return res.json(out);
  }

  async listAll(req: Request, res: Response): Promise<Response> {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const sort = (req.query.sort as 'asc'|'desc') ?? 'desc';
    const out = await this.useCase.getAllClientes(page, limit, sort);
    return res.json(out);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { nome, email, telefone } = req.body;
    const out = await this.useCase.updateCliente(id, nome, email, telefone);
    return res.json(out);
  }

  async remove(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    await this.useCase.deleteCliente(id);
    return res.status(204).send();
  }
}
