import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { RegistrarPredioUseCase } from '../../application/use-cases/predios/RegistrarPredioUseCase';
import { ListarPrediosUseCase } from '../../application/use-cases/predios/ListarPrediosUseCase';
import { PredioRepositoryPg } from '../../infrastructure/repositories/PredioRepositoryPg';

const repo = new PredioRepositoryPg();

export class PredioController {
  async registrar(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const uc = new RegistrarPredioUseCase(repo);
      const predio = await uc.ejecutar({ ...req.body, propietarioId: req.usuario!.sub });
      res.status(201).json({ data: predio });
    } catch (error) {
      next(error);
    }
  }

  async listar(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const uc = new ListarPrediosUseCase(repo);
      const predios = await uc.ejecutar(req.usuario!.sub);
      res.status(200).json({ data: predios });
    } catch (error) {
      next(error);
    }
  }
}
