import { IObservador } from '../../domain/interfaces/IObservador';
import { EventoCritico } from '../../domain/entities/EventoCritico';

/**
 * Patrón Observer — Observador concreto.
 * En producción emitiría el evento por WebSocket al dashboard del cliente.
 */
export class DashboardRealtime implements IObservador {
  async actualizar(evento: EventoCritico): Promise<void> {
    const payload = {
      tipo: evento.tipo,
      campanaId: evento.campanaId,
      etapa: evento.etapaActual,
      valor: evento.valorObservado,
      umbral: evento.umbralEsperado,
      timestamp: evento.fecha.toISOString(),
    };
    console.log(`[DashboardRealtime] Dashboard actualizado — emit('evento_critico', ${JSON.stringify(payload)})`);
  }
}
