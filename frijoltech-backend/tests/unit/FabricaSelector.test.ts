/**
 * Prueba unitaria del patrón Factory Method — FabricaSelector
 * Verifica que las 3 variedades producen cronogramas con características distintas.
 */
import { FabricaSelector } from '../../src/application/factories/FabricaSelector';
import { FabricaCargamanto } from '../../src/application/factories/FabricaCargamanto';
import { FabricaBolaRoja } from '../../src/application/factories/FabricaBolaRoja';
import { FabricaICACerinza } from '../../src/application/factories/FabricaICACerinza';

const FECHA_SIEMBRA = new Date('2026-03-01');
const CAMPAÑA_ID = 1;

describe('FabricaSelector (Factory Method)', () => {
  test('retorna FabricaCargamanto para "Cargamanto"', () => {
    const fabrica = FabricaSelector.obtenerFabrica('Cargamanto');
    expect(fabrica).toBeInstanceOf(FabricaCargamanto);
    expect(fabrica.getNombreVariedad()).toBe('Cargamanto');
  });

  test('retorna FabricaBolaRoja para "Bola Roja"', () => {
    const fabrica = FabricaSelector.obtenerFabrica('Bola Roja');
    expect(fabrica).toBeInstanceOf(FabricaBolaRoja);
    expect(fabrica.getNombreVariedad()).toBe('Bola Roja');
  });

  test('retorna FabricaICACerinza para "ICA Cerinza"', () => {
    const fabrica = FabricaSelector.obtenerFabrica('ICA Cerinza');
    expect(fabrica).toBeInstanceOf(FabricaICACerinza);
    expect(fabrica.getNombreVariedad()).toBe('ICA Cerinza');
  });

  test('lanza error para variedad inexistente', () => {
    expect(() => FabricaSelector.obtenerFabrica('Variedad Inexistente')).toThrow();
  });

  test('Cargamanto genera 7 etapas con temperaturas 15-28°C', () => {
    const fabrica = FabricaSelector.obtenerFabrica('Cargamanto');
    const etapas = fabrica.generarCronograma(CAMPAÑA_ID, FECHA_SIEMBRA);

    expect(etapas).toHaveLength(7);
    etapas.forEach((e) => {
      expect(e.umbralTempMin).toBeGreaterThanOrEqual(15);
      expect(e.umbralTempMax).toBeLessThanOrEqual(28);
    });
  });

  test('ICA Cerinza genera 7 etapas con temperaturas más bajas que Cargamanto', () => {
    const cargamanto = FabricaSelector.obtenerFabrica('Cargamanto');
    const cerinza = FabricaSelector.obtenerFabrica('ICA Cerinza');

    const etapasCargamanto = cargamanto.generarCronograma(CAMPAÑA_ID, FECHA_SIEMBRA);
    const etapasCerinza = cerinza.generarCronograma(CAMPAÑA_ID, FECHA_SIEMBRA);

    const tempMaxCargamanto = Math.max(...etapasCargamanto.map((e) => e.umbralTempMax));
    const tempMaxCerinza = Math.max(...etapasCerinza.map((e) => e.umbralTempMax));

    expect(tempMaxCerinza).toBeLessThan(tempMaxCargamanto);
  });

  test('ICA Cerinza tiene ciclo más largo que Cargamanto', () => {
    const cargamanto = FabricaSelector.obtenerFabrica('Cargamanto');
    const cerinza = FabricaSelector.obtenerFabrica('ICA Cerinza');

    const diasCargamanto = cargamanto.generarCronograma(CAMPAÑA_ID, FECHA_SIEMBRA)
      .reduce((acc, e) => acc + e.duracionDias, 0);
    const diasCerinza = cerinza.generarCronograma(CAMPAÑA_ID, FECHA_SIEMBRA)
      .reduce((acc, e) => acc + e.duracionDias, 0);

    expect(diasCerinza).toBeGreaterThan(diasCargamanto);
  });

  test('las 3 variedades producen fechas estimadas distintas para la etapa de floración', () => {
    const variedades = ['Cargamanto', 'Bola Roja', 'ICA Cerinza'];
    const fechasOrden4 = variedades.map((v) => {
      const etapas = FabricaSelector.obtenerFabrica(v).generarCronograma(CAMPAÑA_ID, FECHA_SIEMBRA);
      return etapas.find((e) => e.orden === 4)?.fechaEstimada.toISOString();
    });

    const fechasUnicas = new Set(fechasOrden4);
    expect(fechasUnicas.size).toBeGreaterThan(1);
  });

  test('cada etapa tiene campañaId correcto', () => {
    const etapas = FabricaSelector.obtenerFabrica('Cargamanto').generarCronograma(42, FECHA_SIEMBRA);
    etapas.forEach((e) => expect(e.campañaId).toBe(42));
  });
});
