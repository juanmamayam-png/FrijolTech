/**
 * CP-02: Login fallido (RF-02 — Validación)
 * Verifica que credenciales incorrectas retornan 401 sin exponer información sensible.
 */
process.env.JWT_SECRET = 'frijoltech_test_secret_2026';

jest.mock('pg', () => ({ Pool: jest.fn(() => ({ connect: jest.fn(), on: jest.fn(), end: jest.fn() })) }));

const mockBuscarPorCorreo = jest.fn();
jest.mock('../../src/infrastructure/repositories/UsuarioRepositoryPg', () => ({
  UsuarioRepositoryPg: jest.fn().mockImplementation(() => ({
    buscarPorCorreo: mockBuscarPorCorreo,
    crear: jest.fn(),
    buscarPorId: jest.fn(),
  })),
}));

import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../../src/app';
import { guardarResultado, DATOS_PRUEBA } from '../helpers/testHelpers';
type ResultadoPrueba = import('../helpers/testHelpers').ResultadoPrueba;

let tiempoMs = 0;
let estadoPrueba: ResultadoPrueba['estado'] = 'fallido';
let observaciones = '';

beforeAll(async () => {
  const hash = await bcrypt.hash('contraseña_correcta', 10);
  mockBuscarPorCorreo.mockResolvedValue({
    id: 2, nombre: 'María Lucía Rojas',
    correo: DATOS_PRUEBA.usuario.correo,
    contraseñaHash: hash, rolId: 1,
  });
});

test('CP-02a: Contraseña incorrecta retorna 401', async () => {
  const inicio = Date.now();
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ correo: DATOS_PRUEBA.usuario.correo, contraseña: 'contraseña_INCORRECTA' });
  tiempoMs = Date.now() - inicio;

  expect(res.status).toBe(401);
  expect(res.body).toHaveProperty('error');
  expect(res.body.error.code).toBe('CREDENCIALES_INVALIDAS');
  expect(res.body).not.toHaveProperty('data');
  estadoPrueba = 'aprobado';
});

test('CP-02b: Usuario inexistente retorna 401', async () => {
  mockBuscarPorCorreo.mockResolvedValueOnce(null);
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ correo: 'noexiste@test.com', contraseña: 'cualquier_cosa' });

  expect(res.status).toBe(401);
  expect(res.body.error.code).toBe('CREDENCIALES_INVALIDAS');
});

test('CP-02c: Correo con formato inválido retorna 422', async () => {
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ correo: 'no-es-un-email', contraseña: 'password' });

  expect(res.status).toBe(422);
  expect(res.body.error.code).toBe('VALIDACION_FALLIDA');
  observaciones = 'Validación Zod actúa antes del servicio de autenticación.';
});

afterAll(() => {
  guardarResultado({
    id: 'CP-02', nombre: 'Login fallido', rf: 'RF-02', tipo: 'Validación',
    estado: estadoPrueba, tiempoMs, observaciones,
    timestamp: new Date().toISOString(),
  });
});
