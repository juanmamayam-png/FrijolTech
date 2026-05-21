import { IPredioRepository } from '../../../domain/interfaces/IPredioRepository';
import { Predio } from '../../../domain/entities/Predio';

export class ActualizarPredioUseCase {
  constructor(private readonly predioRepo: IPredioRepository) {}

  async ejecutar(id: number, datos: Partial<Omit<Predio, 'id' | 'propietarioId' | 'createdAt'>>): Promise<Predio> {
    const existe = await this.predioRepo.buscarPorId(id);
    if (!existe) throw new Error('PREDIO_NO_ENCONTRADO');
    return this.predioRepo.actualizar(id, datos);
  }
}
