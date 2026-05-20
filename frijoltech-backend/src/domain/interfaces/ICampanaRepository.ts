import { Campana } from '../entities/Campana';

export interface ICampanaRepository {
  crear(campana: Omit<Campana, 'id' | 'createdAt'>): Promise<Campana>;
  buscarPorId(id: number): Promise<Campana | null>;
  listarPorLote(loteId: number): Promise<Campana[]>;
  listarPorPropietario(propietarioId: number): Promise<Campana[]>;
}
