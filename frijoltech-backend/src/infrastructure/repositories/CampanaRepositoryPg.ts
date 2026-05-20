import { ICampanaRepository } from '../../domain/interfaces/ICampanaRepository';
import { Campana } from '../../domain/entities/Campana';
import { DatabaseConnection } from '../database/DatabaseConnection';

export class CampanaRepositoryPg implements ICampanaRepository {
  private db = DatabaseConnection.getInstance();

  async crear(campana: Omit<Campana, 'id' | 'createdAt'>): Promise<Campana> {
    const result = await this.db.query<Campana>(
      `INSERT INTO campana (fecha_siembra, fecha_cosecha, area_sembrada, estado, lote_id, variedad_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, fecha_siembra AS "fechaSiembra", fecha_cosecha AS "fechaCosecha", area_sembrada AS "areaSembrada", estado, lote_id AS "loteId", variedad_id AS "variedadId", created_at AS "createdAt"`,
      [campana.fechaSiembra, campana.fechaCosecha ?? null, campana.areaSembrada, campana.estado, campana.loteId, campana.variedadId]
    );
    return result.rows[0];
  }

  async buscarPorId(id: number): Promise<Campana | null> {
    const result = await this.db.query<Campana>(
      `SELECT id, fecha_siembra AS "fechaSiembra", fecha_cosecha AS "fechaCosecha", area_sembrada AS "areaSembrada", estado, lote_id AS "loteId", variedad_id AS "variedadId", created_at AS "createdAt"
       FROM campana WHERE id = $1`,
      [id]
    );
    return result.rows[0] ?? null;
  }

  async listarPorPropietario(propietarioId: number): Promise<Campana[]> {
    const result = await this.db.query<Campana>(
      `SELECT c.id, c.fecha_siembra AS "fechaSiembra", c.fecha_cosecha AS "fechaCosecha",
              c.area_sembrada AS "areaSembrada", c.estado,
              c.lote_id AS "loteId", c.variedad_id AS "variedadId", c.created_at AS "createdAt"
       FROM campana c
       JOIN lote l ON c.lote_id = l.id
       JOIN predio p ON l.predio_id = p.id
       WHERE p.propietario_id = $1
       ORDER BY c.created_at DESC`,
      [propietarioId],
    );
    return result.rows;
  }

  async listarPorLote(loteId: number): Promise<Campana[]> {
    const result = await this.db.query<Campana>(
      `SELECT id, fecha_siembra AS "fechaSiembra", fecha_cosecha AS "fechaCosecha", area_sembrada AS "areaSembrada", estado, lote_id AS "loteId", variedad_id AS "variedadId", created_at AS "createdAt"
       FROM campana WHERE lote_id = $1 ORDER BY created_at DESC`,
      [loteId]
    );
    return result.rows;
  }
}
