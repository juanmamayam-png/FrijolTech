/**
 * CP-10: Plaga fuera del catálogo o datos inválidos → error de validación (RF-11 — Validación)
 * Verifica que la API rechaza correctamente incidencias con datos inválidos.
 */
process.env.JWT_SECRET = 'frijoltech_test_secret_2026';

jest.mock('pg', () => ({ Pool: jest.fn(() => ({ connect: jest.fn(), on: jest.fn(), end: jest.fn() })) }));

jest.mock('../../src/infrastructure/database/DatabaseConnection', () => ({
  DatabaseConnection: {
    getInstance: jest.fn().mockReturnValue({
      query: jest.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
      getPool: jest.fn(),
    }),
  },
}));

const mockIncidenciaCrear = jest.fn();
const mockCampanaBuscar   = jest.fn();

jest.mock('../../src/infrastructure/repositories/IncidenciaRepositoryPg', () => ({
  IncidenciaRepositoryPg: jest.fn().mockImplementation(() => ({
    crear: mockIncidenciaCrear,
    listarPorCampana: jest.fn(),
  })),
}));

jest.mock('../../src/infrastructure/repositories/CampanaRepositoryPg', () => ({
  CampanaRepositoryPg: jest.fn().mockImplementation(() => ({
    crear: jest.fn(),
    buscarPorId: mockCampanaBuscar,
    listarPorLote: jest.fn(),
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
const CAMPANA_ID = 1;

beforeAll(() => {
  mockCampanaBuscar.mockResolvedValue({
    id: CAMPANA_ID, loteId: 1, variedadId: 1, nombreVariedad: 'Cargamanto',
    fechaSiembra: '2026-04-01', areaSembrada: 2.5, estado: 'activa',
  });
});

test('CP-10: plagaId no numérico → 422', async () => {
  const inicio = Date.now();

  const res = await request(app)
    .post(`/api/v1/campa%C3%B1as/${CAMPANA_ID}/incidencias`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      fecha: '2026-05-10',
      severidad: 'alta',
      observaciones: 'Observaciones con suficiente longitud para pasar validacion.',
      plagaId: 'no-es-numero',
    });

  tiempoMs = Date.now() - inicio;

  expect(res.status).toBe(422);
  expect(res.body).toHaveProperty('error');
  estadoPrueba = 'aprobado';
  observaciones = 'plagaId no numerico rechazado con 422 correctamente.';
});

test('CP-10b: severidad inválida → 422', async () => {
  const res = await request(app)
    .post(`/api/v1/campa%C3%B1as/${CAMPANA_ID}/incidencias`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      fecha: '2026-05-10',
      severidad: 'critica',
      observaciones: 'Observaciones con suficiente longitud para pasar validacion.',
      plagaId: 1,
    });

  expect(res.status).toBe(422);
  expect(res.body.error.detalles.some((e: { campo: string }) => e.campo === 'severidad')).toBe(true);
});

test('CP-10c: fecha con formato incorrecto → 422', async () => {
  const res = await request(app)
    .post(`/api/v1/campa%C3%B1as/${CAMPANA_ID}/incidencias`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      fecha: '10/05/2026',
      severidad: 'media',
      observaciones: 'Observaciones con suficiente longitud para pasar validacion.',
      plagaId: 1,
    });

  expect(res.status).toBe(422);
  expect(res.body.error.detalles.some((e: { campo: string }) => e.campo === 'fecha')).toBe(true);
});

test('CP-10d: observaciones vacías → 422', async () => {
  const res = await request(app)
    .post(`/api/v1/campa%C3%B1as/${CAMPANA_ID}/incidencias`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      fecha: '2026-05-10',
      severidad: 'baja',
      observaciones: 'ok',
      plagaId: 1,
    });

  expect(res.status).toBe(422);
});

test('CP-10e: sin token → 401', async () => {
  const res = await request(app)
    .post(`/api/v1/campa%C3%B1as/${CAMPANA_ID}/incidencias`)
    .send({
      fecha: '2026-05-10',
      severidad: 'alta',
      observaciones: 'Observaciones con suficiente longitud para pasar validacion.',
      plagaId: 1,
    });

  expect(res.status).toBe(401);
});

afterAll(() => {
  guardarResultado({
    id: 'CP-10', nombre: 'Validacion incidencia — plaga invalida', rf: 'RF-11', tipo: 'Validacion',
    estado: estadoPrueba, tiempoMs, observaciones,
    timestamp: new Date().toISOString(),
  });
});
