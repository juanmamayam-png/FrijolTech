/**
 * CP-09: Registrar incidencia fitosanitaria válida con severidad alta (RF-11 — Camino feliz + Observer)
 * Verifica que una incidencia alta dispara los observadores del patrón Observer.
 */
process.env.JWT_SECRET = 'frijoltech_test_secret_2026';

jest.mock('pg', () => ({ Pool: jest.fn(() => ({ connect: jest.fn(), on: jest.fn(), end: jest.fn() })) }));

jest.mock('../../src/infrastructure/database/DatabaseConnection', () => ({
  DatabaseConnection: {
    getInstance: jest.fn().mockReturnValue({
      query: jest.fn().mockResolvedValue({
        rows: [{
          id: 42,
          fecha: '2026-05-10T00:00:00.000Z',
          severidad: 'alta',
          observaciones: 'Manchas necróticas en el 40% del área foliar, posible Colletotrichum lindemuthianum.',
          campañaId: 1,
          plagaId: 1,
        }],
        rowCount: 1,
      }),
      getPool: jest.fn(),
    }),
  },
}));

const mockIncidenciaCrear = jest.fn();
const mockCampañaBuscar   = jest.fn();

jest.mock('../../src/infrastructure/repositories/IncidenciaRepositoryPg', () => ({
  IncidenciaRepositoryPg: jest.fn().mockImplementation(() => ({
    crear: mockIncidenciaCrear,
    listarPorCampaña: jest.fn(),
  })),
}));

jest.mock('../../src/infrastructure/repositories/CampañaRepositoryPg', () => ({
  CampañaRepositoryPg: jest.fn().mockImplementation(() => ({
    crear: jest.fn(),
    buscarPorId: mockCampañaBuscar,
    listarPorLote: jest.fn(),
  })),
}));

const observadorLlamadas: string[] = [];

jest.mock('../../src/application/observers/NotificadorAgricultor', () => ({
  NotificadorAgricultor: jest.fn().mockImplementation(() => ({
    actualizar: jest.fn().mockImplementation(() => {
      observadorLlamadas.push('NotificadorAgricultor');
    }),
  })),
}));

jest.mock('../../src/application/observers/MotorRecomendaciones', () => ({
  MotorRecomendaciones: jest.fn().mockImplementation(() => ({
    actualizar: jest.fn().mockImplementation(() => {
      observadorLlamadas.push('MotorRecomendaciones');
    }),
  })),
}));

jest.mock('../../src/application/observers/DashboardRealtime', () => ({
  DashboardRealtime: jest.fn().mockImplementation(() => ({
    actualizar: jest.fn().mockImplementation(() => {
      observadorLlamadas.push('DashboardRealtime');
    }),
  })),
}));

jest.mock('../../src/application/observers/BitacoraEventos', () => ({
  BitacoraEventos: jest.fn().mockImplementation(() => ({
    actualizar: jest.fn().mockImplementation(() => {
      observadorLlamadas.push('BitacoraEventos');
    }),
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
const CAMPAÑA_ID = 1;

beforeAll(() => {
  mockCampañaBuscar.mockResolvedValue({
    id: CAMPAÑA_ID, loteId: 1, variedadId: 1, nombreVariedad: 'Cargamanto',
    fechaSiembra: '2026-04-01', areaSembrada: 2.5, estado: 'activa',
  });
  mockIncidenciaCrear.mockResolvedValue({
    id: 42,
    fecha: new Date('2026-05-10'),
    severidad: 'alta',
    observaciones: DATOS_PRUEBA.incidencia.observaciones,
    campañaId: CAMPAÑA_ID,
    plagaId: 1,
  });
});

test('CP-09: Incidencia alta → 201 con id + observadores disparados', async () => {
  observadorLlamadas.length = 0;
  const inicio = Date.now();

  const res = await request(app)
    .post(`/api/v1/campa%C3%B1as/${CAMPAÑA_ID}/incidencias`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      fecha: DATOS_PRUEBA.incidencia.fecha,
      severidad: 'alta',
      observaciones: DATOS_PRUEBA.incidencia.observaciones,
      plagaId: 1,
    });

  tiempoMs = Date.now() - inicio;

  expect(res.status).toBe(201);
  expect(res.body.data).toHaveProperty('id');

  // Patrón Observer: los 4 observadores deben haber sido notificados
  expect(observadorLlamadas).toContain('NotificadorAgricultor');
  expect(observadorLlamadas).toContain('MotorRecomendaciones');
  expect(observadorLlamadas).toContain('DashboardRealtime');
  expect(observadorLlamadas).toContain('BitacoraEventos');

  observaciones = `Observer: ${observadorLlamadas.join(', ')} notificados correctamente.`;
  estadoPrueba = 'aprobado';
});

test('CP-09b: Incidencia media → 201 sin disparar observadores', async () => {
  observadorLlamadas.length = 0;
  mockIncidenciaCrear.mockResolvedValue({
    id: 43, fecha: new Date('2026-05-10'), severidad: 'media',
    observaciones: 'Presencia de áfidos en el 15% del cultivo.', campañaId: CAMPAÑA_ID, plagaId: 2,
  });

  const res = await request(app)
    .post(`/api/v1/campa%C3%B1as/${CAMPAÑA_ID}/incidencias`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      fecha: '2026-05-10',
      severidad: 'media',
      observaciones: 'Presencia de áfidos en el 15% del cultivo.',
      plagaId: 2,
    });

  expect(res.status).toBe(201);
  // Para severidad media, el Observer NO debe dispararse
  expect(observadorLlamadas).toHaveLength(0);
});

test('CP-09c: Campaña inexistente → 404', async () => {
  mockCampañaBuscar.mockResolvedValueOnce(null);

  const res = await request(app)
    .post(`/api/v1/campa%C3%B1as/9999/incidencias`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      fecha: '2026-05-10',
      severidad: 'baja',
      observaciones: 'Prueba campaña inexistente con observaciones suficientes.',
      plagaId: 1,
    });

  expect(res.status).toBe(404);
});

afterAll(() => {
  guardarResultado({
    id: 'CP-09', nombre: 'Registrar incidencia fitosanitaria', rf: 'RF-11', tipo: 'Camino feliz + Observer',
    estado: estadoPrueba, tiempoMs, observaciones,
    timestamp: new Date().toISOString(),
  });
});
