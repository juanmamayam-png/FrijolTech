export type EstadoCampana = 'activa' | 'finalizada' | 'cancelada';

export interface Campana {
  id: number;
  fechaSiembra: string;
  fechaCosecha?: string;
  areaSembrada: number;
  estado: EstadoCampana;
  loteId: number;
  variedadId: number;
  createdAt: string;
}

export interface NuevaCampanaData {
  fechaSiembra: string;
  areaSembrada: number;
  loteId: number;
  variedadId: number;
  nombreVariedad: 'Cargamanto' | 'Bola Roja' | 'ICA Cerinza';
}

export interface CampanaConEtapas {
  campana: Campana;
  etapas: import('./etapa.types').EtapaFenologica[];
}
