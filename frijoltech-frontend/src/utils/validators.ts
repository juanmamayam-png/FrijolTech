import { z } from 'zod';

export const loginSchema = z.object({
  correo: z.string().email('Correo electrónico inválido'),
  contrasena: z.string().min(1, 'La contraseña es requerida'),
});

export const registerSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  correo: z.string().email('Correo electrónico inválido'),
  contrasena: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmarContrasena: z.string(),
}).refine((d) => d.contrasena === d.confirmarContrasena, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmarContrasena'],
});

export const predioSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  ubicacion: z.string().min(3, 'Ingrese la ubicación del predio'),
  latitud: z.number({ invalid_type_error: 'Ingrese un número válido' }).min(-90).max(90),
  longitud: z.number({ invalid_type_error: 'Ingrese un número válido' }).min(-180).max(180),
  altitud: z.number({ invalid_type_error: 'Ingrese un número válido' }).int().min(0).max(5000),
  areaTotal: z.number({ invalid_type_error: 'Ingrese un número válido' }).positive('El área debe ser mayor a 0'),
});

export const campanaSchema = z.object({
  loteId: z.number({ invalid_type_error: 'Seleccione un lote' }).positive('Seleccione un lote'),
  variedadId: z.number({ invalid_type_error: 'Seleccione una variedad' }).positive('Seleccione una variedad'),
  nombreVariedad: z.enum(['Cargamanto', 'Bola Roja', 'ICA Cerinza']),
  fechaSiembra: z.string().min(1, 'Seleccione la fecha de siembra'),
  areaSembrada: z.number({ invalid_type_error: 'Ingrese un número válido' }).positive('El área debe ser mayor a 0'),
});

export const avanceSchema = z.object({
  observaciones: z.string().min(5, 'Las observaciones deben tener al menos 5 caracteres'),
});

export const incidenciaSchema = z.object({
  campanaId: z.number({ invalid_type_error: 'Seleccione una campaña' }).positive(),
  plagaId: z.number({ invalid_type_error: 'Seleccione una plaga' }).positive('Seleccione una plaga'),
  severidad: z.enum(['baja', 'media', 'alta'], { errorMap: () => ({ message: 'Seleccione la severidad' }) }),
  fecha: z.string().min(1, 'Seleccione la fecha'),
  observaciones: z.string().min(5, 'Las observaciones deben tener al menos 5 caracteres'),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type PredioForm = z.infer<typeof predioSchema>;
export type CampanaForm = z.infer<typeof campanaSchema>;
export type AvanceForm = z.infer<typeof avanceSchema>;
export type IncidenciaForm = z.infer<typeof incidenciaSchema>;
