export type EstadoCampaña = 'activa' | 'finalizada' | 'cancelada';

export interface Campaña {
  id: number;
  fechaSiembra: string;
  fechaCosecha?: string;
  areaSembrada: number;
  estado: EstadoCampaña;
  loteId: number;
  variedadId: number;
  createdAt: string;
}

export interface NuevaCampañaData {
  fechaSiembra: string;
  areaSembrada: number;
  loteId: number;
  variedadId: number;
  nombreVariedad: 'Cargamanto' | 'Bola Roja' | 'ICA Cerinza';
}

export interface CampañaConEtapas {
  campaña: Campaña;
  etapas: import('./etapa.types').EtapaFenologica[];
}
