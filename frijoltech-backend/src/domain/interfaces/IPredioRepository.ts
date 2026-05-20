import { Predio } from '../entities/Predio';

export interface IPredioRepository {
  crear(predio: Omit<Predio, 'id' | 'createdAt'>): Promise<Predio>;
  listarPorPropietario(propietarioId: number): Promise<Predio[]>;
  buscarPorId(id: number): Promise<Predio | null>;
  actualizar(id: number, datos: Partial<Omit<Predio, 'id' | 'propietarioId' | 'createdAt'>>): Promise<Predio>;
}
