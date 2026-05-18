import { IEtapaFenologicaFactory } from '../../domain/interfaces/IEtapaFenologicaFactory';
import { FabricaCargamanto } from './FabricaCargamanto';
import { FabricaBolaRoja } from './FabricaBolaRoja';
import { FabricaICACerinza } from './FabricaICACerinza';

/**
 * Selector estático de fábricas — retorna la fábrica concreta según el nombre de variedad.
 * Desacopla al cliente de las implementaciones concretas del Factory Method.
 */
export class FabricaSelector {
  private static fabricas: Map<string, IEtapaFenologicaFactory> = new Map([
    ['cargamanto', new FabricaCargamanto()],
    ['bola roja', new FabricaBolaRoja()],
    ['ica cerinza', new FabricaICACerinza()],
  ]);

  static obtenerFabrica(nombreVariedad: string): IEtapaFenologicaFactory {
    const clave = nombreVariedad.toLowerCase().trim();
    const fabrica = this.fabricas.get(clave);
    if (!fabrica) {
      throw new Error(`No existe fábrica para la variedad: "${nombreVariedad}". Variedades disponibles: Cargamanto, Bola Roja, ICA Cerinza`);
    }
    return fabrica;
  }
}
