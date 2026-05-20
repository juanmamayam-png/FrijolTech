import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Navigation } from 'lucide-react';
import toast from 'react-hot-toast';
import { predioSchema, PredioForm } from '../utils/validators';
import { predioService } from '../services/predioService';
import { Header } from '../components/layout/Header';
import { Container } from '../components/layout/Container';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';

export function EditarPredioPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(true);

  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<PredioForm>({
    resolver: zodResolver(predioSchema),
  });

  useEffect(() => {
    if (!id) return;
    predioService.obtener(Number(id)).then((predio) => {
      reset({
        nombre:    predio.nombre,
        ubicacion: predio.ubicacion,
        latitud:   Number(predio.latitud),
        longitud:  Number(predio.longitud),
        altitud:   Number(predio.altitud),
        areaTotal: Number(predio.areaTotal),
      });
    }).catch(() => {
      toast.error('No se pudo cargar el predio');
      navigate(-1);
    }).finally(() => setCargando(false));
  }, [id, reset, navigate]);

  function usarUbicacion() {
    if (!navigator.geolocation) {
      toast.error('Geolocalización no disponible en este dispositivo');
      return;
    }
    const toastId = toast.loading('Obteniendo ubicación...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setValue('latitud', pos.coords.latitude, { shouldValidate: true });
        setValue('longitud', pos.coords.longitude, { shouldValidate: true });
        if (pos.coords.altitude) {
          setValue('altitud', Math.round(pos.coords.altitude), { shouldValidate: true });
        }
        toast.dismiss(toastId);
        toast.success('Ubicación actualizada');
      },
      () => {
        toast.dismiss(toastId);
        toast.error('No se pudo obtener la ubicación');
      },
    );
  }

  async function onSubmit(data: PredioForm) {
    try {
      await predioService.actualizar(Number(id), data);
      toast.success('Predio actualizado correctamente');
      navigate(`/predios/${id}`, { replace: true });
    } catch {
      toast.error('No se pudo actualizar el predio. Intenta de nuevo.');
    }
  }

  if (cargando) return (
    <>
      <Header title="Editar predio" showBack />
      <div className="flex justify-center py-16"><Spinner size="lg" /></div>
    </>
  );

  return (
    <>
      <Header title="Editar predio" showBack />
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
            Guardar cambios
          </Button>
        </form>
      </Container>
    </>
  );
}
