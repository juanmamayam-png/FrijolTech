import jwt from 'jsonwebtoken';

export interface TokenPayload {
  sub: number;
  rolId: number;
}

export interface ITokenService {
  generar(payload: TokenPayload): string;
  verificar(token: string): TokenPayload;
}

export class TokenService implements ITokenService {
  private readonly secret: string;
  private readonly expiresIn = '24h';

  constructor() {
    this.secret = process.env.JWT_SECRET ?? 'fallback_secret_change_me';
  }

  generar(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verificar(token: string): TokenPayload {
    const decoded = jwt.verify(token, this.secret) as unknown as TokenPayload;
    return decoded;
  }
}
