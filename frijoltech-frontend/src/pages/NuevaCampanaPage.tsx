import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { campanaSchema, CampanaForm } from '../utils/validators';
import { campanaService } from '../services/campanaService';
import { predioService } from '../services/predioService';
import { Predio, Lote } from '../types/predio.types';
import { VARIEDADES } from '../utils/constants';
import { today } from '../utils/formatters';
import { Header } from '../components/layout/Header';
import { Container } from '../components/layout/Container';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';

export function NuevaCampanaPage() {
  const navigate = useNavigate();
  const [predios, setPredios] = useState<Predio[]>([]);
  const [lotes, setLotes] = useState<Lote[]>([]);

  const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting } } = useForm<CampanaForm>({
    resolver: zodResolver(campanaSchema),
    defaultValues: { fechaSiembra: today() },
  });

  const predioIdWatch = watch('loteId');

  useEffect(() => {
    predioService.listar().then(setPredios);
  }, []);

  // Cuando cambia el predio seleccionado, cargar sus lotes (simulado con lote genérico)
  useEffect(() => {
    if (predios.length > 0) {
      // Por ahora generamos un lote por predio hasta que el backend exponga el endpoint
      const lotesSim: Lote[] = predios.map((p, i) => ({
        id: i + 1,
        nombre: `Lote A - ${p.nombre}`,
        area: p.areaTotal,
        predioId: p.id,
      }));
      setLotes(lotesSim);
    }
  }, [predios, predioIdWatch]);

  async function onSubmit(data: CampanaForm) {
    try {
      const result = await campanaService.iniciar(data);
      toast.success('¡Campaña iniciada! Cronograma generado.');
      navigate(`/campanas/${result.campana.id}/cronograma`, { replace: true });
    } catch {
      toast.error('No se pudo iniciar la campaña. Verifica los datos.');
    }
  }

  const loteOptions = lotes.map((l) => ({ value: l.id, label: l.nombre }));
  const variedadOptions = VARIEDADES.map((v) => ({ value: v.value, label: v.label }));

  return (
    <>
      <Header title="Nueva campaña" showBack />
      <Container>
        <p className="text-muted text-sm mb-5">
          Al iniciar la campana, el sistema generará automáticamente el cronograma fenológico
          con las 7 etapas de desarrollo del fríjol.
        </p>

        <form onSubmit={(e) => { void handleSubmit(onSubmit)(e); }} className="space-y-5" noValidate>
          <Controller
            name="loteId"
            control={control}
            render={({ field }) => (
              <Select
                label="Lote de siembra"
                options={loteOptions}
                placeholder="Seleccione un lote"
                error={errors.loteId?.message}
                value={field.value?.toString() ?? ''}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  field.onChange(v);
                  setValue('loteId', v);
                }}
              />
            )}
          />

          <Controller
            name="nombreVariedad"
            control={control}
            render={({ field }) => (
              <div>
                <Select
                  label="Variedad de fríjol"
                  options={variedadOptions}
                  placeholder="Seleccione variedad"
                  error={errors.nombreVariedad?.message}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const val = e.target.value as CampanaForm['nombreVariedad'];
                    field.onChange(val);
                    const idx = VARIEDADES.findIndex((v) => v.value === val);
                    setValue('variedadId', idx + 1);
                  }}
                />
                {field.value && (
                  <p className="mt-1 text-xs text-muted">
                    {VARIEDADES.find((v) => v.value === field.value)?.descripcion}
                  </p>
                )}
              </div>
            )}
          />

          <Input
            label="Fecha de siembra"
            type="date"
            {...register('fechaSiembra')}
            error={errors.fechaSiembra?.message}
          />

          <Input
            label="Área sembrada (ha)"
            type="number"
            step="0.01"
            placeholder="2.50"
            {...register('areaSembrada', { valueAsNumber: true })}
            error={errors.areaSembrada?.message}
          />

          <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
            Iniciar campana y generar cronograma
          </Button>
        </form>
      </Container>
    </>
  );
}
