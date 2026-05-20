/**
 * Verificación del patrón Adapter — IFuenteClimatica
 * Verifica que los 3 adaptadores (IDEAM, ManualEntry, IoT) implementan la misma interfaz
 * y retornan DatosClimaticos con el formato canónico del dominio.
 */

import axios from 'axios';
import { IDEAMAdapter } from '../../src/infrastructure/adapters/IDEAMAdapter';
import { ManualEntryAdapter } from '../../src/infrastructure/adapters/ManualEntryAdapter';
import { IoTAdapter } from '../../src/infrastructure/adapters/IoTAdapter';
import { IFuenteClimatica } from '../../src/domain/interfaces/IFuenteClimatica';

jest.mock('axios');
const axiosMock = axios as jest.Mocked<typeof axios>;

const FECHA = new Date('2026-05-10');
const LAT = 2.522;
const LNG = -75.310;

test('Adapter: ManualEntryAdapter implementa IFuenteClimatica y retorna datos correctos', async () => {
  const adapter: IFuenteClimatica = new ManualEntryAdapter({
    temperatura: 22.5,
    humedad: 75,
    precipitacion: 3.2,
  });

  const datos = await adapter.obtenerDatos(FECHA, LAT, LNG);

  expect(datos.temperatura).toBe(22.5);
  expect(datos.humedad).toBe(75);
  expect(datos.precipitacion).toBe(3.2);
  expect(datos.fuente).toBe('manual');
  expect(datos.latitud).toBe(LAT);
  expect(datos.longitud).toBe(LNG);
  expect(datos.fecha).toEqual(FECHA);
});

test('Adapter: IoTAdapter implementa IFuenteClimatica y retorna rango válido para Colombia', async () => {
  const adapter: IFuenteClimatica = new IoTAdapter();
  const datos = await adapter.obtenerDatos(FECHA, LAT, LNG);

  expect(datos.fuente).toBe('IoT');
  expect(datos.temperatura).toBeGreaterThanOrEqual(18);
  expect(datos.temperatura).toBeLessThanOrEqual(28);
  expect(datos.humedad).toBeGreaterThanOrEqual(55);
  expect(datos.humedad).toBeLessThanOrEqual(85);
  expect(datos.precipitacion).toBeGreaterThanOrEqual(0);
  expect(datos.precipitacion).toBeLessThanOrEqual(15);
});

test('Adapter: IDEAMAdapter adapta respuesta JSON de API externa al formato canónico', async () => {
  axiosMock.get = jest.fn().mockResolvedValueOnce({
    data: {
      observation_date: '2026-05-10T00:00:00Z',
      temp_celsius: 19.8,
      relative_humidity: 82,
      precipitation_mm: 7.5,
    },
  });

  const adapter: IFuenteClimatica = new IDEAMAdapter();
  const datos = await adapter.obtenerDatos(FECHA, LAT, LNG);

  expect(datos.temperatura).toBe(19.8);
  expect(datos.humedad).toBe(82);
  expect(datos.precipitacion).toBe(7.5);
  expect(datos.fuente).toBe('IDEAM');
  expect(axiosMock.get).toHaveBeenCalledTimes(1);
});

test('Adapter: Los 3 adaptadores son intercambiables (misma interfaz IFuenteClimatica)', async () => {
  axiosMock.get = jest.fn().mockResolvedValueOnce({
    data: {
      observation_date: '2026-05-10T00:00:00Z',
      temp_celsius: 20.0,
      relative_humidity: 78,
      precipitation_mm: 5.0,
    },
  });

  const adaptadores: IFuenteClimatica[] = [
    new ManualEntryAdapter({ temperatura: 20, humedad: 78, precipitacion: 5 }),
    new IoTAdapter(),
    new IDEAMAdapter(),
  ];

  for (const adapter of adaptadores) {
    const datos = await adapter.obtenerDatos(FECHA, LAT, LNG);
    // Todos deben retornar el mismo formato canónico
    expect(datos).toHaveProperty('temperatura');
    expect(datos).toHaveProperty('humedad');
    expect(datos).toHaveProperty('precipitacion');
    expect(datos).toHaveProperty('fuente');
    expect(datos).toHaveProperty('latitud');
    expect(datos).toHaveProperty('longitud');
    expect(datos).toHaveProperty('fecha');
    expect(typeof datos.temperatura).toBe('number');
    expect(typeof datos.humedad).toBe('number');
  }
});
