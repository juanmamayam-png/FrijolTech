import { z } from 'zod';

export const registrarAvanceSchema = z.object({
  campañaId: z.number().int().positive(),
  observaciones: z.string().min(5).max(2000),
  fotoUrl: z.string().url().optional(),
});

export type RegistrarAvanceDto = z.infer<typeof registrarAvanceSchema>;
