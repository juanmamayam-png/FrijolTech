import { IFuenteClimatica } from '../../domain/interfaces/IFuenteClimatica';
import { DatosClimaticos } from '../../domain/entities/DatosClimaticos';

interface EntradaManual {
  temperatura: number;
  humedad: number;
  precipitacion: number;
}

/**
 * Patrón Adapter — recibe datos climáticos ingresados manualmente por el técnico.
 * No realiza llamadas externas; adapta el formato de entrada al canónico.
 */
export class ManualEntryAdapter implements IFuenteClimatica {
  constructor(private readonly entrada: EntradaManual) {}

  async obtenerDatos(fecha: Date, lat: number, lng: number): Promise<DatosClimaticos> {
    return {
      fecha,
      temperatura: this.entrada.temperatura,
      humedad: this.entrada.humedad,
      precipitacion: this.entrada.precipitacion,
      fuente: 'manual',
      latitud: lat,
      longitud: lng,
    };
  }
}
