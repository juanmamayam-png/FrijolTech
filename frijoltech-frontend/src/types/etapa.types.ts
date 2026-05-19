export type EstadoEtapa = 'pendiente' | 'en_curso' | 'completada';

export interface EtapaFenologica {
  id: number;
  nombre: string;
  orden: number;
  duracionDias: number;
  umbralTempMin: number;
  umbralTempMax: number;
  umbralHumedadMin: number;
  fechaEstimada: string;
  estado: EstadoEtapa;
  campanaId: number;
}

export interface RegistroAvanceData {
  campanaId: number;
  observaciones: string;
  fotoUrl?: string;
}
