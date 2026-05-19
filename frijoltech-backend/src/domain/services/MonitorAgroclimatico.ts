import { IObservador, ISujetoObservable } from '../interfaces/IObservador';
import { EventoCritico, TipoEvento } from '../entities/EventoCritico';
import { DatosClimaticos } from '../entities/DatosClimaticos';
import { EtapaFenologica } from '../entities/EtapaFenologica';

/**
 * Patrón Observer — Sujeto observable.
 * Evalúa datos climáticos contra umbrales de la etapa actual y notifica
 * a todos los observadores suscritos cuando detecta un evento crítico.
 */
export class MonitorAgroclimatico implements ISujetoObservable {
  private observadores: IObservador[] = [];

  suscribir(observador: IObservador): void {
    if (!this.observadores.includes(observador)) {
      this.observadores.push(observador);
    }
  }

  desuscribir(observador: IObservador): void {
    this.observadores = this.observadores.filter((o) => o !== observador);
  }

  async notificar(evento: EventoCritico): Promise<void> {
    await Promise.all(this.observadores.map((o) => o.actualizar(evento)));
  }

  /**
   * Evalúa los datos climáticos contra los umbrales de la etapa actual.
   * Genera y notifica EventoCritico por cada umbral violado.
   */
  async evaluarDatos(
    datos: DatosClimaticos,
    etapaActual: EtapaFenologica,
    campanaId: number,
    variedad: string
  ): Promise<EventoCritico[]> {
    const eventos: EventoCritico[] = [];
    const fecha = new Date();

    if (datos.temperatura > etapaActual.umbralTempMax) {
      eventos.push({
        tipo: TipoEvento.TEMPERATURA_ALTA,
        valorObservado: datos.temperatura,
        umbralEsperado: etapaActual.umbralTempMax,
        fecha,
        campanaId,
        etapaActual: etapaActual.nombre,
      });
    }

    if (datos.temperatura < etapaActual.umbralTempMin) {
      eventos.push({
        tipo: TipoEvento.TEMPERATURA_BAJA,
        valorObservado: datos.temperatura,
        umbralEsperado: etapaActual.umbralTempMin,
        fecha,
        campanaId,
        etapaActual: etapaActual.nombre,
      });
    }

    if (datos.humedad < etapaActual.umbralHumedadMin) {
      eventos.push({
        tipo: TipoEvento.HUMEDAD_BAJA,
        valorObservado: datos.humedad,
        umbralEsperado: etapaActual.umbralHumedadMin,
        fecha,
        campanaId,
        etapaActual: etapaActual.nombre,
      });
    }

    if (datos.precipitacion > 80) {
      eventos.push({
        tipo: TipoEvento.PRECIPITACION_EXCESIVA,
        valorObservado: datos.precipitacion,
        umbralEsperado: 80,
        fecha,
        campanaId,
        etapaActual: etapaActual.nombre,
      });
    }

    for (const evento of eventos) {
      await this.notificar(evento);
    }

    console.log(`[MonitorAgroclimatico] Evaluacion completada para campana ${campanaId}, variedad ${variedad}: ${eventos.length} eventos detectados`);
    return eventos;
  }
}
