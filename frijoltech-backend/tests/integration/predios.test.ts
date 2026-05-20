/**
 * Pruebas de integración — endpoints de predios
 */
import request from 'supertest';
import jwt from 'jsonwebtoken';

process.env.JWT_SECRET = 'test_secret_frijoltech';

jest.mock('pg', () => {
  const mPool = { connect: jest.fn(), on: jest.fn(), end: jest.fn() };
  return { Pool: jest.fn(() => mPool) };
});

const mockPredioCrear = jest.fn();
const mockPredioListar = jest.fn();

jest.mock('../../src/infrastructure/repositories/PredioRepositoryPg', () => ({
  PredioRepositoryPg: jest.fn().mockImplementation(() => ({
    crear: mockPredioCrear,
    listarPorPropietario: mockPredioListar,
    buscarPorId: jest.fn(),
  })),
}));

import app from '../../src/app';

const JWT_SECRET = 'test_secret_frijoltech';
let tokenValido: string;

beforeEach(() => {
  jest.clearAllMocks();
  tokenValido = jwt.sign({ sub: 5, rolId: 1 }, JWT_SECRET, { expiresIn: '1h' });
});

describe('POST /api/v1/predios', () => {
  const predioValido = {
    nombre: 'Finca El Paraíso',
    ubicacion: 'Vereda La Palma, Pitalito, Huila',
    latitud: 1.8552,
    longitud: -76.0514,
    altitud: 1650,
    areaTotal: 3.5,
  };

  test('crea predio y retorna 201 con JWT válido', async () => {
    mockPredioCrear.mockResolvedValue({ id: 1, ...predioValido, propietarioId: 5 });

    const res = await request(app)
      .post('/api/v1/predios')
      .set('Authorization', `Bearer ${tokenValido}`)
      .send(predioValido);

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.nombre).toBe('Finca El Paraíso');
  });

  test('retorna 401 sin token de autenticación', async () => {
    const res = await request(app).post('/api/v1/predios').send(predioValido);
    expect(res.status).toBe(401);
  });

  test('retorna 422 si falta el campo nombre', async () => {
    const res = await request(app)
      .post('/api/v1/predios')
      .set('Authorization', `Bearer ${tokenValido}`)
      .send({ ubicacion: 'Huila', latitud: 1.8, longitud: -76.0, altitud: 1500, areaTotal: 2 });

    expect(res.status).toBe(422);
  });
});

describe('GET /api/v1/predios', () => {
  test('lista predios del usuario autenticado', async () => {
    mockPredioListar.mockResolvedValue([
      { id: 1, nombre: 'Finca El Paraíso', propietarioId: 5 },
      { id: 2, nombre: 'Parcela Nuevo Mundo', propietarioId: 5 },
    ]);

    const res = await request(app)
      .get('/api/v1/predios')
      .set('Authorization', `Bearer ${tokenValido}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  test('retorna 401 sin JWT', async () => {
    const res = await request(app).get('/api/v1/predios');
    expect(res.status).toBe(401);
  });
});
