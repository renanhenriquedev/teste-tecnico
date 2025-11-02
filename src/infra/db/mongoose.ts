import mongoose from 'mongoose';
import { env } from '../../config/env';
import { ClientModel } from './ClientModel';

export async function connectMongo() {
  await mongoose.connect(env.mongoUri);
  await ClientModel.syncIndexes();
  console.log('Mongo connected');
}