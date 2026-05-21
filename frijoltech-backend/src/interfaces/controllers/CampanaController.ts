import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { IniciarCampanaUseCase } from '../../application/use-cases/campanas/IniciarCampanaUseCase';
import { ConsultarCampanaUseCase } from '../../application/use-cases/campanas/ConsultarCampanaUseCase';
import { CampanaRepositoryPg } from '../../infrastructure/repositories/CampanaRepositoryPg';
import { EtapaRepositoryPg } from '../../infrastructure/repositories/EtapaRepositoryPg';

const campanaRepo = new CampanaRepositoryPg();
const etapaRepo = new EtapaRepositoryPg();

export class CampanaController {
  async listar(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const campanas = await campanaRepo.listarPorPropietario(req.usuario!.sub);
      res.status(200).json({ data: campanas });
    } catch (error) {
      next(error);
    }
  }

  async iniciar(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const uc = new IniciarCampanaUseCase(campanaRepo, etapaRepo);
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
      const uc = new ConsultarCampanaUseCase(campanaRepo, etapaRepo);
      const resultado = await uc.ejecutar(parseInt(req.params.id, 10));
      res.status(200).json({ data: resultado });
    } catch (error) {
      next(error);
    }
  }

  async listarEtapas(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const etapas = await etapaRepo.listarPorCampana(parseInt(req.params.id, 10));
      res.status(200).json({ data: etapas });
    } catch (error) {
      next(error);
    }
  }
}
