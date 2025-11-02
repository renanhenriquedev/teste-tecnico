import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ClienteRepository } from '../repositories/ClienteRepository';
import { ClientModel } from '../infra/db/ClientModel';
import { Cliente } from '../entities/Cliente';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});
afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});
afterEach(async () => {
  await ClientModel.deleteMany({});
});

it('persiste e consulta cliente', async () => {
  const repo = new ClienteRepository();
  const created = await repo.create(new Cliente({ nome: 'Ana', email: 'a@a.com', telefone: '11' }));
  expect(created.id).toBeTruthy();
  const found = await repo.findById(created.id!);
  expect(found?.email).toBe('a@a.com');
});
