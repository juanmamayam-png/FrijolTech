import { Request, Response, NextFunction } from 'express';
import { RegistrarAvanceFenologicoUseCase } from '../../application/use-cases/etapas/RegistrarAvanceFenologicoUseCase';
import { EtapaRepositoryPg } from '../../infrastructure/repositories/EtapaRepositoryPg';

const etapaRepo = new EtapaRepositoryPg();

export class EtapaController {
  async registrarAvance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const uc = new RegistrarAvanceFenologicoUseCase(etapaRepo);
      const resultado = await uc.ejecutar({
        etapaId: parseInt(req.params.etapaId, 10),
        ...req.body,
      });
      res.status(201).json({ data: resultado });
    } catch (error) {
      next(error);
    }
  }
}
