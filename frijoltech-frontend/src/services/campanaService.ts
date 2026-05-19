import { api } from './api';
import { Campana, NuevaCampanaData, CampanaConEtapas } from '../types/campana.types';
import { EtapaFenologica } from '../types/etapa.types';
import { ApiResponse } from '../types/api.types';

export const campanaService = {
  async iniciar(data: NuevaCampanaData): Promise<CampanaConEtapas> {
    const res = await api.post<ApiResponse<CampanaConEtapas>>('/campanas', data);
    return res.data.data;
  },

  async consultar(id: number): Promise<CampanaConEtapas> {
    const res = await api.get<ApiResponse<CampanaConEtapas>>(`/campanas/${id}`);
    return res.data.data;
  },

  async listarEtapas(campanaId: number): Promise<EtapaFenologica[]> {
    const res = await api.get<ApiResponse<EtapaFenologica[]>>(`/campanas/${campanaId}/etapas`);
    return res.data.data;
  },

  // Simulación local de listado hasta que el backend tenga el endpoint
  async listar(): Promise<Campana[]> {
    try {
      const res = await api.get<ApiResponse<Campana[]>>('/campanas');
      return res.data.data;
    } catch {
      return [];
    }
  },
};
