/**
 * Verificación del patrón Singleton — DatabaseConnection
 * Garantiza una sola instancia de conexión a la base de datos (pool compartido).
 */
process.env.JWT_SECRET = 'frijoltech_test_secret_2026';

jest.mock('pg', () => {
  const mockPool = {
    connect: jest.fn(),
    query: jest.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
    on: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mockPool) };
});

import { DatabaseConnection } from '../../src/infrastructure/database/DatabaseConnection';
import { Pool } from 'pg';

test('Singleton: getInstance() siempre retorna la misma instancia', () => {
  const instancia1 = DatabaseConnection.getInstance();
  const instancia2 = DatabaseConnection.getInstance();
  const instancia3 = DatabaseConnection.getInstance();

  expect(instancia1).toBe(instancia2);
  expect(instancia2).toBe(instancia3);
});

test('Singleton: Pool de pg se construye exactamente una vez', () => {
  // Resetear el mock para contar llamadas de construcción
  (Pool as jest.MockedClass<typeof Pool>).mockClear();

  // Las 3 llamadas a getInstance() deben reutilizar la instancia ya creada
  DatabaseConnection.getInstance();
  DatabaseConnection.getInstance();
  DatabaseConnection.getInstance();

  // Pool ya fue construido en la primera llamada antes del clear,
  // las subsiguientes no deben construir uno nuevo
  expect(Pool).toHaveBeenCalledTimes(0);
});

test('Singleton: La instancia expone el método query()', () => {
  const db = DatabaseConnection.getInstance();
  expect(typeof db.query).toBe('function');
});

test('Singleton: getInstance() siempre devuelve el mismo objeto (identidad referencial)', () => {
  const a = DatabaseConnection.getInstance();
  const b = DatabaseConnection.getInstance();
  // Misma referencia exacta en memoria — garantía del patrón Singleton
  expect(Object.is(a, b)).toBe(true);
  expect(a).toBe(b);
});
