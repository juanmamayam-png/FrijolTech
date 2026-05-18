import { ICampañaRepository } from '../../../domain/interfaces/ICampañaRepository';
import { IEtapaRepository } from '../../../domain/interfaces/IEtapaRepository';
import { Campaña } from '../../../domain/entities/Campaña';
import { EtapaFenologica } from '../../../domain/entities/EtapaFenologica';

interface ConsultarCampañaOutput {
  campaña: Campaña;
  etapas: EtapaFenologica[];
}

export class ConsultarCampañaUseCase {
  constructor(
    private readonly campañaRepo: ICampañaRepository,
    private readonly etapaRepo: IEtapaRepository
  ) {}

  async ejecutar(campañaId: number): Promise<ConsultarCampañaOutput> {
    const campaña = await this.campañaRepo.buscarPorId(campañaId);
    if (!campaña) {
      throw new Error('CAMPAÑA_NO_ENCONTRADA');
    }

    const etapas = await this.etapaRepo.listarPorCampaña(campañaId);
    return { campaña, etapas };
  }
}
