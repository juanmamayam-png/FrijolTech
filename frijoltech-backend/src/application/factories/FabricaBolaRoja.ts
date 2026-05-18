import { IEtapaFenologicaFactory } from '../../domain/interfaces/IEtapaFenologicaFactory';
import { EtapaFenologica } from '../../domain/entities/EtapaFenologica';

/**
 * Patrón Factory Method — Fábrica concreta para variedad Bola Roja.
 * Ciclo similar al Cargamanto con duraciones y umbrales levemente distintos.
 */
export class FabricaBolaRoja implements IEtapaFenologicaFactory {
  getNombreVariedad(): string {
    return 'Bola Roja';
  }

  generarCronograma(
    campañaId: number,
    fechaSiembra: Date
  ): Omit<EtapaFenologica, 'id'>[] {
    const etapasBase = [
      { nombre: 'Siembra',               orden: 1, duracionDias: 0,  tempMin: 16, tempMax: 29, humedadMin: 60 },
      { nombre: 'Germinación',            orden: 2, duracionDias: 6,  tempMin: 18, tempMax: 29, humedadMin: 63 },
      { nombre: 'Desarrollo vegetativo',  orden: 3, duracionDias: 27, tempMin: 16, tempMax: 28, humedadMin: 65 },
      { nombre: 'Floración',              orden: 4, duracionDias: 14, tempMin: 16, tempMax: 27, humedadMin: 70 },
      { nombre: 'Llenado de vaina',       orden: 5, duracionDias: 26, tempMin: 17, tempMax: 28, humedadMin: 68 },
      { nombre: 'Maduración',             orden: 6, duracionDias: 21, tempMin: 16, tempMax: 29, humedadMin: 60 },
      { nombre: 'Cosecha',                orden: 7, duracionDias: 14, tempMin: 16, tempMax: 29, humedadMin: 55 },
    ];

    let diasAcumulados = 0;
    return etapasBase.map((e) => {
      const fechaEstimada = new Date(fechaSiembra);
      fechaEstimada.setDate(fechaEstimada.getDate() + diasAcumulados);
      diasAcumulados += e.duracionDias;

      return {
        nombre: e.nombre,
        orden: e.orden,
        duracionDias: e.duracionDias,
        umbralTempMin: e.tempMin,
        umbralTempMax: e.tempMax,
        umbralHumedadMin: e.humedadMin,
        fechaEstimada,
        estado: e.orden === 1 ? 'en_curso' : 'pendiente',
        campañaId,
      };
    });
  }
}
