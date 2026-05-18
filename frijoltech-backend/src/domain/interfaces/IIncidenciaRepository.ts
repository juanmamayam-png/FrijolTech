import { IncidenciaFitosanitaria } from '../entities/IncidenciaFitosanitaria';

export interface IIncidenciaRepository {
  crear(incidencia: Omit<IncidenciaFitosanitaria, 'id'>): Promise<IncidenciaFitosanitaria>;
  listarPorCampana(campanaId: number): Promise<IncidenciaFitosanitaria[]>;
}
