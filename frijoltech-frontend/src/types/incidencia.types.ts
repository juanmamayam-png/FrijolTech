export type SeveridadIncidencia = 'baja' | 'media' | 'alta';

export interface Plaga {
  id: number;
  nombreComun: string;
  nombreCientifico: string;
  tipo: string;
  sintomas: string;
}

export interface IncidenciaData {
  fecha: string;
  severidad: SeveridadIncidencia;
  observaciones: string;
  plagaId: number;
}

export interface Incidencia {
  id: number;
  fecha: string;
  severidad: SeveridadIncidencia;
  observaciones: string;
  campanaId: number;
  plagaId: number;
}
