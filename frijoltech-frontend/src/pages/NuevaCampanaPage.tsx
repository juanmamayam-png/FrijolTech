import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { campañaSchema, CampañaForm } from '../utils/validators';
import { campañaService } from '../services/campanaService';
import { predioService } from '../services/predioService';
import { Predio, Lote } from '../types/predio.types';
import { Spinner } from '../components/ui/Spinner';
import { VARIEDADES } from '../utils/constants';
import { today } from '../utils/formatters';
import { Header } from '../components/layout/Header';
import { Container } from '../components/layout/Container';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';

export function NuevaCampañaPage() {
  const navigate = useNavigate();
  const [predios, setPredios] = useState<Predio[]>([]);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [cargandoLotes, setCargandoLotes] = useState(false);
  const [predioSeleccionado, setPredioSeleccionado] = useState<number | null>(null);

  const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting } } = useForm<CampañaForm>({
    resolver: zodResolver(campañaSchema),
    defaultValues: { fechaSiembra: today() },
  });

  const loteIdWatch = watch('loteId');

  useEffect(() => {
    predioService.listar().then(setPredios);
  }, []);

  useEffect(() => {
    if (!predioSeleccionado) return;
    setCargandoLotes(true);
    predioService.listarLotes(predioSeleccionado)
      .then(setLotes)
      .catch(() => setLotes([]))
      .finally(() => setCargandoLotes(false));
  }, [predioSeleccionado]);

  // Cuando hay un solo predio, cargarlo automáticamente
  useEffect(() => {
    if (predios.length === 1) setPredioSeleccionado(predios[0].id);
  }, [predios]);

  void loteIdWatch;

  async function onSubmit(data: CampañaForm) {
    try {
      const result = await campañaService.iniciar(data);
      toast.success('¡Campaña iniciada! Cronograma generado.');
      navigate(`/campañas/${result.campaña.id}/cronograma`, { replace: true });
    } catch {
      toast.error('No se pudo iniciar la campaña. Verifica los datos.');
    }
  }

  const predioOptions = predios.map((p) => ({ value: p.id, label: p.nombre }));
  const loteOptions = lotes.map((l) => ({ value: l.id, label: l.nombre }));
  const variedadOptions = VARIEDADES.map((v) => ({ value: v.value, label: v.label }));

  return (
    <>
      <Header title="Nueva campaña" showBack />
      <Container>
        <p className="text-muted text-sm mb-5">
          Al iniciar la campaña, el sistema generará automáticamente el cronograma fenológico
          con las 7 etapas de desarrollo del fríjol.
        </p>

        <form onSubmit={(e) => { void handleSubmit(onSubmit)(e); }} className="space-y-5" noValidate>
          {predios.length > 1 && (
            <Select
              label="Predio"
              options={predioOptions}
              placeholder="Seleccione un predio"
              value={predioSeleccionado?.toString() ?? ''}
              onChange={(e) => {
                setPredioSeleccionado(Number(e.target.value));
                setValue('loteId', 0);
              }}
            />
          )}

          <Controller
            name="loteId"
            control={control}
            render={({ field }) => (
              <div>
                <Select
                  label="Lote de siembra"
                  options={loteOptions}
                  placeholder={cargandoLotes ? 'Cargando lotes…' : 'Seleccione un lote'}
                  error={errors.loteId?.message}
                  value={field.value?.toString() ?? ''}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    field.onChange(v);
                    setValue('loteId', v);
                  }}
                />
                {cargandoLotes && <Spinner size="sm" />}
              </div>
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
                    const val = e.target.value as CampañaForm['nombreVariedad'];
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
            Iniciar campaña y generar cronograma
          </Button>
        </form>
      </Container>
    </>
  );
}
