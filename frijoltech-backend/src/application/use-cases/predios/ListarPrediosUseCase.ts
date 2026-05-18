import { IPredioRepository } from '../../../domain/interfaces/IPredioRepository';
import { Predio } from '../../../domain/entities/Predio';

export class ListarPrediosUseCase {
  constructor(private readonly predioRepo: IPredioRepository) {}

  async ejecutar(propietarioId: number): Promise<Predio[]> {
    return this.predioRepo.listarPorPropietario(propietarioId);
  }
}
