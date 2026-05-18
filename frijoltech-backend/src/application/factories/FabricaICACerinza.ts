import { IEtapaFenologicaFactory } from '../../domain/interfaces/IEtapaFenologicaFactory';
import { EtapaFenologica } from '../../domain/entities/EtapaFenologica';

/**
 * Patrón Factory Method — Fábrica concreta para variedad ICA Cerinza (Cundinamarca).
 * Ciclo de ~125 días. Clima frío de altura, temperaturas 12-22°C.
 */
export class FabricaICACerinza implements IEtapaFenologicaFactory {
  getNombreVariedad(): string {
    return 'ICA Cerinza';
  }

  generarCronograma(
    campañaId: number,
    fechaSiembra: Date
  ): Omit<EtapaFenologica, 'id'>[] {
    const etapasBase = [
      { nombre: 'Siembra',               orden: 1, duracionDias: 0,  tempMin: 12, tempMax: 22, humedadMin: 65 },
      { nombre: 'Germinación',            orden: 2, duracionDias: 9,  tempMin: 14, tempMax: 22, humedadMin: 70 },
      { nombre: 'Desarrollo vegetativo',  orden: 3, duracionDias: 32, tempMin: 12, tempMax: 21, humedadMin: 70 },
      { nombre: 'Floración',              orden: 4, duracionDias: 18, tempMin: 13, tempMax: 20, humedadMin: 72 },
      { nombre: 'Llenado de vaina',       orden: 5, duracionDias: 28, tempMin: 13, tempMax: 21, humedadMin: 70 },
      { nombre: 'Maduración',             orden: 6, duracionDias: 22, tempMin: 12, tempMax: 22, humedadMin: 65 },
      { nombre: 'Cosecha',                orden: 7, duracionDias: 16, tempMin: 12, tempMax: 22, humedadMin: 60 },
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
