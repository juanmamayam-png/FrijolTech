import { Usuario } from '../entities/Usuario';

export interface IUsuarioRepository {
  crear(usuario: Omit<Usuario, 'id' | 'createdAt'>): Promise<Usuario>;
  buscarPorCorreo(correo: string): Promise<Usuario | null>;
  buscarPorId(id: number): Promise<Usuario | null>;
}
