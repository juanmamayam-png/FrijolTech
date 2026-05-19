/**
 * Pruebas de integración — endpoints de autenticación
 * Usan mocks de los repositorios para no requerir base de datos.
 */
import request from 'supertest';
import bcrypt from 'bcrypt';

// Mock de pg antes de importar app
jest.mock('pg', () => {
  const mPool = {
    connect: jest.fn(),
    on: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

// Mock de los repositorios
const mockUsuarioBuscarPorCorreo = jest.fn();
const mockUsuarioCrear = jest.fn();

jest.mock('../../src/infrastructure/repositories/UsuarioRepositoryPg', () => ({
  UsuarioRepositoryPg: jest.fn().mockImplementation(() => ({
    buscarPorCorreo: mockUsuarioBuscarPorCorreo,
    crear: mockUsuarioCrear,
    buscarPorId: jest.fn(),
  })),
}));

import app from '../../src/app';

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = 'test_secret_frijoltech';
});

describe('POST /api/v1/auth/register', () => {
  test('registra un usuario nuevo y retorna 201', async () => {
    mockUsuarioBuscarPorCorreo.mockResolvedValue(null);
    mockUsuarioCrear.mockResolvedValue({
      id: 1,
      nombre: 'Juan Agricultor',
      correo: 'juan@test.com',
      contrasenaHash: 'hash',
      rolId: 1,
    });

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ nombre: 'Juan Agricultor', correo: 'juan@test.com', contrasena: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.correo).toBe('juan@test.com');
  });

  test('retorna 409 si el correo ya existe', async () => {
    mockUsuarioBuscarPorCorreo.mockResolvedValue({ id: 1, correo: 'juan@test.com' });

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ nombre: 'Juan', correo: 'juan@test.com', contrasena: 'password123' });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('CORREO_DUPLICADO');
  });

  test('retorna 422 si falta el campo correo', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ nombre: 'Juan', contrasena: 'password123' });

    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDACION_FALLIDA');
  });
});

describe('POST /api/v1/auth/login', () => {
  test('retorna 200 con JWT para credenciales válidas', async () => {
    const hash = await bcrypt.hash('mipassword', 10);
    mockUsuarioBuscarPorCorreo.mockResolvedValue({
      id: 2,
      nombre: 'María Técnica',
      correo: 'maria@test.com',
      contrasenaHash: hash,
      rolId: 2,
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ correo: 'maria@test.com', contrasena: 'mipassword' });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.usuario.correo).toBe('maria@test.com');
  });

  test('retorna 401 para contraseña incorrecta', async () => {
    const hash = await bcrypt.hash('correcta', 10);
    mockUsuarioBuscarPorCorreo.mockResolvedValue({
      id: 2, correo: 'maria@test.com', contrasenaHash: hash, rolId: 2, nombre: 'Maria',
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ correo: 'maria@test.com', contrasena: 'incorrecta' });

    expect(res.status).toBe(401);
  });

  test('retorna 401 si el usuario no existe', async () => {
    mockUsuarioBuscarPorCorreo.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ correo: 'noexiste@test.com', contrasena: 'password123' });

    expect(res.status).toBe(401);
  });
});

describe('GET /health', () => {
  test('retorna 200 con status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.sistema).toContain('FrijolTech');
  });
});
