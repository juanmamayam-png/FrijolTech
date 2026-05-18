export type EstadoEtapa = 'pendiente' | 'en_curso' | 'completada';

export interface EtapaFenologica {
  id?: number;
  nombre: string;
  orden: number;
  duracionDias: number;
  umbralTempMin: number;
  umbralTempMax: number;
  umbralHumedadMin: number;
  fechaEstimada: Date;
  estado: EstadoEtapa;
  campanaId: number;
}
