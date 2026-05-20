/** Formato canónico de datos climáticos usado por todos los adaptadores */
export interface DatosClimaticos {
  fecha: Date;
  temperatura: number;
  humedad: number;
  precipitacion: number;
  fuente: string;
  latitud?: number;
  longitud?: number;
}
