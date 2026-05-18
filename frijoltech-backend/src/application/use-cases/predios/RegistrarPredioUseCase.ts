import { IPredioRepository } from '../../../domain/interfaces/IPredioRepository';
import { Predio } from '../../../domain/entities/Predio';

type RegistrarPredioInput = Omit<Predio, 'id' | 'createdAt'>;

export class RegistrarPredioUseCase {
  constructor(private readonly predioRepo: IPredioRepository) {}

  async ejecutar(input: RegistrarPredioInput): Promise<Predio> {
    return this.predioRepo.crear(input);
  }
}
