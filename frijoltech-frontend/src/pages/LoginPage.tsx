import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Sprout } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginSchema, LoginForm } from '../utils/validators';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginForm) {
    try {
      const result = await authService.login(data);
      login(result.token, result.usuario);
      toast.success(`¡Bienvenido, ${result.usuario.nombre}!`);
      navigate('/dashboard', { replace: true });
    } catch {
      setError('root', { message: 'Correo o contraseña incorrectos' });
    }
  }

  return (
    <div className="min-h-screen bg-light flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg mb-3">
          <Sprout className="w-9 h-9 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-primary font-serif">FrijolTech</h1>
        <p className="text-muted text-sm mt-1">Sistema de producción agrícola</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-sm p-7">
        <h2 className="text-xl font-bold text-dark font-serif mb-6">Iniciar sesión</h2>

        <form onSubmit={(e) => { void handleSubmit(onSubmit)(e); }} className="space-y-4" noValidate>
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="agricultor@ejemplo.com"
            autoComplete="email"
            {...register('correo')}
            error={errors.correo?.message}
          />

          <Input
            label="Contraseña"
            type={showPass ? 'text' : 'password'}
            placeholder="Tu contraseña"
            autoComplete="current-password"
            {...register('contrasena')}
            error={errors.contrasena?.message}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="text-muted hover:text-dark transition-colors"
                aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            }
          />

          {errors.root && (
            <div className="bg-accent-50 border border-accent-200 rounded-xl px-4 py-3">
              <p className="text-accent text-sm font-medium">{errors.root.message}</p>
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full mt-2"
            loading={isSubmitting}
          >
            Entrar
          </Button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
