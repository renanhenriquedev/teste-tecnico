import { BaseEntity } from './BaseEntity';

export class Cliente extends BaseEntity {
  nome: string;
  email: string;
  telefone: string;

  constructor(params: { nome: string; email: string; telefone: string; id?: string; createdAt?: Date; updatedAt?: Date }) {
    super();
    this.id = params.id;
    this.nome = params.nome;
    this.email = params.email;
    this.telefone = params.telefone;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }
}
