import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Sprout } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerSchema, RegisterForm } from '../utils/validators';
import { authService } from '../services/authService';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function RegisterPage() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterForm) {
    try {
      await authService.register({
        nombre: data.nombre,
        correo: data.correo,
        contraseña: data.contraseña,
      });
      toast.success('Cuenta creada. ¡Ya puedes iniciar sesión!');
      navigate('/login', { replace: true });
    } catch {
      setError('root', { message: 'No se pudo crear la cuenta. El correo puede ya estar registrado.' });
    }
  }

  return (
    <div className="min-h-screen bg-light flex flex-col items-center justify-center px-4 py-12">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg mb-3">
          <Sprout className="w-9 h-9 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-primary font-serif">FrijolTech</h1>
      </div>

      <div className="bg-white rounded-3xl shadow-lg w-full max-w-sm p-7">
        <h2 className="text-xl font-bold text-dark font-serif mb-6">Crear cuenta</h2>

        <form onSubmit={(e) => { void handleSubmit(onSubmit)(e); }} className="space-y-4" noValidate>
          <Input
            label="Nombre completo"
            placeholder="Pedro Agricultor"
            autoComplete="name"
            {...register('nombre')}
            error={errors.nombre?.message}
          />
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="pedro@finca.com"
            autoComplete="email"
            {...register('correo')}
            error={errors.correo?.message}
          />
          <Input
            label="Contraseña"
            type={showPass ? 'text' : 'password'}
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
            {...register('contraseña')}
            error={errors.contraseña?.message}
            rightElement={
              <button type="button" onClick={() => setShowPass((s) => !s)} className="text-muted" aria-label="Toggle contraseña">
                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            }
          />
          <Input
            label="Confirmar contraseña"
            type={showPass ? 'text' : 'password'}
            placeholder="Repite tu contraseña"
            autoComplete="new-password"
            {...register('confirmarContraseña')}
            error={errors.confirmarContraseña?.message}
          />

          {errors.root && (
            <div className="bg-accent-50 border border-accent-200 rounded-xl px-4 py-3">
              <p className="text-accent text-sm font-medium">{errors.root.message}</p>
            </div>
          )}

          <Button type="submit" size="lg" className="w-full mt-2" loading={isSubmitting}>
            Crear cuenta
          </Button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
