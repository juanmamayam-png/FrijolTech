import { IObservador } from '../../domain/interfaces/IObservador';
import { EventoCritico } from '../../domain/entities/EventoCritico';
import { DatabaseConnection } from '../../infrastructure/database/DatabaseConnection';

/**
 * Patrón Observer — Observador concreto.
 * Persiste cada evento crítico en la tabla bitacora_eventos.
 */
export class BitacoraEventos implements IObservador {
  private db: DatabaseConnection;

  constructor() {
    this.db = DatabaseConnection.getInstance();
  }

  async actualizar(evento: EventoCritico): Promise<void> {
    try {
      await this.db.query(
        `INSERT INTO bitacora_eventos (tipo_evento, valor_observado, umbral_esperado, fecha, campana_id, etapa_actual)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [evento.tipo, evento.valorObservado, evento.umbralEsperado, evento.fecha, evento.campanaId, evento.etapaActual]
      );
      console.log(`[BitacoraEventos] Evento ${evento.tipo} persistido para campana ${evento.campanaId}`);
    } catch (error) {
      console.error('[BitacoraEventos] Error al persistir evento:', error);
    }
  }
}
