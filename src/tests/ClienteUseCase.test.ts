import { ClienteUseCase } from '../use-cases/ClienteUseCases';
import { ClienteRepository } from '../repositories/ClienteRepository';

jest.mock('../services/CacheService', () => {
  const cache = { get: jest.fn(), set: jest.fn(), del: jest.fn() };
  return {
    CacheService: { getInstance: () => cache },
    __cacheMock: cache,
  };
});

jest.mock('../services/MessageQueueService', () => {
  const mq = { produceMessage: jest.fn() };
  return {
    MessageQueueService: { getInstance: () => mq },
    __mqMock: mq,
  };
});


describe('ClienteUseCase', () => {
  const repo: jest.Mocked<ClienteRepository> = {
    create: jest.fn(),
    update: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
  } as any;


  it('cria cliente e envia mensagem', async () => {
    const use = new ClienteUseCase(repo);
    repo.create.mockResolvedValue({
      id: '1', nome: 'Maria', email: 'maria@example.com', telefone: '11999999999'
    } as any);

    const out = await use.createCliente('Maria', 'maria@example.com', '11999999999');
    expect(repo.create).toHaveBeenCalled();
    expect(out.id).toBe('1');
  });
  it('getClienteById usa cache quando disponível', async () => {
    const cached = { id: '1', nome: 'C', email: 'c@c.com', telefone: '1' } as any;

    const { __cacheMock } = require('../services/CacheService');
    __cacheMock.get.mockResolvedValueOnce(cached);

    const use = new ClienteUseCase(repo);
    const out = await use.getClienteById('1');

    expect(out).toEqual(cached);           
    expect(repo.findById).not.toHaveBeenCalled();
  });
});
