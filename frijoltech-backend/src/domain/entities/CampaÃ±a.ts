export type EstadoCampaña = 'activa' | 'finalizada' | 'cancelada';

export interface Campaña {
  id?: number;
  fechaSiembra: Date;
  fechaCosecha?: Date;
  areaSembrada: number;
  estado: EstadoCampaña;
  loteId: number;
  variedadId: number;
  createdAt?: Date;
}
