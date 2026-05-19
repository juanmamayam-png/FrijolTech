/**
 * Prueba unitaria del patrón Singleton — DatabaseConnection
 * Verifica que getInstance() retorna la misma instancia en múltiples llamadas.
 */

// Mock de pg para no requerir base de datos real en tests
jest.mock('pg', () => {
  const mPool = {
    connect: jest.fn().mockResolvedValue({
      query: jest.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
      release: jest.fn(),
    }),
    on: jest.fn(),
    end: jest.fn().mockResolvedValue(undefined),
  };
  return { Pool: jest.fn(() => mPool) };
});

// Resetear el singleton entre tests
beforeEach(() => {
  jest.resetModules();
});

describe('DatabaseConnection (Singleton)', () => {
  test('getInstance() retorna la misma instancia en dos llamadas consecutivas', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { DatabaseConnection } = require('../../src/infrastructure/database/DatabaseConnection');

    const instancia1 = DatabaseConnection.getInstance();
    const instancia2 = DatabaseConnection.getInstance();

    expect(instancia1).toBe(instancia2);
  });

  test('getInstance() retorna la misma instancia en tres llamadas', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { DatabaseConnection } = require('../../src/infrastructure/database/DatabaseConnection');

    const a = DatabaseConnection.getInstance();
    const b = DatabaseConnection.getInstance();
    const c = DatabaseConnection.getInstance();

    expect(a).toBe(b);
    expect(b).toBe(c);
  });

  test('la instancia es un objeto (no null/undefined)', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { DatabaseConnection } = require('../../src/infrastructure/database/DatabaseConnection');
    const instancia = DatabaseConnection.getInstance();
    expect(instancia).toBeDefined();
    expect(instancia).not.toBeNull();
  });
});
