import { z } from 'zod';

export const registrarIncidenciaSchema = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD requerido'),
  severidad: z.enum(['baja', 'media', 'alta']),
  observaciones: z.string().min(5).max(2000),
  plagaId: z.number().int().positive(),
});

export type RegistrarIncidenciaDto = z.infer<typeof registrarIncidenciaSchema>;
