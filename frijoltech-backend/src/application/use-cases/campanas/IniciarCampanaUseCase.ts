import { ICampanaRepository } from '../../../domain/interfaces/ICampanaRepository';
import { IEtapaRepository } from '../../../domain/interfaces/IEtapaRepository';
import { FabricaSelector } from '../../factories/FabricaSelector';
import { Campana } from '../../../domain/entities/Campana';
import { EtapaFenologica } from '../../../domain/entities/EtapaFenologica';

interface IniciarCampanaInput {
  fechaSiembra: Date;
  areaSembrada: number;
  loteId: number;
  variedadId: number;
  nombreVariedad: string;
}

interface IniciarCampanaOutput {
  campana: Campana;
  etapas: EtapaFenologica[];
}

export class IniciarCampanaUseCase {
  constructor(
    private readonly campanaRepo: ICampanaRepository,
    private readonly etapaRepo: IEtapaRepository
  ) {}

  async ejecutar(input: IniciarCampanaInput): Promise<IniciarCampanaOutput> {
    const campana = await this.campanaRepo.crear({
      fechaSiembra: input.fechaSiembra,
      areaSembrada: input.areaSembrada,
      estado: 'activa',
      loteId: input.loteId,
      variedadId: input.variedadId,
    });

    const fabrica = FabricaSelector.obtenerFabrica(input.nombreVariedad);
    const plantillaEtapas = fabrica.generarCronograma(campana.id!, input.fechaSiembra);
    const etapas = await this.etapaRepo.crearLote(plantillaEtapas);

    return { campana, etapas };
  }
}
