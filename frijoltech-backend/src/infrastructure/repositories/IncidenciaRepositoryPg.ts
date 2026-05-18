import { IIncidenciaRepository } from '../../domain/interfaces/IIncidenciaRepository';
import { IncidenciaFitosanitaria } from '../../domain/entities/IncidenciaFitosanitaria';
import { DatabaseConnection } from '../database/DatabaseConnection';

export class IncidenciaRepositoryPg implements IIncidenciaRepository {
  private db = DatabaseConnection.getInstance();

  async crear(incidencia: Omit<IncidenciaFitosanitaria, 'id'>): Promise<IncidenciaFitosanitaria> {
    const result = await this.db.query<IncidenciaFitosanitaria>(
      `INSERT INTO incidencia_fitosanitaria (fecha, severidad, observaciones, campaña_id, plaga_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, fecha, severidad, observaciones, campaña_id AS "campañaId", plaga_id AS "plagaId"`,
      [incidencia.fecha, incidencia.severidad, incidencia.observaciones, incidencia.campañaId, incidencia.plagaId]
    );
    return result.rows[0];
  }

  async listarPorCampaña(campañaId: number): Promise<IncidenciaFitosanitaria[]> {
    const result = await this.db.query<IncidenciaFitosanitaria>(
      `SELECT id, fecha, severidad, observaciones, campaña_id AS "campañaId", plaga_id AS "plagaId"
       FROM incidencia_fitosanitaria WHERE campaña_id = $1 ORDER BY fecha DESC`,
      [campañaId]
    );
    return result.rows;
  }
}
