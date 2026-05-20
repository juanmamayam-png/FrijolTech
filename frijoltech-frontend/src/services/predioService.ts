import { api } from './api';
import { Predio, NuevoPredioData, Lote } from '../types/predio.types';
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

  async obtener(id: number): Promise<Predio> {
    const res = await api.get<ApiResponse<Predio>>(`/predios/${id}`);
    return res.data.data;
  },

  async actualizar(id: number, data: NuevoPredioData): Promise<Predio> {
    const res = await api.put<ApiResponse<Predio>>(`/predios/${id}`, data);
    return res.data.data;
  },

  async listarLotes(predioId: number): Promise<Lote[]> {
    const res = await api.get<ApiResponse<Lote[]>>(`/predios/${predioId}/lotes`);
    return res.data.data;
  },
};
