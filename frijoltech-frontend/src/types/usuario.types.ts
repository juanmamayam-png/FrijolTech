export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rolId: number;
}

export interface AuthState {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  correo: string;
  contraseña: string;
}

export interface RegisterData {
  nombre: string;
  correo: string;
  contraseña: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}
