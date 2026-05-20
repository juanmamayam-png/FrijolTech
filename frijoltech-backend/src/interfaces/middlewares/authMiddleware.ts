import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../../infrastructure/security/TokenService';

export interface AuthRequest extends Request {
  usuario?: { sub: number; rolId: number };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: { code: 'SIN_TOKEN', message: 'Token de autenticación requerido' } });
    return;
  }

  try {
    const token = authHeader.slice(7);
    const payload = new TokenService().verificar(token);
    req.usuario = payload;
    next();
  } catch {
    res.status(401).json({ error: { code: 'TOKEN_INVALIDO', message: 'Token inválido o expirado' } });
  }
}
