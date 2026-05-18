import { IObservador } from '../../domain/interfaces/IObservador';
import { EventoCritico, TipoEvento } from '../../domain/entities/EventoCritico';

/**
 * Patrón Observer — Observador concreto.
 * En producción enviaría email/SMS al agricultor. Aquí imprime en consola.
 */
export class NotificadorAgricultor implements IObservador {
  async actualizar(evento: EventoCritico): Promise<void> {
    const mensajes: Record<TipoEvento, string> = {
      [TipoEvento.TEMPERATURA_ALTA]:       `¡ALERTA! Temperatura alta: ${evento.valorObservado}°C (máx. permitida: ${evento.umbralEsperado}°C) en etapa "${evento.etapaActual}".`,
      [TipoEvento.TEMPERATURA_BAJA]:       `¡ALERTA! Temperatura baja: ${evento.valorObservado}°C (mín. requerida: ${evento.umbralEsperado}°C) en etapa "${evento.etapaActual}".`,
      [TipoEvento.HUMEDAD_BAJA]:           `¡ALERTA! Humedad insuficiente: ${evento.valorObservado}% (mín. requerida: ${evento.umbralEsperado}%) en etapa "${evento.etapaActual}".`,
      [TipoEvento.PRECIPITACION_EXCESIVA]: `¡ALERTA! Precipitación excesiva: ${evento.valorObservado}mm (máx. recomendada: ${evento.umbralEsperado}mm).`,
    };

    console.log(`[NotificadorAgricultor] Campaña ${evento.campañaId}: ${mensajes[evento.tipo]}`);
  }
}
