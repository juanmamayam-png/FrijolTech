import bcrypt from 'bcrypt';

export interface IPasswordHasher {
  hash(contraseña: string): Promise<string>;
  comparar(contraseña: string, hash: string): Promise<boolean>;
}

export class PasswordHasher implements IPasswordHasher {
  private readonly saltRounds = 12;

  async hash(contraseña: string): Promise<string> {
    return bcrypt.hash(contraseña, this.saltRounds);
  }

  async comparar(contraseña: string, hash: string): Promise<boolean> {
    return bcrypt.compare(contraseña, hash);
  }
}
