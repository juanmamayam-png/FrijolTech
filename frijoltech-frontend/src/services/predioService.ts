import { api } from './api';
import { Predio, NuevoPredioData } from '../types/predio.types';
import { ApiResponse } from '../types/api.types';

export const predioService = {
  async listar(): Promise<Predio[]> {
    const res = await api.get<ApiResponse<Predio[]>>('/predios');
    return res.data.data;
  },

  async crear(data: NuevoPredioData): Promise<Predio> {
    const res = await api.post<ApiResponse<Predio>>('/predios', data);
    return res.data.data;
  },
};
