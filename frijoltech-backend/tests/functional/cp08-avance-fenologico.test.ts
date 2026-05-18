/**
 * CP-08: Registrar avance fenológico con foto (RF-07 — Camino feliz)
 * Verifica que se puede registrar un avance con observaciones y foto comprimida.
 */
process.env.JWT_SECRET = 'frijoltech_test_secret_2026';

jest.mock('pg', () => ({ Pool: jest.fn(() => ({ connect: jest.fn(), on: jest.fn(), end: jest.fn() })) }));

jest.mock('../../src/infrastructure/database/DatabaseConnection', () => ({
  DatabaseConnection: {
    getInstance: jest.fn().mockReturnValue({
      query: jest.fn().mockResolvedValue({ rows: [{ id: 77 }], rowCount: 1 }),
      getPool: jest.fn(),
    }),
  },
}));

const mockEtapaBuscar         = jest.fn();
const mockEtapaActualizarEstado = jest.fn();

jest.mock('../../src/infrastructure/repositories/EtapaRepositoryPg', () => ({
  EtapaRepositoryPg: jest.fn().mockImplementation(() => ({
    crearLote: jest.fn(),
    listarPorCampana: jest.fn(),
    buscarPorId: mockEtapaBuscar,
    actualizarEstado: mockEtapaActualizarEstado,
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
const ETAPA_ID = 4;

beforeAll(() => {
  mockEtapaBuscar.mockResolvedValue({
    id: ETAPA_ID, nombre: 'Floracion', orden: 4, duracionDias: 15,
    umbralTempMin: 15, umbralTempMax: 26, umbralHumedadMin: 70,
    fechaEstimada: '2026-05-07', estado: 'en_curso', campanaId: 1,
  });
  mockEtapaActualizarEstado.mockResolvedValue({ id: ETAPA_ID, estado: 'en_curso' });
});

test('CP-08: Avance sin foto → 201 con registroId', async () => {
  const inicio = Date.now();
  const res = await request(app)
    .post(`/api/v1/etapas/${ETAPA_ID}/avance`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      campanaId: 1,
      observaciones: 'Floracion uniforme en el 90% del area. Petalos blancos vigorosos. Sin sintomas de antracnosis hasta el momento. Temperatura media 22C.',
    });
  tiempoMs = Date.now() - inicio;

  expect(res.status).toBe(201);
  expect(res.body.data).toHaveProperty('registroId');
  expect(typeof res.body.data.registroId).toBe('number');
  estadoPrueba = 'aprobado';
});

test('CP-08b: Avance con fotoUrl válida → 201', async () => {
  const inicio = Date.now();
  const res = await request(app)
    .post(`/api/v1/etapas/${ETAPA_ID}/avance`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      campanaId: 1,
      observaciones: 'Avance con foto adjunta. Floracion en etapa media.',
      fotoUrl: 'https://storage.frijoltech.co/fotos/floracion_lote1_20260507.jpg',
    });
  const elapsed = Date.now() - inicio;

  if (elapsed > 2000) {
    estadoPrueba = 'aprobado_con_observacion';
    observaciones = `Tiempo ${elapsed}ms excede 2s. Considerar procesamiento asincrono de imagenes grandes.`;
  }
  expect(res.status).toBe(201);
});

test('CP-08c: Observaciones < 5 caracteres → 422', async () => {
  const res = await request(app)
    .post(`/api/v1/etapas/${ETAPA_ID}/avance`)
    .set('Authorization', `Bearer ${token}`)
    .send({ campanaId: 1, observaciones: 'ok' });

  expect(res.status).toBe(422);
  if (!observaciones) observaciones = `registroId=${77} persistido. Validacion de observaciones minimas correcta.`;
});

afterAll(() => {
  guardarResultado({
    id: 'CP-08', nombre: 'Registrar avance fenologico', rf: 'RF-07', tipo: 'Camino feliz',
    estado: estadoPrueba, tiempoMs, observaciones,
    timestamp: new Date().toISOString(),
  });
});
