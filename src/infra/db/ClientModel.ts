import mongoose, { Schema } from 'mongoose';

const ClientSchema = new Schema({
  nome: { type: String, required: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  telefone: { type: String, required: true },
}, { timestamps: true });

export const ClientModel = mongoose.model('Client', ClientSchema);
