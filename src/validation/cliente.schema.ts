import { z } from 'zod';

export const createClienteSchema = z.object({
  nome: z.string().min(2),
  email: z.string().email(),
  telefone: z.string().min(8),
});

export const updateClienteSchema = createClienteSchema.partial();
export type CreateClienteDTO = z.infer<typeof createClienteSchema>;
export type UpdateClienteDTO = z.infer<typeof updateClienteSchema>;
