import { z } from 'zod';

export const iniciarCampañaSchema = z.object({
  fechaSiembra: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD requerido'),
  areaSembrada: z.number().positive(),
  loteId: z.number().int().positive(),
  variedadId: z.number().int().positive(),
  nombreVariedad: z.enum(['Cargamanto', 'Bola Roja', 'ICA Cerinza']),
});

export type IniciarCampañaDto = z.infer<typeof iniciarCampañaSchema>;
