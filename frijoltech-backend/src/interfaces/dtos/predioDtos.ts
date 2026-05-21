import { z } from 'zod';

export const registrarPredioSchema = z.object({
  nombre: z.string().min(2).max(100),
  ubicacion: z.string().min(2).max(200),
  latitud: z.number().min(-90).max(90),
  longitud: z.number().min(-180).max(180),
  altitud: z.number().int().min(0).max(5000),
  areaTotal: z.number().positive(),
});

export type RegistrarPredioDto = z.infer<typeof registrarPredioSchema>;

export const actualizarPredioSchema = z.object({
  nombre:    z.string().min(2).max(100).optional(),
  ubicacion: z.string().min(2).max(200).optional(),
  latitud:   z.number().min(-90).max(90).optional(),
  longitud:  z.number().min(-180).max(180).optional(),
  altitud:   z.number().int().min(0).max(5000).optional(),
  areaTotal: z.number().positive().optional(),
});

export type ActualizarPredioDto = z.infer<typeof actualizarPredioSchema>;
