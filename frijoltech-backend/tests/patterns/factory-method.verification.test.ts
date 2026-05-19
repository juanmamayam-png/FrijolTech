/**
 * Verificación del patrón Factory Method — FabricaSelector y fábricas concretas
 * Verifica generación de cronogramas fenológicos por variedad.
 */

import { FabricaSelector } from '../../src/application/factories/FabricaSelector';
import { FabricaCargamanto } from '../../src/application/factories/FabricaCargamanto';
import { FabricaBolaRoja } from '../../src/application/factories/FabricaBolaRoja';
import { FabricaICACerinza } from '../../src/application/factories/FabricaICACerinza';

const FECHA_SIEMBRA = new Date('2026-04-01');
const CAMPANA_ID = 1;

test('Factory Method: FabricaSelector devuelve FabricaCargamanto para "Cargamanto"', () => {
  const fabrica = FabricaSelector.obtenerFabrica('Cargamanto');
  expect(fabrica).toBeInstanceOf(FabricaCargamanto);
  expect(fabrica.getNombreVariedad()).toBe('Cargamanto');
});

test('Factory Method: FabricaSelector devuelve FabricaICACerinza para "ICA Cerinza"', () => {
  const fabrica = FabricaSelector.obtenerFabrica('ICA Cerinza');
  expect(fabrica).toBeInstanceOf(FabricaICACerinza);
  expect(fabrica.getNombreVariedad()).toBe('ICA Cerinza');
});

test('Factory Method: FabricaSelector devuelve FabricaBolaRoja para "Bola Roja"', () => {
  const fabrica = FabricaSelector.obtenerFabrica('Bola Roja');
  expect(fabrica).toBeInstanceOf(FabricaBolaRoja);
});

test('Factory Method: FabricaSelector lanza error para variedad desconocida', () => {
  expect(() => FabricaSelector.obtenerFabrica('Variedad Inexistente'))
    .toThrow('No existe fábrica para la variedad');
});

test('Factory Method: FabricaCargamanto genera 7 etapas con ciclo de ~110 días', () => {
  const fabrica = new FabricaCargamanto();
  const cronograma = fabrica.generarCronograma(CAMPANA_ID, FECHA_SIEMBRA);

  expect(cronograma).toHaveLength(7);

  const nombres = cronograma.map((e) => e.nombre);
  expect(nombres).toContain('Siembra');
  expect(nombres).toContain('Floración');
  expect(nombres).toContain('Cosecha');

  const totalDias = cronograma.reduce((acc, e) => acc + e.duracionDias, 0);
  expect(totalDias).toBeGreaterThanOrEqual(100);
  expect(totalDias).toBeLessThanOrEqual(120);
});

test('Factory Method: FabricaICACerinza genera umbrales de temperatura menores (clima frío)', () => {
  const fabricaICA = new FabricaICACerinza();
  const fabricaCargamanto = new FabricaCargamanto();

  const cronogramaICA = fabricaICA.generarCronograma(CAMPANA_ID, FECHA_SIEMBRA);
  const cronogramaCargamanto = fabricaCargamanto.generarCronograma(CAMPANA_ID, FECHA_SIEMBRA);

  const tempMaxICA = Math.max(...cronogramaICA.map((e) => e.umbralTempMax));
  const tempMaxCargamanto = Math.max(...cronogramaCargamanto.map((e) => e.umbralTempMax));

  // ICA Cerinza (clima frío, Cundinamarca) debe tener umbral máx menor que Cargamanto (Huila)
  expect(tempMaxICA).toBeLessThan(tempMaxCargamanto);
});

test('Factory Method: Primera etapa siempre tiene estado "en_curso"', () => {
  const fabrica = FabricaSelector.obtenerFabrica('Cargamanto');
  const cronograma = fabrica.generarCronograma(CAMPANA_ID, FECHA_SIEMBRA);
  expect(cronograma[0].estado).toBe('en_curso');
  cronograma.slice(1).forEach((e) => expect(e.estado).toBe('pendiente'));
});

test('Factory Method: Etapas tienen fechaEstimada secuencial y correcta', () => {
  const fabrica = new FabricaCargamanto();
  const cronograma = fabrica.generarCronograma(CAMPANA_ID, FECHA_SIEMBRA);

  for (let i = 1; i < cronograma.length; i++) {
    const fechaAnterior = new Date(cronograma[i - 1].fechaEstimada).getTime();
    const fechaActual = new Date(cronograma[i].fechaEstimada).getTime();
    expect(fechaActual).toBeGreaterThanOrEqual(fechaAnterior);
  }
});
