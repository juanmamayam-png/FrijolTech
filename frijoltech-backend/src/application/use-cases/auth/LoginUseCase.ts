import { IUsuarioRepository } from '../../../domain/interfaces/IUsuarioRepository';
import { IPasswordHasher } from '../../../infrastructure/security/PasswordHasher';
import { ITokenService } from '../../../infrastructure/security/TokenService';

interface LoginInput {
  correo: string;
  contrasena: string;
}

interface LoginOutput {
  token: string;
  usuario: { id: number; nombre: string; correo: string; rolId: number };
}

export class LoginUseCase {
  constructor(
    private readonly usuarioRepo: IUsuarioRepository,
    private readonly hasher: IPasswordHasher,
    private readonly tokenService: ITokenService
  ) {}

  async ejecutar(input: LoginInput): Promise<LoginOutput> {
    const usuario = await this.usuarioRepo.buscarPorCorreo(input.correo);
    if (!usuario) {
      throw new Error('CREDENCIALES_INVALIDAS');
    }

    const coincide = await this.hasher.comparar(input.contrasena, usuario.contrasenaHash);
    if (!coincide) {
      throw new Error('CREDENCIALES_INVALIDAS');
    }

    const token = this.tokenService.generar({ sub: usuario.id!, rolId: usuario.rolId });

    return {
      token,
      usuario: { id: usuario.id!, nombre: usuario.nombre, correo: usuario.correo, rolId: usuario.rolId },
    };
  }
}
