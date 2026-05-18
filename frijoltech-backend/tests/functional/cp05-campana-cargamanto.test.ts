/**
 * CP-05: Iniciar campana Cargamanto (RF-05 — Camino feliz + Factory Method)
 * Verifica que el Factory Method genera exactamente 7 etapas con duraciones reales
 * para la variedad Cargamanto (ciclo ~110 días, Huila).
 */
process.env.JWT_SECRET = 'frijoltech_test_secret_2026';

jest.mock('pg', () => ({ Pool: jest.fn(() => ({ connect: jest.fn(), on: jest.fn(), end: jest.fn() })) }));

const mockCampanaCrear = jest.fn();
const mockEtapaCrearLote = jest.fn();

jest.mock('../../src/infrastructure/repositories/CampanaRepositoryPg', () => ({
  CampanaRepositoryPg: jest.fn().mockImplementation(() => ({
    crear: mockCampanaCrear,
    buscarPorId: jest.fn(),
    listarPorLote: jest.fn(),
  })),
}));

jest.mock('../../src/infrastructure/repositories/EtapaRepositoryPg', () => ({
  EtapaRepositoryPg: jest.fn().mockImplementation(() => ({
    crearLote: mockEtapaCrearLote,
    listarPorCampana: jest.fn(),
    buscarPorId: jest.fn(),
    actualizarEstado: jest.fn(),
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
  mockCampanaCrear.mockResolvedValue({
    id: 1, ...DATOS_PRUEBA.campanaCargamanto, estado: 'activa', createdAt: new Date().toISOString(),
  });
  // Mock crearLote: recibe las etapas generadas por FabricaCargamanto y les añade IDs
  mockEtapaCrearLote.mockImplementation(
    (etapas: unknown[]) => etapas.map((e, i) => ({ ...(e as object), id: i + 1 }))
  );
});

test('CP-05: Campana Cargamanto genera exactamente 7 etapas fenológicas', async () => {
  const inicio = Date.now();
  const res = await request(app)
    .post('/api/v1/campa%C3%B1as')
    .set('Authorization', `Bearer ${token}`)
    .send(DATOS_PRUEBA.campanaCargamanto);
  tiempoMs = Date.now() - inicio;

  expect(res.status).toBe(201);
  expect(res.body.data.campana).toHaveProperty('id');
  expect(res.body.data.etapas).toHaveLength(7);
  estadoPrueba = 'aprobado';
});

test('CP-05b: Las etapas tienen orden secuencial 1–7', () => {
  const etapasArg = mockEtapaCrearLote.mock.calls[0][0] as Array<{ orden: number; nombre: string }>;
  expect(etapasArg).toHaveLength(7);
  etapasArg.forEach((e, i) => expect(e.orden).toBe(i + 1));
});

test('CP-05c: La primera etapa es "Siembra" y la última es "Cosecha"', () => {
  const etapasArg = mockEtapaCrearLote.mock.calls[0][0] as Array<{ nombre: string }>;
  expect(etapasArg[0].nombre).toBe('Siembra');
  expect(etapasArg[6].nombre).toBe('Cosecha');
});

test('CP-05d: Tiempo de respuesta < 3 segundos', () => {
  expect(tiempoMs).toBeLessThan(3000);
  observaciones = `7 etapas generadas por FabricaCargamanto. Ciclo total: ${
    (mockEtapaCrearLote.mock.calls[0][0] as Array<{ duracionDias: number }>).reduce((a, e) => a + e.duracionDias, 0)
  } días. Tiempo: ${tiempoMs}ms`;
});

afterAll(() => {
  guardarResultado({
    id: 'CP-05', nombre: 'Campana Cargamanto — Factory Method', rf: 'RF-05', tipo: 'Camino feliz + Factory',
    estado: estadoPrueba, tiempoMs, observaciones,
    timestamp: new Date().toISOString(),
  });
});
