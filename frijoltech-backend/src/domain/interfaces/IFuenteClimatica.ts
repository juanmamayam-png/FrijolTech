import { DatosClimaticos } from '../entities/DatosClimaticos';

/** Contrato del patrón Adapter para fuentes de datos climáticos */
export interface IFuenteClimatica {
  obtenerDatos(fecha: Date, lat: number, lng: number): Promise<DatosClimaticos>;
}
