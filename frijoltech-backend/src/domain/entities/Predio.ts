/** Entidad de dominio Predio - unidad productiva del agricultor */
export interface Predio {
  id?: number;
  nombre: string;
  ubicacion: string;
  latitud: number;
  longitud: number;
  altitud: number;
  areaTotal: number;
  propietarioId: number;
  createdAt?: Date;
}
