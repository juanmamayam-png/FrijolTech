/**
 * CP-06: Campaña ICA Cerinza vs Cargamanto (RF-05 — Verificación Factory Method)
 * Verifica que las fábricas concretas producen cronogramas DISTINTOS según la variedad.
 * ICA Cerinza (Cundinamarca, clima frío) debe tener ciclo más largo y temperaturas más bajas.
 */
process.env.JWT_SECRET = 'frijoltech_test_secret_2026';

jest.mock('pg', () => ({ Pool: jest.fn(() => ({ connect: jest.fn(), on: jest.fn(), end: jest.fn() })) }));

const mockCampañaCrear = jest.fn();
const mockEtapaCrearLote = jest.fn();

jest.mock('../../src/infrastructure/repositories/CampañaRepositoryPg', () => ({
  CampañaRepositoryPg: jest.fn().mockImplementation(() => ({
    crear: mockCampañaCrear,
    buscarPorId: jest.fn(),
    listarPorLote: jest.fn(),
  })),
}));

jest.mock('../../src/infrastructure/repositories/EtapaRepositoryPg', () => ({
  EtapaRepositoryPg: jest.fn().mockImplementation(() => ({
    crearLote: mockEtapaCrearLote,
    listarPorCampaña: jest.fn(),
    buscarPorId: jest.fn(),
    actualizarEstado: jest.fn(),
  })),
}));

import request from 'supertest';
import app from '../../src/app';
import { FabricaSelector } from '../../src/application/factories/FabricaSelector';
import { guardarResultado, generarToken, DATOS_PRUEBA } from '../helpers/testHelpers';
type ResultadoPrueba = import('../helpers/testHelpers').ResultadoPrueba;

let tiempoMs = 0;
let estadoPrueba: ResultadoPrueba['estado'] = 'fallido';
let observaciones = '';
const token = generarToken(5, 1);

beforeAll(() => {
  mockCampañaCrear.mockResolvedValue({
    id: 2, ...DATOS_PRUEBA.campañaIcaCerinza, estado: 'activa', createdAt: new Date().toISOString(),
  });
  mockEtapaCrearLote.mockImplementation(
    (etapas: unknown[]) => etapas.map((e, i) => ({ ...(e as object), id: i + 1 }))
  );
});

test('CP-06: Campaña ICA Cerinza genera 7 etapas via HTTP', async () => {
  const inicio = Date.now();
  const res = await request(app)
    .post('/api/v1/campa%C3%B1as')
    .set('Authorization', `Bearer ${token}`)
    .send(DATOS_PRUEBA.campañaIcaCerinza);
  tiempoMs = Date.now() - inicio;

  expect(res.status).toBe(201);
  expect(res.body.data.etapas).toHaveLength(7);
  estadoPrueba = 'aprobado';
});

test('CP-06b: ICA Cerinza tiene ciclo total más largo que Cargamanto', () => {
  const fecha = new Date('2026-04-01');

  const etapasCargamanto = FabricaSelector.obtenerFabrica('Cargamanto').generarCronograma(1, fecha);
  const etapasCerinza    = FabricaSelector.obtenerFabrica('ICA Cerinza').generarCronograma(2, fecha);

  const diasCargamanto = etapasCargamanto.reduce((s, e) => s + e.duracionDias, 0);
  const diasCerinza    = etapasCerinza.reduce((s, e) => s + e.duracionDias, 0);

  expect(diasCerinza).toBeGreaterThan(diasCargamanto);
  observaciones = `ICA Cerinza: ${diasCerinza}d vs Cargamanto: ${diasCargamanto}d. Diferencia: ${diasCerinza - diasCargamanto}d.`;
});

test('CP-06c: ICA Cerinza tiene temperatura máxima menor que Cargamanto', () => {
  const fecha = new Date('2026-04-01');

  const etapasCargamanto = FabricaSelector.obtenerFabrica('Cargamanto').generarCronograma(1, fecha);
  const etapasCerinza    = FabricaSelector.obtenerFabrica('ICA Cerinza').generarCronograma(2, fecha);

  const tempMaxCargamanto = Math.max(...etapasCargamanto.map((e) => e.umbralTempMax));
  const tempMaxCerinza    = Math.max(...etapasCerinza.map((e) => e.umbralTempMax));

  expect(tempMaxCerinza).toBeLessThan(tempMaxCargamanto);
});

test('CP-06d: Ambas variedades coexisten sin interferencia (instancias independientes)', () => {
  const fabricaA = FabricaSelector.obtenerFabrica('Cargamanto');
  const fabricaB = FabricaSelector.obtenerFabrica('ICA Cerinza');
  expect(fabricaA).not.toBe(fabricaB);
  expect(fabricaA.getNombreVariedad()).not.toBe(fabricaB.getNombreVariedad());
});

afterAll(() => {
  guardarResultado({
    id: 'CP-06', nombre: 'Campaña ICA Cerinza — diferenciación Factory', rf: 'RF-05', tipo: 'Verificación Factory',
    estado: estadoPrueba, tiempoMs, observaciones,
    timestamp: new Date().toISOString(),
  });
});
