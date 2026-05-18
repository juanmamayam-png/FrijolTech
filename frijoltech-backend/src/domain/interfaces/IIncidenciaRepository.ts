import { IncidenciaFitosanitaria } from '../entities/IncidenciaFitosanitaria';

export interface IIncidenciaRepository {
  crear(incidencia: Omit<IncidenciaFitosanitaria, 'id'>): Promise<IncidenciaFitosanitaria>;
  listarPorCampaña(campañaId: number): Promise<IncidenciaFitosanitaria[]>;
}
