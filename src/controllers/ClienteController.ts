// /src/controllers/ClienteController.ts
import { Request, Response } from 'express';
import { ClienteUseCase } from '../use-cases/ClienteUseCase';

export class ClienteController {
  private clienteUseCase: ClienteUseCase;

  constructor(clienteUseCase: ClienteUseCase) {
    this.clienteUseCase = clienteUseCase;
  }

  // Endpoint para criar cliente
  async create(req: Request, res: Response): Promise<Response> {
    const { nome, email, telefone } = req.body;

    try {
      // Chama o caso de uso para criar o cliente
      const cliente = await this.clienteUseCase.createCliente(nome, email, telefone);
      return res.status(201).json(cliente); // Retorna o cliente criado
    } catch (error) {
      return res.status(500).json({ message: error instanceof Error ? error.message : 'An unexpected error occurred' });
    }
  }
}
