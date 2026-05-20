import { EtapaFenologica } from '../entities/EtapaFenologica';

/** Contrato del patrón Factory Method para generación de cronogramas fenológicos */
export interface IEtapaFenologicaFactory {
  /** Retorna el nombre de la variedad que maneja esta fábrica */
  getNombreVariedad(): string;

  /** Genera el cronograma completo de etapas a partir de la fecha de siembra */
  generarCronograma(
    campanaId: number,
    fechaSiembra: Date
  ): Omit<EtapaFenologica, 'id'>[];
}
