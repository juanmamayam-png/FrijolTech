import { IUsuarioRepository } from '../../../domain/interfaces/IUsuarioRepository';
import { IPasswordHasher } from '../../../infrastructure/security/PasswordHasher';

interface RegistrarUsuarioInput {
  nombre: string;
  correo: string;
  contrasena: string;
  rolId?: number;
}

interface RegistrarUsuarioOutput {
  id: number;
  nombre: string;
  correo: string;
  rolId: number;
}

export class RegistrarUsuarioUseCase {
  constructor(
    private readonly usuarioRepo: IUsuarioRepository,
    private readonly hasher: IPasswordHasher
  ) {}

  async ejecutar(input: RegistrarUsuarioInput): Promise<RegistrarUsuarioOutput> {
    const existente = await this.usuarioRepo.buscarPorCorreo(input.correo);
    if (existente) {
      throw new Error('CORREO_DUPLICADO');
    }

    const contrasenaHash = await this.hasher.hash(input.contrasena);
    const usuario = await this.usuarioRepo.crear({
      nombre: input.nombre,
      correo: input.correo,
      contrasenaHash,
      rolId: input.rolId ?? 1,
    });

    return {
      id: usuario.id!,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rolId: usuario.rolId,
    };
  }
}
