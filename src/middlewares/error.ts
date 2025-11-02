import mongoose from 'mongoose';

export function errorHandler(err: any, _req: any, res: any, _next: any) {
  // Duplicate key (índice único)
  if (err?.code === 11000) return res.status(409).json({ message: 'Email já cadastrado' });

  // Validação Mongoose
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ message: 'Validation error', errors: err.errors });
  }

  // Cast de ObjectId inválido (duas formas para garantir)
  if (err instanceof mongoose.Error.CastError || err?.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid id' });
  }

  // Erros conhecidos com status
  if (err?.status && err?.message) return res.status(err.status).json({ message: err.message });

  // Fallback
  console.error('[ERR]', err);
  return res.status(500).json({ message: 'Internal server error' });
}
