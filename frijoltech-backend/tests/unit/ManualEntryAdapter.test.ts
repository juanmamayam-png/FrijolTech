/**
 * Prueba unitaria del patrón Adapter
 * Verifica que ManualEntryAdapter e IDEAMAdapter retornan el formato canónico DatosClimaticos.
 */
import { ManualEntryAdapter } from '../../src/infrastructure/adapters/ManualEntryAdapter';
import { IDEAMAdapter } from '../../src/infrastructure/adapters/IDEAMAdapter';
import axios from 'axios';

jest.mock('axios');
const axiosMocked = axios as jest.Mocked<typeof axios>;

const FECHA = new Date('2026-04-15');
const LAT = 2.9273;
const LNG = -75.2819;

describe('ManualEntryAdapter (Adapter)', () => {
  test('retorna DatosClimaticos con la fuente "manual"', async () => {
    const adapter = new ManualEntryAdapter({ temperatura: 22.5, humedad: 70, precipitacion: 5.2 });
    const datos = await adapter.obtenerDatos(FECHA, LAT, LNG);

    expect(datos.fuente).toBe('manual');
    expect(datos.temperatura).toBe(22.5);
    expect(datos.humedad).toBe(70);
    expect(datos.precipitacion).toBe(5.2);
    expect(datos.fecha).toEqual(FECHA);
    expect(datos.latitud).toBe(LAT);
    expect(datos.longitud).toBe(LNG);
  });

  test('retorna objeto con todas las propiedades del formato canónico', async () => {
    const adapter = new ManualEntryAdapter({ temperatura: 18, humedad: 80, precipitacion: 0 });
    const datos = await adapter.obtenerDatos(FECHA, LAT, LNG);

    expect(datos).toHaveProperty('fecha');
    expect(datos).toHaveProperty('temperatura');
    expect(datos).toHaveProperty('humedad');
    expect(datos).toHaveProperty('precipitacion');
    expect(datos).toHaveProperty('fuente');
  });

  test('temperaturas extremas se preservan correctamente', async () => {
    const adapter = new ManualEntryAdapter({ temperatura: -5, humedad: 90, precipitacion: 100 });
    const datos = await adapter.obtenerDatos(FECHA, LAT, LNG);
    expect(datos.temperatura).toBe(-5);
    expect(datos.precipitacion).toBe(100);
  });
});

describe('IDEAMAdapter (Adapter) — mock HTTP', () => {
  test('traduce respuesta IDEAM al formato canónico DatosClimaticos', async () => {
    axiosMocked.get = jest.fn().mockResolvedValue({
      data: {
        observation_date: '2026-04-15',
        temp_celsius: 20.3,
        relative_humidity: 68.5,
        precipitation_mm: 3.1,
      },
    });

    const adapter = new IDEAMAdapter();
    const datos = await adapter.obtenerDatos(FECHA, LAT, LNG);

    expect(datos.fuente).toBe('IDEAM');
    expect(datos.temperatura).toBe(20.3);
    expect(datos.humedad).toBe(68.5);
    expect(datos.precipitacion).toBe(3.1);
    expect(datos).toHaveProperty('fecha');
  });

  test('la URL llamada contiene los parámetros de fecha y coordenadas', async () => {
    const getSpy = jest.fn().mockResolvedValue({
      data: {
        observation_date: '2026-04-15',
        temp_celsius: 19,
        relative_humidity: 72,
        precipitation_mm: 0,
      },
    });
    axiosMocked.get = getSpy;

    const adapter = new IDEAMAdapter();
    await adapter.obtenerDatos(FECHA, LAT, LNG);

    expect(getSpy).toHaveBeenCalledWith(
      expect.stringContaining('ideam.gov.co'),
      expect.objectContaining({ params: expect.objectContaining({ lat: LAT, lng: LNG }) })
    );
  });
});
