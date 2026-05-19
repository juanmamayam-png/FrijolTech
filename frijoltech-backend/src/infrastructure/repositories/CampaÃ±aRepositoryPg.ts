import { ICampañaRepository } from '../../domain/interfaces/ICampañaRepository';
import { Campaña } from '../../domain/entities/Campaña';
import { DatabaseConnection } from '../database/DatabaseConnection';

export class CampañaRepositoryPg implements ICampañaRepository {
  private db = DatabaseConnection.getInstance();

  async crear(campaña: Omit<Campaña, 'id' | 'createdAt'>): Promise<Campaña> {
    const result = await this.db.query<Campaña>(
      `INSERT INTO campaña (fecha_siembra, fecha_cosecha, area_sembrada, estado, lote_id, variedad_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, fecha_siembra AS "fechaSiembra", fecha_cosecha AS "fechaCosecha", area_sembrada AS "areaSembrada", estado, lote_id AS "loteId", variedad_id AS "variedadId", created_at AS "createdAt"`,
      [campaña.fechaSiembra, campaña.fechaCosecha ?? null, campaña.areaSembrada, campaña.estado, campaña.loteId, campaña.variedadId]
    );
    return result.rows[0];
  }

  async buscarPorId(id: number): Promise<Campaña | null> {
    const result = await this.db.query<Campaña>(
      `SELECT id, fecha_siembra AS "fechaSiembra", fecha_cosecha AS "fechaCosecha", area_sembrada AS "areaSembrada", estado, lote_id AS "loteId", variedad_id AS "variedadId", created_at AS "createdAt"
       FROM campaña WHERE id = $1`,
      [id]
    );
    return result.rows[0] ?? null;
  }

  async listarPorLote(loteId: number): Promise<Campaña[]> {
    const result = await this.db.query<Campaña>(
      `SELECT id, fecha_siembra AS "fechaSiembra", fecha_cosecha AS "fechaCosecha", area_sembrada AS "areaSembrada", estado, lote_id AS "loteId", variedad_id AS "variedadId", created_at AS "createdAt"
       FROM campaña WHERE lote_id = $1 ORDER BY created_at DESC`,
      [loteId]
    );
    return result.rows;
  }
}
