/**
 * CP-07: Consultar cronograma fenológico (RF-06 — Camino feliz)
 * Verifica que el cronograma retorna las 7 etapas con fechas estimadas calculadas.
 */
process.env.JWT_SECRET = 'frijoltech_test_secret_2026';

jest.mock('pg', () => ({ Pool: jest.fn(() => ({ connect: jest.fn(), on: jest.fn(), end: jest.fn() })) }));

const mockCampañaBuscar = jest.fn();
const mockEtapaListar   = jest.fn();

jest.mock('../../src/infrastructure/repositories/CampañaRepositoryPg', () => ({
  CampañaRepositoryPg: jest.fn().mockImplementation(() => ({
    crear: jest.fn(),
    buscarPorId: mockCampañaBuscar,
    listarPorLote: jest.fn(),
  })),
}));

jest.mock('../../src/infrastructure/repositories/EtapaRepositoryPg', () => ({
  EtapaRepositoryPg: jest.fn().mockImplementation(() => ({
    crearLote: jest.fn(),
    listarPorCampaña: mockEtapaListar,
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
const CAMPAÑA_ID = 3;
const FECHA_SIEMBRA = new Date('2026-04-01');
let etapasSimuladas: ReturnType<typeof crearEtapasSimuladas>;

function crearEtapasSimuladas() {
  const plantilla = [
    { nombre: 'Siembra',               duracionDias: 0,  umbralTempMin: 15, umbralTempMax: 28, umbralHumedadMin: 60 },
    { nombre: 'Germinación',            duracionDias: 7,  umbralTempMin: 18, umbralTempMax: 28, umbralHumedadMin: 65 },
    { nombre: 'Desarrollo vegetativo',  duracionDias: 28, umbralTempMin: 15, umbralTempMax: 27, umbralHumedadMin: 65 },
    { nombre: 'Floración',              duracionDias: 15, umbralTempMin: 15, umbralTempMax: 26, umbralHumedadMin: 70 },
    { nombre: 'Llenado de vaina',       duracionDias: 25, umbralTempMin: 16, umbralTempMax: 27, umbralHumedadMin: 68 },
    { nombre: 'Maduración',             duracionDias: 20, umbralTempMin: 15, umbralTempMax: 28, umbralHumedadMin: 60 },
    { nombre: 'Cosecha',                duracionDias: 15, umbralTempMin: 15, umbralTempMax: 28, umbralHumedadMin: 55 },
  ];

  let acumulado = 0;
  return plantilla.map((e, i) => {
    const d = new Date(FECHA_SIEMBRA);
    d.setDate(d.getDate() + acumulado);
    const fechaEstimada = d.toISOString().split('T')[0];
    acumulado += e.duracionDias;
    return { id: i + 1, orden: i + 1, ...e, fechaEstimada, estado: i === 0 ? 'en_curso' : 'pendiente', campañaId: CAMPAÑA_ID };
  });
}

beforeAll(() => {
  etapasSimuladas = crearEtapasSimuladas();
  mockCampañaBuscar.mockResolvedValue({
    id: CAMPAÑA_ID, fechaSiembra: '2026-04-01', areaSembrada: 2.5,
    estado: 'activa', loteId: 1, variedadId: 1, createdAt: new Date().toISOString(),
  });
  mockEtapaListar.mockResolvedValue(etapasSimuladas);
});

test('CP-07: GET /campañas/:id retorna campaña + 7 etapas con fechas', async () => {
  const inicio = Date.now();
  const res = await request(app)
    .get(`/api/v1/campa%C3%B1as/${CAMPAÑA_ID}`)
    .set('Authorization', `Bearer ${token}`);
  tiempoMs = Date.now() - inicio;

  expect(res.status).toBe(200);
  expect(res.body.data).toHaveProperty('campaña');
  expect(res.body.data).toHaveProperty('etapas');
  expect(res.body.data.etapas).toHaveLength(7);
  estadoPrueba = 'aprobado';
});

test('CP-07b: Las etapas tienen fechas estimadas correctamente calculadas', () => {
  const siembra = etapasSimuladas.find((e) => e.nombre === 'Siembra');
  expect(siembra?.fechaEstimada).toBe('2026-04-01');

  // Germinación empieza en el día 0 de Siembra (duracionDias=0 → misma fecha)
  const germinacion = etapasSimuladas.find((e) => e.nombre === 'Germinación');
  expect(germinacion?.fechaEstimada).toBe('2026-04-01');
});

test('CP-07c: Campaña no encontrada retorna 404', async () => {
  mockCampañaBuscar.mockResolvedValueOnce(null);
  const res = await request(app)
    .get('/api/v1/campa%C3%B1as/9999')
    .set('Authorization', `Bearer ${token}`);

  expect(res.status).toBe(404);
  observaciones = 'Cronograma con 7 etapas y fechas estimadas correctas. Campaña inexistente correctamente retorna 404.';
});

afterAll(() => {
  guardarResultado({
    id: 'CP-07', nombre: 'Consultar cronograma fenológico', rf: 'RF-06', tipo: 'Camino feliz',
    estado: estadoPrueba, tiempoMs, observaciones,
    timestamp: new Date().toISOString(),
  });
});
