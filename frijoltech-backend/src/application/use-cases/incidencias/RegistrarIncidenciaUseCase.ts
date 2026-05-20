import { IIncidenciaRepository } from '../../../domain/interfaces/IIncidenciaRepository';
import { ICampanaRepository } from '../../../domain/interfaces/ICampanaRepository';
import { IncidenciaFitosanitaria } from '../../../domain/entities/IncidenciaFitosanitaria';
import { MonitorAgroclimatico } from '../../../domain/services/MonitorAgroclimatico';
import { NotificadorAgricultor } from '../../observers/NotificadorAgricultor';
import { MotorRecomendaciones } from '../../observers/MotorRecomendaciones';
import { DashboardRealtime } from '../../observers/DashboardRealtime';
import { BitacoraEventos } from '../../observers/BitacoraEventos';

type RegistrarIncidenciaInput = Omit<IncidenciaFitosanitaria, 'id'>;

export class RegistrarIncidenciaUseCase {
  constructor(
    private readonly incidenciaRepo: IIncidenciaRepository,
    private readonly campanaRepo: ICampanaRepository
  ) {}

  async ejecutar(input: RegistrarIncidenciaInput): Promise<IncidenciaFitosanitaria> {
    const campana = await this.campanaRepo.buscarPorId(input.campanaId);
    if (!campana) {
      throw new Error('CAMPANA_NO_ENCONTRADA');
    }

    const incidencia = await this.incidenciaRepo.crear(input);

    if (input.severidad === 'alta') {
      const monitor = new MonitorAgroclimatico();
      monitor.suscribir(new NotificadorAgricultor());
      monitor.suscribir(new MotorRecomendaciones());
      monitor.suscribir(new DashboardRealtime());
      monitor.suscribir(new BitacoraEventos());

      await monitor.notificar({
        tipo: 'TEMPERATURA_ALTA' as never,
        valorObservado: 0,
        umbralEsperado: 0,
        fecha: new Date(),
        campanaId: input.campanaId,
        etapaActual: 'incidencia_fitosanitaria_alta',
      });
    }

    return incidencia;
  }
}
