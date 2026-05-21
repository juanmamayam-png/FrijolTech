import { api } from './api';
import { Campaña, NuevaCampañaData, CampañaConEtapas } from '../types/campana.types';
import { EtapaFenologica } from '../types/etapa.types';
import { ApiResponse } from '../types/api.types';

export const campañaService = {
  async iniciar(data: NuevaCampañaData): Promise<CampañaConEtapas> {
    const res = await api.post<ApiResponse<CampañaConEtapas>>('/campanas', data);
    return res.data.data;
  },

  async consultar(id: number): Promise<CampañaConEtapas> {
    const res = await api.get<ApiResponse<CampañaConEtapas>>(`/campanas/${id}`);
    return res.data.data;
  },

  async listarEtapas(campañaId: number): Promise<EtapaFenologica[]> {
    const res = await api.get<ApiResponse<EtapaFenologica[]>>(`/campanas/${campañaId}/etapas`);
    return res.data.data;
  },

  async listar(): Promise<Campaña[]> {
    try {
      const res = await api.get<ApiResponse<Campaña[]>>('/campanas');
      return res.data.data;
    } catch {
      return [];
    }
  },
};
