import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

const ERROR_MAP: Record<string, { status: number; message: string }> = {
  CORREO_DUPLICADO:        { status: 409, message: 'Ya existe un usuario con ese correo electrónico' },
  CREDENCIALES_INVALIDAS:  { status: 401, message: 'Correo o contrasena incorrectos' },
  CAMPANA_NO_ENCONTRADA:   { status: 404, message: 'Campana no encontrada' },
  ETAPA_NO_ENCONTRADA:     { status: 404, message: 'Etapa fenológica no encontrada' },
};

export function errorMiddleware(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[ErrorMiddleware]', err.message);

  const mapped = ERROR_MAP[err.message];
  if (mapped) {
    res.status(mapped.status).json({ error: { code: err.message, message: mapped.message } });
    return;
  }

  res.status(err.statusCode ?? 500).json({
    error: {
      code: err.code ?? 'ERROR_INTERNO',
      message: process.env.NODE_ENV === 'production' ? 'Error interno del servidor' : err.message,
    },
  });
}
