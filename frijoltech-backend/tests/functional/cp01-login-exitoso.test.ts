/**
 * CP-01: Login exitoso (RF-02 — Camino feliz)
 * Verifica que un usuario con credenciales válidas recibe un JWT firmado.
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
import jwt from 'jsonwebtoken';
import app from '../../src/app';
import { guardarResultado, DATOS_PRUEBA, TEST_JWT_SECRET } from '../helpers/testHelpers';

let tiempoMs = 0;
let estadoPrueba: ResultadoPrueba['estado'] = 'fallido';
let observaciones = '';
type ResultadoPrueba = import('../helpers/testHelpers').ResultadoPrueba;

beforeAll(async () => {
  const hash = await bcrypt.hash(DATOS_PRUEBA.usuario.contraseña, 10);
  mockBuscarPorCorreo.mockResolvedValue({
    id: 1, nombre: DATOS_PRUEBA.usuario.nombre,
    correo: DATOS_PRUEBA.usuario.correo,
    contraseñaHash: hash, rolId: 1,
  });
});

test('CP-01: Login con credenciales válidas emite JWT con sub correcto', async () => {
  const inicio = Date.now();
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ correo: DATOS_PRUEBA.usuario.correo, contraseña: DATOS_PRUEBA.usuario.contraseña });
  tiempoMs = Date.now() - inicio;

  expect(res.status).toBe(200);
  expect(res.body.data).toHaveProperty('token');
  expect(res.body.data).toHaveProperty('usuario');

  const payload = jwt.verify(res.body.data.token, TEST_JWT_SECRET) as unknown as { sub: number };
  expect(payload.sub).toBe(1);
  expect(tiempoMs).toBeLessThan(3000);

  estadoPrueba = 'aprobado';
  observaciones = `JWT emitido correctamente. sub=${payload.sub}. Tiempo: ${tiempoMs}ms`;
});

afterAll(() => {
  guardarResultado({
    id: 'CP-01', nombre: 'Login exitoso', rf: 'RF-02', tipo: 'Camino feliz',
    estado: estadoPrueba, tiempoMs, observaciones,
    timestamp: new Date().toISOString(),
  });
});
