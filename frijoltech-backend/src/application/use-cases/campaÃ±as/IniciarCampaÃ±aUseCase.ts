import { ICampañaRepository } from '../../../domain/interfaces/ICampañaRepository';
import { IEtapaRepository } from '../../../domain/interfaces/IEtapaRepository';
import { FabricaSelector } from '../../factories/FabricaSelector';
import { Campaña } from '../../../domain/entities/Campaña';
import { EtapaFenologica } from '../../../domain/entities/EtapaFenologica';

interface IniciarCampañaInput {
  fechaSiembra: Date;
  areaSembrada: number;
  loteId: number;
  variedadId: number;
  nombreVariedad: string;
}

interface IniciarCampañaOutput {
  campaña: Campaña;
  etapas: EtapaFenologica[];
}

export class IniciarCampañaUseCase {
  constructor(
    private readonly campañaRepo: ICampañaRepository,
    private readonly etapaRepo: IEtapaRepository
  ) {}

  async ejecutar(input: IniciarCampañaInput): Promise<IniciarCampañaOutput> {
    const campaña = await this.campañaRepo.crear({
      fechaSiembra: input.fechaSiembra,
      areaSembrada: input.areaSembrada,
      estado: 'activa',
      loteId: input.loteId,
      variedadId: input.variedadId,
    });

    const fabrica = FabricaSelector.obtenerFabrica(input.nombreVariedad);
    const plantillaEtapas = fabrica.generarCronograma(campaña.id!, input.fechaSiembra);
    const etapas = await this.etapaRepo.crearLote(plantillaEtapas);

    return { campaña, etapas };
  }
}
