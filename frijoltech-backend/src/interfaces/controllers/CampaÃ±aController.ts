import { Request, Response, NextFunction } from 'express';
import { IniciarCampañaUseCase } from '../../application/use-cases/campañas/IniciarCampañaUseCase';
import { ConsultarCampañaUseCase } from '../../application/use-cases/campañas/ConsultarCampañaUseCase';
import { CampañaRepositoryPg } from '../../infrastructure/repositories/CampañaRepositoryPg';
import { EtapaRepositoryPg } from '../../infrastructure/repositories/EtapaRepositoryPg';

const campañaRepo = new CampañaRepositoryPg();
const etapaRepo = new EtapaRepositoryPg();

export class CampañaController {
  async iniciar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const uc = new IniciarCampañaUseCase(campañaRepo, etapaRepo);
      const resultado = await uc.ejecutar({
        ...req.body,
        fechaSiembra: new Date(req.body.fechaSiembra),
      });
      res.status(201).json({ data: resultado });
    } catch (error) {
      next(error);
    }
  }

  async consultar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const uc = new ConsultarCampañaUseCase(campañaRepo, etapaRepo);
      const resultado = await uc.ejecutar(parseInt(req.params.id, 10));
      res.status(200).json({ data: resultado });
    } catch (error) {
      next(error);
    }
  }

  async listarEtapas(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const etapas = await etapaRepo.listarPorCampaña(parseInt(req.params.id, 10));
      res.status(200).json({ data: etapas });
    } catch (error) {
      next(error);
    }
  }
}
