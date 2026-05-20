import { IEtapaRepository } from '../../domain/interfaces/IEtapaRepository';
import { EtapaFenologica } from '../../domain/entities/EtapaFenologica';
import { DatabaseConnection } from '../database/DatabaseConnection';

export class EtapaRepositoryPg implements IEtapaRepository {
  private db = DatabaseConnection.getInstance();

  private mapRow(row: Record<string, unknown>): EtapaFenologica {
    return {
      id: row.id as number,
      nombre: row.nombre as string,
      orden: row.orden as number,
      duracionDias: row.duracionDias as number,
      umbralTempMin: row.umbralTempMin as number,
      umbralTempMax: row.umbralTempMax as number,
      umbralHumedadMin: row.umbralHumedadMin as number,
      fechaEstimada: row.fechaEstimada as Date,
      estado: row.estado as EtapaFenologica['estado'],
      campanaId: row.campanaId as number,
    };
  }

  async crearLote(etapas: Omit<EtapaFenologica, 'id'>[]): Promise<EtapaFenologica[]> {
    const creadas: EtapaFenologica[] = [];
    for (const etapa of etapas) {
      const result = await this.db.query<Record<string, unknown>>(
        `INSERT INTO etapa_fenologica (nombre, orden, duracion_dias, umbral_temp_min, umbral_temp_max, umbral_humedad_min, fecha_estimada, estado, campana_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id, nombre, orden, duracion_dias AS "duracionDias", umbral_temp_min AS "umbralTempMin", umbral_temp_max AS "umbralTempMax", umbral_humedad_min AS "umbralHumedadMin", fecha_estimada AS "fechaEstimada", estado, campana_id AS "campanaId"`,
        [etapa.nombre, etapa.orden, etapa.duracionDias, etapa.umbralTempMin, etapa.umbralTempMax, etapa.umbralHumedadMin, etapa.fechaEstimada, etapa.estado, etapa.campanaId]
      );
      creadas.push(this.mapRow(result.rows[0]));
    }
    return creadas;
  }

  async listarPorCampana(campanaId: number): Promise<EtapaFenologica[]> {
    const result = await this.db.query<Record<string, unknown>>(
      `SELECT id, nombre, orden, duracion_dias AS "duracionDias", umbral_temp_min AS "umbralTempMin", umbral_temp_max AS "umbralTempMax", umbral_humedad_min AS "umbralHumedadMin", fecha_estimada AS "fechaEstimada", estado, campana_id AS "campanaId"
       FROM etapa_fenologica WHERE campana_id = $1 ORDER BY orden`,
      [campanaId]
    );
    return result.rows.map(this.mapRow);
  }

  async buscarPorId(id: number): Promise<EtapaFenologica | null> {
    const result = await this.db.query<Record<string, unknown>>(
      `SELECT id, nombre, orden, duracion_dias AS "duracionDias", umbral_temp_min AS "umbralTempMin", umbral_temp_max AS "umbralTempMax", umbral_humedad_min AS "umbralHumedadMin", fecha_estimada AS "fechaEstimada", estado, campana_id AS "campanaId"
       FROM etapa_fenologica WHERE id = $1`,
      [id]
    );
    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  async actualizarEstado(id: number, estado: EtapaFenologica['estado']): Promise<EtapaFenologica> {
    const result = await this.db.query<Record<string, unknown>>(
      `UPDATE etapa_fenologica SET estado = $1 WHERE id = $2
       RETURNING id, nombre, orden, duracion_dias AS "duracionDias", umbral_temp_min AS "umbralTempMin", umbral_temp_max AS "umbralTempMax", umbral_humedad_min AS "umbralHumedadMin", fecha_estimada AS "fechaEstimada", estado, campana_id AS "campanaId"`,
      [estado, id]
    );
    return this.mapRow(result.rows[0]);
  }
}
