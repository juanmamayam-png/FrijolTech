import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario, AuthState } from '../types/usuario.types';
import { TOKEN_KEY, USUARIO_KEY } from '../utils/constants';

interface AuthContextValue extends AuthState {
  login: (token: string, usuario: Usuario) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const raw = localStorage.getItem(USUARIO_KEY);
    const usuario: Usuario | null = raw ? (JSON.parse(raw) as Usuario) : null;
    return { token, usuario, isAuthenticated: !!token && !!usuario };
  });

  useEffect(() => {
    if (state.token) {
      localStorage.setItem(TOKEN_KEY, state.token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    if (state.usuario) {
      localStorage.setItem(USUARIO_KEY, JSON.stringify(state.usuario));
    } else {
      localStorage.removeItem(USUARIO_KEY);
    }
  }, [state.token, state.usuario]);

  function login(token: string, usuario: Usuario) {
    setState({ token, usuario, isAuthenticated: true });
  }

  function logout() {
    setState({ token: null, usuario: null, isAuthenticated: false });
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
