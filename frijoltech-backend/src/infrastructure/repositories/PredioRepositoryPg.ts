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

  async actualizar(id: number, datos: Partial<Omit<Predio, 'id' | 'propietarioId' | 'createdAt'>>): Promise<Predio> {
    const campos: string[] = [];
    const valores: unknown[] = [];
    let idx = 1;

    if (datos.nombre    !== undefined) { campos.push(`nombre = $${idx++}`);     valores.push(datos.nombre); }
    if (datos.ubicacion !== undefined) { campos.push(`ubicacion = $${idx++}`);  valores.push(datos.ubicacion); }
    if (datos.latitud   !== undefined) { campos.push(`latitud = $${idx++}`);    valores.push(datos.latitud); }
    if (datos.longitud  !== undefined) { campos.push(`longitud = $${idx++}`);   valores.push(datos.longitud); }
    if (datos.altitud   !== undefined) { campos.push(`altitud = $${idx++}`);    valores.push(datos.altitud); }
    if (datos.areaTotal !== undefined) { campos.push(`area_total = $${idx++}`); valores.push(datos.areaTotal); }

    valores.push(id);
    const result = await this.db.query<Predio>(
      `UPDATE predio SET ${campos.join(', ')}
       WHERE id = $${idx}
       RETURNING id, nombre, ubicacion, latitud, longitud, altitud, area_total AS "areaTotal", propietario_id AS "propietarioId", created_at AS "createdAt"`,
      valores,
    );
    return result.rows[0];
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
