import { IUsuarioRepository } from '../../domain/interfaces/IUsuarioRepository';
import { Usuario } from '../../domain/entities/Usuario';
import { DatabaseConnection } from '../database/DatabaseConnection';

export class UsuarioRepositoryPg implements IUsuarioRepository {
  private db = DatabaseConnection.getInstance();

  async crear(usuario: Omit<Usuario, 'id' | 'createdAt'>): Promise<Usuario> {
    const result = await this.db.query<Usuario>(
      `INSERT INTO usuario (nombre, correo, contraseña_hash, rol_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, correo, contraseña_hash AS "contraseñaHash", rol_id AS "rolId", created_at AS "createdAt"`,
      [usuario.nombre, usuario.correo, usuario.contraseñaHash, usuario.rolId]
    );
    return result.rows[0];
  }

  async buscarPorCorreo(correo: string): Promise<Usuario | null> {
    const result = await this.db.query<Usuario>(
      `SELECT id, nombre, correo, contraseña_hash AS "contraseñaHash", rol_id AS "rolId", created_at AS "createdAt"
       FROM usuario WHERE correo = $1`,
      [correo]
    );
    return result.rows[0] ?? null;
  }

  async buscarPorId(id: number): Promise<Usuario | null> {
    const result = await this.db.query<Usuario>(
      `SELECT id, nombre, correo, contraseña_hash AS "contraseñaHash", rol_id AS "rolId", created_at AS "createdAt"
       FROM usuario WHERE id = $1`,
      [id]
    );
    return result.rows[0] ?? null;
  }
}
