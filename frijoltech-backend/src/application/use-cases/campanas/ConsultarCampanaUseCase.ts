import { ICampanaRepository } from '../../../domain/interfaces/ICampanaRepository';
import { IEtapaRepository } from '../../../domain/interfaces/IEtapaRepository';
import { Campana } from '../../../domain/entities/Campana';
import { EtapaFenologica } from '../../../domain/entities/EtapaFenologica';

interface ConsultarCampanaOutput {
  campana: Campana;
  etapas: EtapaFenologica[];
}

export class ConsultarCampanaUseCase {
  constructor(
    private readonly campanaRepo: ICampanaRepository,
    private readonly etapaRepo: IEtapaRepository
  ) {}

  async ejecutar(campanaId: number): Promise<ConsultarCampanaOutput> {
    const campana = await this.campanaRepo.buscarPorId(campanaId);
    if (!campana) {
      throw new Error('CAMPANA_NO_ENCONTRADA');
    }

    const etapas = await this.etapaRepo.listarPorCampana(campanaId);
    return { campana, etapas };
  }
}
