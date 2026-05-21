import { Lote } from '../entities/Lote';

export interface ILoteRepository {
  crear(lote: Omit<Lote, 'id'>): Promise<Lote>;
  listarPorPredio(predioId: number): Promise<Lote[]>;
}
