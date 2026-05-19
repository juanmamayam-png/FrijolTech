export interface UmbralesVariedad {
  temperatura_optima: [number, number];
  humedad_minima: number;
  altitud_optima: [number, number];
}

export interface Variedad {
  id?: number;
  nombre: string;
  tipo: string;
  duracionDias: number;
  umbrales: UmbralesVariedad;
}
