import { Request, Response, NextFunction } from 'express';
import { RegistrarIncidenciaUseCase } from '../../application/use-cases/incidencias/RegistrarIncidenciaUseCase';
import { IncidenciaRepositoryPg } from '../../infrastructure/repositories/IncidenciaRepositoryPg';
import { CampañaRepositoryPg } from '../../infrastructure/repositories/CampañaRepositoryPg';
import { DatabaseConnection } from '../../infrastructure/database/DatabaseConnection';

const incidenciaRepo = new IncidenciaRepositoryPg();
const campañaRepo = new CampañaRepositoryPg();
const db = DatabaseConnection.getInstance();

export class IncidenciaController {
  async registrar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const uc = new RegistrarIncidenciaUseCase(incidenciaRepo, campañaRepo);
      const incidencia = await uc.ejecutar({
        ...req.body,
        fecha: new Date(req.body.fecha),
        campañaId: parseInt(req.params.id, 10),
      });
      res.status(201).json({ data: incidencia });
    } catch (error) {
      next(error);
    }
  }

  async listarPlagas(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await db.query(
        'SELECT id, nombre_comun AS "nombreComun", nombre_cientifico AS "nombreCientifico", tipo, sintomas FROM plaga ORDER BY nombre_comun'
      );
      res.status(200).json({ data: result.rows });
    } catch (error) {
      next(error);
    }
  }
}
