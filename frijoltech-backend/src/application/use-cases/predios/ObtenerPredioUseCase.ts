import { IPredioRepository } from '../../../domain/interfaces/IPredioRepository';
import { Predio } from '../../../domain/entities/Predio';

export class ObtenerPredioUseCase {
  constructor(private readonly predioRepo: IPredioRepository) {}

  async ejecutar(id: number): Promise<Predio> {
    const predio = await this.predioRepo.buscarPorId(id);
    if (!predio) throw new Error('PREDIO_NO_ENCONTRADO');
    return predio;
  }
}
