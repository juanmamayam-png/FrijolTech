/** Tipos de eventos críticos detectados por el monitor agroclimático */
export enum TipoEvento {
  TEMPERATURA_ALTA = 'TEMPERATURA_ALTA',
  TEMPERATURA_BAJA = 'TEMPERATURA_BAJA',
  HUMEDAD_BAJA = 'HUMEDAD_BAJA',
  PRECIPITACION_EXCESIVA = 'PRECIPITACION_EXCESIVA',
}

export interface EventoCritico {
  tipo: TipoEvento;
  valorObservado: number;
  umbralEsperado: number;
  fecha: Date;
  campanaId: number;
  etapaActual: string;
}
