import { api } from './api';
import { Plaga } from '../types/incidencia.types';
import { ApiResponse } from '../types/api.types';

export const plagaService = {
  async listar(): Promise<Plaga[]> {
    const res = await api.get<ApiResponse<Plaga[]>>('/plagas');
    return res.data.data;
  },
};
