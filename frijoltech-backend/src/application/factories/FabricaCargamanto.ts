import { IEtapaFenologicaFactory } from '../../domain/interfaces/IEtapaFenologicaFactory';
import { EtapaFenologica } from '../../domain/entities/EtapaFenologica';

/**
 * Patrón Factory Method — Fábrica concreta para variedad Cargamanto (Huila).
 * Ciclo de ~110 días, clima cálido-templado, altitud 1200-2200 msnm.
 */
export class FabricaCargamanto implements IEtapaFenologicaFactory {
  getNombreVariedad(): string {
    return 'Cargamanto';
  }

  generarCronograma(
    campanaId: number,
    fechaSiembra: Date
  ): Omit<EtapaFenologica, 'id'>[] {
    const etapasBase = [
      { nombre: 'Siembra',               orden: 1, duracionDias: 0,  tempMin: 15, tempMax: 28, humedadMin: 60 },
      { nombre: 'Germinación',            orden: 2, duracionDias: 7,  tempMin: 18, tempMax: 28, humedadMin: 65 },
      { nombre: 'Desarrollo vegetativo',  orden: 3, duracionDias: 28, tempMin: 15, tempMax: 27, humedadMin: 65 },
      { nombre: 'Floración',              orden: 4, duracionDias: 15, tempMin: 15, tempMax: 26, humedadMin: 70 },
      { nombre: 'Llenado de vaina',       orden: 5, duracionDias: 25, tempMin: 16, tempMax: 27, humedadMin: 68 },
      { nombre: 'Maduración',             orden: 6, duracionDias: 20, tempMin: 15, tempMax: 28, humedadMin: 60 },
      { nombre: 'Cosecha',                orden: 7, duracionDias: 15, tempMin: 15, tempMax: 28, humedadMin: 55 },
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
        campanaId,
      };
    });
  }
}
