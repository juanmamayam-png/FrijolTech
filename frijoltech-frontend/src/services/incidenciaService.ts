import { api } from './api';
import { Incidencia, IncidenciaData } from '../types/incidencia.types';
import { ApiResponse } from '../types/api.types';

export const incidenciaService = {
  async registrar(campañaId: number, data: IncidenciaData): Promise<Incidencia> {
    const res = await api.post<ApiResponse<Incidencia>>(
      `/campañas/${campañaId}/incidencias`,
      data
    );
    return res.data.data;
  },
};
