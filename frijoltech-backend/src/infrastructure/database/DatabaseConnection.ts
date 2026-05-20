import { Pool, QueryResult, QueryResultRow } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Patrón Singleton — Conexión única al pool de PostgreSQL.
 * Garantiza que toda la aplicación comparte el mismo pool de 20 conexiones.
 */
export class DatabaseConnection {
  private static instancia: DatabaseConnection;
  private pool: Pool;

  private constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      user: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'password',
      database: process.env.DB_NAME ?? 'frijoltech',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.pool.on('error', (err) => {
      console.error('[DatabaseConnection] Error inesperado en cliente inactivo del pool:', err);
    });
  }

  /** Retorna la única instancia de DatabaseConnection (Singleton) */
  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instancia) {
      DatabaseConnection.instancia = new DatabaseConnection();
    }
    return DatabaseConnection.instancia;
  }

  /** Ejecuta una query tomando y liberando cliente del pool automáticamente */
  async query<T extends QueryResultRow = QueryResultRow>(
    sql: string,
    params?: unknown[]
  ): Promise<QueryResult<T>> {
    const client = await this.pool.connect();
    try {
      return await client.query<T>(sql, params);
    } finally {
      client.release();
    }
  }

  async cerrar(): Promise<void> {
    await this.pool.end();
  }

  /** Expone el pool para casos que requieran transacciones */
  getPool(): Pool {
    return this.pool;
  }
}
