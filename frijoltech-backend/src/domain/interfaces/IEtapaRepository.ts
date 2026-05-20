import { EtapaFenologica } from '../entities/EtapaFenologica';

export interface IEtapaRepository {
  crearLote(etapas: Omit<EtapaFenologica, 'id'>[]): Promise<EtapaFenologica[]>;
  listarPorCampana(campanaId: number): Promise<EtapaFenologica[]>;
  buscarPorId(id: number): Promise<EtapaFenologica | null>;
  actualizarEstado(id: number, estado: EtapaFenologica['estado']): Promise<EtapaFenologica>;
}
