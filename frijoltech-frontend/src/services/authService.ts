import { api } from './api';
import { LoginCredentials, RegisterData, LoginResponse } from '../types/usuario.types';
import { ApiResponse } from '../types/api.types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const res = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    return res.data.data;
  },

  async register(data: RegisterData): Promise<{ id: number; nombre: string; correo: string }> {
    const res = await api.post<ApiResponse<{ id: number; nombre: string; correo: string }>>('/auth/register', data);
    return res.data.data;
  },
};
