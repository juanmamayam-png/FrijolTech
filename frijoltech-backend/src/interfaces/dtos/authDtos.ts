import { z } from 'zod';

export const registrarUsuarioSchema = z.object({
  nombre: z.string().min(2).max(100),
  correo: z.string().email(),
  contrasena: z.string().min(8).max(100),
  rolId: z.number().int().positive().optional(),
});

export const loginSchema = z.object({
  correo: z.string().email(),
  contrasena: z.string().min(1),
});

export type RegistrarUsuarioDto = z.infer<typeof registrarUsuarioSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
