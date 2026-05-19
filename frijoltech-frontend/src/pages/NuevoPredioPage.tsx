import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Navigation } from 'lucide-react';
import toast from 'react-hot-toast';
import { predioSchema, PredioForm } from '../utils/validators';
import { predioService } from '../services/predioService';
import { NuevoPredioData } from '../types/predio.types';
import { Header } from '../components/layout/Header';
import { Container } from '../components/layout/Container';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function NuevoPredioPage() {
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<PredioForm>({
    resolver: zodResolver(predioSchema),
    defaultValues: { latitud: 0, longitud: 0, altitud: 0 },
  });

  function usarUbicacion() {
    if (!navigator.geolocation) {
      toast.error('Geolocalización no disponible en este dispositivo');
      return;
    }
    const id = toast.loading('Obteniendo ubicación...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setValue('latitud', pos.coords.latitude, { shouldValidate: true });
        setValue('longitud', pos.coords.longitude, { shouldValidate: true });
        if (pos.coords.altitude) {
          setValue('altitud', Math.round(pos.coords.altitude), { shouldValidate: true });
        }
        toast.dismiss(id);
        toast.success('Ubicación obtenida');
      },
      () => {
        toast.dismiss(id);
        toast.error('No se pudo obtener la ubicación');
      }
    );
  }

  async function onSubmit(data: PredioForm) {
    try {
      await predioService.crear(data as NuevoPredioData);
      toast.success('Predio registrado exitosamente');
      navigate('/predios', { replace: true });
    } catch {
      toast.error('No se pudo registrar el predio. Intenta de nuevo.');
    }
  }

  return (
    <>
      <Header title="Nuevo predio" showBack />
      <Container>
        <form onSubmit={(e) => { void handleSubmit(onSubmit)(e); }} className="space-y-5" noValidate>
          <Input
            label="Nombre del predio"
            placeholder="Finca La Esperanza"
            {...register('nombre')}
            error={errors.nombre?.message}
          />
          <Input
            label="Ubicación"
            placeholder="Vereda La Palma, Pitalito, Huila"
            {...register('ubicacion')}
            error={errors.ubicacion?.message}
          />

          {/* Geolocation */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Latitud"
              type="number"
              step="any"
              placeholder="1.8552"
              {...register('latitud', { valueAsNumber: true })}
              error={errors.latitud?.message}
            />
            <Input
              label="Longitud"
              type="number"
              step="any"
              placeholder="-76.05"
              {...register('longitud', { valueAsNumber: true })}
              error={errors.longitud?.message}
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={usarUbicacion}
            className="w-full border border-dashed border-primary/40"
          >
            <Navigation className="w-4 h-4" />
            Usar mi ubicación actual
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Altitud (msnm)"
              type="number"
              placeholder="1650"
              {...register('altitud', { valueAsNumber: true })}
              error={errors.altitud?.message}
            />
            <Input
              label="Área total (ha)"
              type="number"
              step="0.01"
              placeholder="3.50"
              {...register('areaTotal', { valueAsNumber: true })}
              error={errors.areaTotal?.message}
            />
          </div>

          <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
            Guardar predio
          </Button>
        </form>
      </Container>
    </>
  );
}
