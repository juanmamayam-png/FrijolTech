import { IObservador } from '../../domain/interfaces/IObservador';
import { EventoCritico, TipoEvento } from '../../domain/entities/EventoCritico';

/**
 * Patrón Observer — Observador concreto.
 * Genera recomendaciones agronómicas basadas en el tipo de evento crítico.
 */
export class MotorRecomendaciones implements IObservador {
  async actualizar(evento: EventoCritico): Promise<void> {
    const recomendaciones: Record<TipoEvento, string> = {
      [TipoEvento.TEMPERATURA_ALTA]:
        'Recomendación: Aplicar riego por aspersión para reducir temperatura foliar. Considerar sombreado temporal si persiste.',
      [TipoEvento.TEMPERATURA_BAJA]:
        'Recomendación: Cubrir cultivo con acolchado o polietileno durante la noche. Evitar riego en horas frías.',
      [TipoEvento.HUMEDAD_BAJA]:
        'Recomendación: Activar sistema de riego de forma inmediata. Verificar capacidad de campo del suelo.',
      [TipoEvento.PRECIPITACION_EXCESIVA]:
        'Recomendación: Verificar drenaje del lote. Suspender fertilizaciones. Aplicar fungicida preventivo contra antracnosis.',
    };

    console.log(`[MotorRecomendaciones] Etapa "${evento.etapaActual}" - ${recomendaciones[evento.tipo]}`);
  }
}
