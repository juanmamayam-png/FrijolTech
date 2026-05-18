/**
 * CP-04: Registrar predio sin campos obligatorios (RF-04 — Validación)
 * Verifica que el middleware Zod rechaza datos incompletos con mensajes de error claros.
 */
process.env.JWT_SECRET = 'frijoltech_test_secret_2026';

jest.mock('pg', () => ({ Pool: jest.fn(() => ({ connect: jest.fn(), on: jest.fn(), end: jest.fn() })) }));

const mockPredioCrear = jest.fn();
jest.mock('../../src/infrastructure/repositories/PredioRepositoryPg', () => ({
  PredioRepositoryPg: jest.fn().mockImplementation(() => ({
    crear: mockPredioCrear,
    listarPorPropietario: jest.fn(),
    buscarPorId: jest.fn(),
  })),
}));

import request from 'supertest';
import app from '../../src/app';
import { guardarResultado, generarToken } from '../helpers/testHelpers';
type ResultadoPrueba = import('../helpers/testHelpers').ResultadoPrueba;

let tiempoMs = 0;
let estadoPrueba: ResultadoPrueba['estado'] = 'fallido';
let observaciones = '';
const token = generarToken(5, 1);

test('CP-04a: Sin nombre → 422 con detalle del campo faltante', async () => {
  const inicio = Date.now();
  const res = await request(app)
    .post('/api/v1/predios')
    .set('Authorization', `Bearer ${token}`)
    .send({
      ubicacion: 'Vereda La Granja, Cáqueza, Cundinamarca',
      latitud: 4.404, longitud: -73.949, altitud: 2100, areaTotal: 2.0,
      // nombre ausente
    });
  tiempoMs = Date.now() - inicio;

  expect(res.status).toBe(422);
  expect(res.body.error.code).toBe('VALIDACION_FALLIDA');
  expect(res.body.error.detalles).toBeInstanceOf(Array);
  expect(res.body.error.detalles.length).toBeGreaterThan(0);
  estadoPrueba = 'aprobado';
});

test('CP-04b: Área total negativa → 422', async () => {
  const res = await request(app)
    .post('/api/v1/predios')
    .set('Authorization', `Bearer ${token}`)
    .send({
      nombre: 'Finca El Mirador',
      ubicacion: 'Vereda La Granja, Cáqueza, Cundinamarca',
      latitud: 4.404, longitud: -73.949, altitud: 2100, areaTotal: -1.5,
    });

  expect(res.status).toBe(422);
  const campoArea = res.body.error.detalles?.find(
    (d: { campo: string }) => d.campo === 'areaTotal'
  );
  expect(campoArea).toBeDefined();
});

test('CP-04c: Body vacío → 422', async () => {
  const res = await request(app)
    .post('/api/v1/predios')
    .set('Authorization', `Bearer ${token}`)
    .send({});

  expect(res.status).toBe(422);
  expect(mockPredioCrear).not.toHaveBeenCalled();
  observaciones = 'Zod intercepta errores antes de llegar al repositorio. mockPredioCrear no fue invocado.';
});

afterAll(() => {
  guardarResultado({
    id: 'CP-04', nombre: 'Predio sin campos obligatorios', rf: 'RF-04', tipo: 'Validación',
    estado: estadoPrueba, tiempoMs, observaciones,
    timestamp: new Date().toISOString(),
  });
});
