import { Request, Response, NextFunction } from 'express';
import { LoginUseCase } from '../../application/use-cases/auth/LoginUseCase';
import { RegistrarUsuarioUseCase } from '../../application/use-cases/auth/RegistrarUsuarioUseCase';
import { UsuarioRepositoryPg } from '../../infrastructure/repositories/UsuarioRepositoryPg';
import { PasswordHasher } from '../../infrastructure/security/PasswordHasher';
import { TokenService } from '../../infrastructure/security/TokenService';

const repo = new UsuarioRepositoryPg();
const hasher = new PasswordHasher();
const tokenService = new TokenService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const uc = new RegistrarUsuarioUseCase(repo, hasher);
      const resultado = await uc.ejecutar(req.body);
      res.status(201).json({ data: resultado });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const uc = new LoginUseCase(repo, hasher, tokenService);
      const resultado = await uc.ejecutar(req.body);
      res.status(200).json({ data: resultado });
    } catch (error) {
      next(error);
    }
  }
}
