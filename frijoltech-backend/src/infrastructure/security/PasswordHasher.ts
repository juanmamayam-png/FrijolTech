import bcrypt from 'bcrypt';

export interface IPasswordHasher {
  hash(contrasena: string): Promise<string>;
  comparar(contrasena: string, hash: string): Promise<boolean>;
}

export class PasswordHasher implements IPasswordHasher {
  private readonly saltRounds = 12;

  async hash(contrasena: string): Promise<string> {
    return bcrypt.hash(contrasena, this.saltRounds);
  }

  async comparar(contrasena: string, hash: string): Promise<boolean> {
    return bcrypt.compare(contrasena, hash);
  }
}
