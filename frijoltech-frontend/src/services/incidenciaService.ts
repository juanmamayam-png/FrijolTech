import { api } from './api';
import { Incidencia, IncidenciaData } from '../types/incidencia.types';
import { ApiResponse } from '../types/api.types';

export const incidenciaService = {
  async registrar(campanaId: number, data: IncidenciaData): Promise<Incidencia> {
    const res = await api.post<ApiResponse<Incidencia>>(
      `/campanas/${campanaId}/incidencias`,
      data
    );
    return res.data.data;
  },
};
