import { api } from './api';
import { Campaña, NuevaCampañaData, CampañaConEtapas } from '../types/campaña.types';
import { EtapaFenologica } from '../types/etapa.types';
import { ApiResponse } from '../types/api.types';

export const campañaService = {
  async iniciar(data: NuevaCampañaData): Promise<CampañaConEtapas> {
    const res = await api.post<ApiResponse<CampañaConEtapas>>('/campañas', data);
    return res.data.data;
  },

  async consultar(id: number): Promise<CampañaConEtapas> {
    const res = await api.get<ApiResponse<CampañaConEtapas>>(`/campañas/${id}`);
    return res.data.data;
  },

  async listarEtapas(campañaId: number): Promise<EtapaFenologica[]> {
    const res = await api.get<ApiResponse<EtapaFenologica[]>>(`/campañas/${campañaId}/etapas`);
    return res.data.data;
  },

  // Simulación local de listado hasta que el backend tenga el endpoint
  async listar(): Promise<Campaña[]> {
    try {
      const res = await api.get<ApiResponse<Campaña[]>>('/campañas');
      return res.data.data;
    } catch {
      return [];
    }
  },
};
