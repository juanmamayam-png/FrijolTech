import { api } from './api';
import { RegistroAvanceData } from '../types/etapa.types';
import { ApiResponse } from '../types/api.types';

export const etapaService = {
  async registrarAvance(
    etapaId: number,
    data: RegistroAvanceData
  ): Promise<{ registroId: number }> {
    const res = await api.post<ApiResponse<{ registroId: number }>>(
      `/etapas/${etapaId}/avance`,
      data
    );
    return res.data.data;
  },
};
