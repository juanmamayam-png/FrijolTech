import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { RegistrarPredioUseCase } from '../../application/use-cases/predios/RegistrarPredioUseCase';
import { ListarPrediosUseCase } from '../../application/use-cases/predios/ListarPrediosUseCase';
import { ObtenerPredioUseCase } from '../../application/use-cases/predios/ObtenerPredioUseCase';
import { ActualizarPredioUseCase } from '../../application/use-cases/predios/ActualizarPredioUseCase';
import { PredioRepositoryPg } from '../../infrastructure/repositories/PredioRepositoryPg';
import { LoteRepositoryPg } from '../../infrastructure/repositories/LoteRepositoryPg';

const repo = new PredioRepositoryPg();
const loteRepo = new LoteRepositoryPg();

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

  async actualizar(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const uc = new ActualizarPredioUseCase(repo);
      const predio = await uc.ejecutar(Number(req.params.id), req.body);
      res.status(200).json({ data: predio });
    } catch (error) {
      next(error);
    }
  }

  async listarLotes(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const lotes = await loteRepo.listarPorPredio(Number(req.params.id));
      res.status(200).json({ data: lotes });
    } catch (error) {
      next(error);
    }
  }

  async obtener(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const uc = new ObtenerPredioUseCase(repo);
      const predio = await uc.ejecutar(Number(req.params.id));
      res.status(200).json({ data: predio });
    } catch (error) {
      next(error);
    }
  }
}
