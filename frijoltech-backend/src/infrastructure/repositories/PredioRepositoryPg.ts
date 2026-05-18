import { IPredioRepository } from '../../domain/interfaces/IPredioRepository';
import { Predio } from '../../domain/entities/Predio';
import { DatabaseConnection } from '../database/DatabaseConnection';

export class PredioRepositoryPg implements IPredioRepository {
  private db = DatabaseConnection.getInstance();

  async crear(predio: Omit<Predio, 'id' | 'createdAt'>): Promise<Predio> {
    const result = await this.db.query<Predio>(
      `INSERT INTO predio (nombre, ubicacion, latitud, longitud, altitud, area_total, propietario_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, nombre, ubicacion, latitud, longitud, altitud, area_total AS "areaTotal", propietario_id AS "propietarioId", created_at AS "createdAt"`,
      [predio.nombre, predio.ubicacion, predio.latitud, predio.longitud, predio.altitud, predio.areaTotal, predio.propietarioId]
    );
    return result.rows[0];
  }

  async listarPorPropietario(propietarioId: number): Promise<Predio[]> {
    const result = await this.db.query<Predio>(
      `SELECT id, nombre, ubicacion, latitud, longitud, altitud, area_total AS "areaTotal", propietario_id AS "propietarioId", created_at AS "createdAt"
       FROM predio WHERE propietario_id = $1 ORDER BY created_at DESC`,
      [propietarioId]
    );
    return result.rows;
  }

  async buscarPorId(id: number): Promise<Predio | null> {
    const result = await this.db.query<Predio>(
      `SELECT id, nombre, ubicacion, latitud, longitud, altitud, area_total AS "areaTotal", propietario_id AS "propietarioId", created_at AS "createdAt"
       FROM predio WHERE id = $1`,
      [id]
    );
    return result.rows[0] ?? null;
  }
}
