import { ILoteRepository } from '../../domain/interfaces/ILoteRepository';
import { Lote } from '../../domain/entities/Lote';
import { DatabaseConnection } from '../database/DatabaseConnection';

export class LoteRepositoryPg implements ILoteRepository {
  private db = DatabaseConnection.getInstance();

  async crear(lote: Omit<Lote, 'id'>): Promise<Lote> {
    const result = await this.db.query<Lote>(
      `INSERT INTO lote (nombre, area, predio_id)
       VALUES ($1, $2, $3)
       RETURNING id, nombre, area, predio_id AS "predioId"`,
      [lote.nombre, lote.area, lote.predioId],
    );
    return result.rows[0];
  }

  async listarPorPredio(predioId: number): Promise<Lote[]> {
    const result = await this.db.query<Lote>(
      `SELECT id, nombre, area, predio_id AS "predioId"
       FROM lote WHERE predio_id = $1 ORDER BY id`,
      [predioId],
    );

    // Si el predio no tiene lotes, crea uno por defecto
    if (result.rows.length === 0) {
      const predioResult = await this.db.query<{ nombre: string; area_total: string }>(
        `SELECT nombre, area_total FROM predio WHERE id = $1`,
        [predioId],
      );
      if (predioResult.rows.length > 0) {
        const p = predioResult.rows[0];
        const lote = await this.crear({
          nombre: `Lote A - ${p.nombre}`,
          area: Number(p.area_total),
          predioId,
        });
        return [lote];
      }
    }
    return result.rows;
  }
}
