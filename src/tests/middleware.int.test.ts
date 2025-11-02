import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { buildApp } from '../app/index';
import { ClientModel } from '../infra/db/ClientModel';

// MOCKS para evitar conexões reais (Redis e MQ)
jest.mock('../services/CacheService', () => {
  const cache = { get: jest.fn(), set: jest.fn(), del: jest.fn() };
  return { CacheService: { getInstance: () => cache } };
});
jest.mock('../services/MessageQueueService', () => {
  const mq = { produceMessage: jest.fn(), publish: jest.fn(), consume: jest.fn() };
  return { MessageQueueService: { getInstance: () => mq } };
});

let mongo: MongoMemoryServer;
const app = buildApp();

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  await ClientModel.syncIndexes();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

test('POST /clientes com payload inválido retorna 400', async () => {
  const r = await request(app).post('/clientes').send({});
  expect(r.status).toBe(400);
  expect(r.body.message).toBe('Validation error');
});

test('POST válido depois duplicado retorna 409', async () => {
  const ok = await request(app)
    .post('/clientes')
    .send({ nome: 'Ana', email: 'a@a.com', telefone: '11999999999' });
  expect(ok.status).toBe(201);

  const dup = await request(app)
    .post('/clientes')
    .send({ nome: 'Ana', email: 'a@a.com', telefone: '11999999999' });
  expect(dup.status).toBe(409);
});

test('GET /clientes/:id com id inválido retorna 400', async () => {
  const r = await request(app).get('/clientes/abc');
  expect(r.status).toBe(400);
  expect(r.body.message).toBe('Invalid id');
});
