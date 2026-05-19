import { Campaña } from '../entities/Campaña';

export interface ICampañaRepository {
  crear(campaña: Omit<Campaña, 'id' | 'createdAt'>): Promise<Campaña>;
  buscarPorId(id: number): Promise<Campaña | null>;
  listarPorLote(loteId: number): Promise<Campaña[]>;
}
