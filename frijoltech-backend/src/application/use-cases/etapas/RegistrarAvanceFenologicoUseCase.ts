import { IEtapaRepository } from '../../../domain/interfaces/IEtapaRepository';
import { DatabaseConnection } from '../../../infrastructure/database/DatabaseConnection';

interface RegistrarAvanceInput {
  etapaId: number;
  campanaId: number;
  observaciones: string;
  fotoUrl?: string;
}

export class RegistrarAvanceFenologicoUseCase {
  private db: DatabaseConnection;

  constructor(private readonly etapaRepo: IEtapaRepository) {
    this.db = DatabaseConnection.getInstance();
  }

  async ejecutar(input: RegistrarAvanceInput): Promise<{ registroId: number }> {
    const etapa = await this.etapaRepo.buscarPorId(input.etapaId);
    if (!etapa) {
      throw new Error('ETAPA_NO_ENCONTRADA');
    }

    const result = await this.db.query<{ id: number }>(
      `INSERT INTO registro_fenologico (fecha, observaciones, foto_url, campana_id, etapa_id)
       VALUES (CURRENT_DATE, $1, $2, $3, $4) RETURNING id`,
      [input.observaciones, input.fotoUrl ?? null, input.campanaId, input.etapaId]
    );

    await this.etapaRepo.actualizarEstado(input.etapaId, 'en_curso');

    return { registroId: result.rows[0].id };
  }
}
