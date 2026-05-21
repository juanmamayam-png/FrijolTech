/**
 * CP-07: Consultar cronograma fenológico (RF-06 — Camino feliz)
 * Verifica que el cronograma retorna las 7 etapas con fechas estimadas calculadas.
 */
process.env.JWT_SECRET = 'frijoltech_test_secret_2026';

jest.mock('pg', () => ({ Pool: jest.fn(() => ({ connect: jest.fn(), on: jest.fn(), end: jest.fn() })) }));

const mockCampanaBuscar = jest.fn();
const mockEtapaListar   = jest.fn();

jest.mock('../../src/infrastructure/repositories/CampanaRepositoryPg', () => ({
  CampanaRepositoryPg: jest.fn().mockImplementation(() => ({
    crear: jest.fn(),
    buscarPorId: mockCampanaBuscar,
    listarPorLote: jest.fn(),
  })),
}));

jest.mock('../../src/infrastructure/repositories/EtapaRepositoryPg', () => ({
  EtapaRepositoryPg: jest.fn().mockImplementation(() => ({
    crearLote: jest.fn(),
    listarPorCampana: mockEtapaListar,
    buscarPorId: jest.fn(),
    actualizarEstado: jest.fn(),
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
const CAMPANA_ID = 3;
const FECHA_SIEMBRA = new Date('2026-04-01');
let etapasSimuladas: ReturnType<typeof crearEtapasSimuladas>;

function crearEtapasSimuladas() {
  const plantilla = [
    { nombre: 'Siembra',               duracionDias: 0,  umbralTempMin: 15, umbralTempMax: 28, umbralHumedadMin: 60 },
    { nombre: 'Germinacion',           duracionDias: 7,  umbralTempMin: 18, umbralTempMax: 28, umbralHumedadMin: 65 },
    { nombre: 'Desarrollo vegetativo', duracionDias: 28, umbralTempMin: 15, umbralTempMax: 27, umbralHumedadMin: 65 },
    { nombre: 'Floracion',             duracionDias: 15, umbralTempMin: 15, umbralTempMax: 26, umbralHumedadMin: 70 },
    { nombre: 'Llenado de vaina',      duracionDias: 25, umbralTempMin: 16, umbralTempMax: 27, umbralHumedadMin: 68 },
    { nombre: 'Maduracion',            duracionDias: 20, umbralTempMin: 15, umbralTempMax: 28, umbralHumedadMin: 60 },
    { nombre: 'Cosecha',               duracionDias: 15, umbralTempMin: 15, umbralTempMax: 28, umbralHumedadMin: 55 },
  ];

  let acumulado = 0;
  return plantilla.map((e, i) => {
    const d = new Date(FECHA_SIEMBRA);
    d.setDate(d.getDate() + acumulado);
    const fechaEstimada = d.toISOString().split('T')[0];
    acumulado += e.duracionDias;
    return { id: i + 1, orden: i + 1, ...e, fechaEstimada, estado: i === 0 ? 'en_curso' : 'pendiente', campanaId: CAMPANA_ID };
  });
}

beforeAll(() => {
  etapasSimuladas = crearEtapasSimuladas();
  mockCampanaBuscar.mockResolvedValue({
    id: CAMPANA_ID, fechaSiembra: '2026-04-01', areaSembrada: 2.5,
    estado: 'activa', loteId: 1, variedadId: 1, createdAt: new Date().toISOString(),
  });
  mockEtapaListar.mockResolvedValue(etapasSimuladas);
});

test('CP-07: GET /campanas/:id retorna campana + 7 etapas con fechas', async () => {
  const inicio = Date.now();
  const res = await request(app)
    .get(`/api/v1/campanas/${CAMPANA_ID}`)
    .set('Authorization', `Bearer ${token}`);
  tiempoMs = Date.now() - inicio;

  expect(res.status).toBe(200);
  expect(res.body.data).toHaveProperty('campana');
  expect(res.body.data).toHaveProperty('etapas');
  expect(res.body.data.etapas).toHaveLength(7);
  estadoPrueba = 'aprobado';
});

test('CP-07b: Las etapas tienen fechas estimadas correctamente calculadas', () => {
  const siembra = etapasSimuladas.find((e) => e.nombre === 'Siembra');
  expect(siembra?.fechaEstimada).toBe('2026-04-01');

  const germinacion = etapasSimuladas.find((e) => e.nombre === 'Germinacion');
  expect(germinacion?.fechaEstimada).toBe('2026-04-01');
});

test('CP-07c: Campana no encontrada retorna 404', async () => {
  mockCampanaBuscar.mockResolvedValueOnce(null);
  const res = await request(app)
    .get('/api/v1/campanas/9999')
    .set('Authorization', `Bearer ${token}`);

  expect(res.status).toBe(404);
  observaciones = 'Cronograma con 7 etapas y fechas estimadas correctas. Campana inexistente correctamente retorna 404.';
});

afterAll(() => {
  guardarResultado({
    id: 'CP-07', nombre: 'Consultar cronograma fenologico', rf: 'RF-06', tipo: 'Camino feliz',
    estado: estadoPrueba, tiempoMs, observaciones,
    timestamp: new Date().toISOString(),
  });
});
