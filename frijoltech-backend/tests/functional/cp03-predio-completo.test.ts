/**
 * CP-03: Registrar predio completo (RF-04 — Camino feliz)
 * Verifica que un agricultor autenticado puede registrar un predio con todos los datos.
 */
process.env.JWT_SECRET = 'frijoltech_test_secret_2026';

jest.mock('pg', () => ({ Pool: jest.fn(() => ({ connect: jest.fn(), on: jest.fn(), end: jest.fn() })) }));

const mockPredioCrear = jest.fn();
jest.mock('../../src/infrastructure/repositories/PredioRepositoryPg', () => ({
  PredioRepositoryPg: jest.fn().mockImplementation(() => ({
    crear: mockPredioCrear,
    listarPorPropietario: jest.fn().mockResolvedValue([]),
    buscarPorId: jest.fn(),
  })),
}));

import request from 'supertest';
import app from '../../src/app';
import { guardarResultado, generarToken, DATOS_PRUEBA } from '../helpers/testHelpers';
type ResultadoPrueba = import('../helpers/testHelpers').ResultadoPrueba;

let tiempoMs = 0;
let estadoPrueba: ResultadoPrueba['estado'] = 'fallido';
let observaciones = '';
const token = generarToken(5, 1);

beforeAll(() => {
  mockPredioCrear.mockResolvedValue({
    id: 10,
    ...DATOS_PRUEBA.predio,
    propietarioId: 5,
    createdAt: new Date().toISOString(),
  });
});

test('CP-03: Predio con todos los campos válidos → 201 con ID asignado', async () => {
  const inicio = Date.now();
  const res = await request(app)
    .post('/api/v1/predios')
    .set('Authorization', `Bearer ${token}`)
    .send(DATOS_PRUEBA.predio);
  tiempoMs = Date.now() - inicio;

  expect(res.status).toBe(201);
  expect(res.body.data).toHaveProperty('id');
  expect(res.body.data.nombre).toBe(DATOS_PRUEBA.predio.nombre);
  expect(res.body.data.ubicacion).toBe(DATOS_PRUEBA.predio.ubicacion);
  expect(typeof res.body.data.id).toBe('number');
  expect(tiempoMs).toBeLessThan(3000);

  observaciones = `Predio "${DATOS_PRUEBA.predio.nombre}" creado con ID=${res.body.data.id}`;
  estadoPrueba = 'aprobado';
});

test('CP-03b: Sin JWT retorna 401', async () => {
  const res = await request(app).post('/api/v1/predios').send(DATOS_PRUEBA.predio);
  expect(res.status).toBe(401);
});

afterAll(() => {
  guardarResultado({
    id: 'CP-03', nombre: 'Registrar predio completo', rf: 'RF-04', tipo: 'Camino feliz',
    estado: estadoPrueba, tiempoMs, observaciones,
    timestamp: new Date().toISOString(),
  });
});
