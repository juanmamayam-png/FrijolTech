export type SeveridadIncidencia = 'baja' | 'media' | 'alta';

export interface IncidenciaFitosanitaria {
  id?: number;
  fecha: Date;
  severidad: SeveridadIncidencia;
  observaciones: string;
  campanaId: number;
  plagaId: number;
}
