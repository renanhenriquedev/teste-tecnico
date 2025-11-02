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

  async listAll(_req: Request, res: Response): Promise<Response> {
    const out = await this.useCase.getAllClientes();
    return res.json(out);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { nome, email, telefone } = req.body;
    const out = await this.useCase.updateCliente(id, nome, email, telefone);
    return res.json(out);
  }
}
