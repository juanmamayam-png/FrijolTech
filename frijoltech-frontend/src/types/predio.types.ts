export interface Predio {
  id: number;
  nombre: string;
  ubicacion: string;
  latitud: number;
  longitud: number;
  altitud: number;
  areaTotal: number;
  propietarioId: number;
  createdAt: string;
}

export interface NuevoPredioData {
  nombre: string;
  ubicacion: string;
  latitud: number;
  longitud: number;
  altitud: number;
  areaTotal: number;
}

export interface Lote {
  id: number;
  nombre: string;
  area: number;
  predioId: number;
}
