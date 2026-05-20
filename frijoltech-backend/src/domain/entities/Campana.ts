export type EstadoCampana = 'activa' | 'finalizada' | 'cancelada';

export interface Campana {
  id?: number;
  fechaSiembra: Date;
  fechaCosecha?: Date;
  areaSembrada: number;
  estado: EstadoCampana;
  loteId: number;
  variedadId: number;
  createdAt?: Date;
}
