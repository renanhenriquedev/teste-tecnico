import mongoose from 'mongoose';
import { env } from '../../config/env';

export async function connectMongo() {
  try {
    await mongoose.connect(env.mongoUri);
    console.log('Mongo connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}
