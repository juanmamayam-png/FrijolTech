/** Entidad de dominio Usuario - núcleo del sistema de autenticación */
export interface Usuario {
  id?: number;
  nombre: string;
  correo: string;
  contraseñaHash: string;
  rolId: number;
  createdAt?: Date;
}
