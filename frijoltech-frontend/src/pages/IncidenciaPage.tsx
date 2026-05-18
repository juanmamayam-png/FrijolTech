import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { incidenciaSchema, IncidenciaForm } from '../utils/validators';
import { incidenciaService } from '../services/incidenciaService';
import { campañaService } from '../services/campañaService';
import { Campaña } from '../types/campaña.types';
import { SEVERIDADES } from '../utils/constants';
import { today } from '../utils/formatters';
import { Header } from '../components/layout/Header';
import { Container } from '../components/layout/Container';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { TextArea } from '../components/ui/TextArea';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { PlagaSelector } from '../components/feature/PlagaSelector';
import { FileUpload } from '../components/forms/FileUpload';

export function IncidenciaPage() {
  const navigate = useNavigate();
  const [campañas, setCampañas] = useState<Campaña[]>([]);
  const [recomendacion, setRecomendacion] = useState<string | null>(null);
  const [_fotoBase64, setFotoBase64] = useState<string | null>(null);

  const {
    register, handleSubmit, control, formState: { errors, isSubmitting },
  } = useForm<IncidenciaForm>({
    resolver: zodResolver(incidenciaSchema),
    defaultValues: { fecha: today() },
  });

  useEffect(() => {
    campañaService.listar().then(setCampañas);
  }, []);

  const campañaOptions = campañas.map((c) => ({
    value: c.id,
    label: `Campaña #${c.id} — Lote ${c.loteId}`,
  }));

  async function onSubmit(data: IncidenciaForm) {
    try {
      await incidenciaService.registrar(data.campañaId, {
        fecha: data.fecha,
        severidad: data.severidad,
        observaciones: data.observaciones,
        plagaId: data.plagaId,
      });
      toast.success('Incidencia registrada. Se generó una recomendación.');

      const recomendaciones: Record<IncidenciaForm['severidad'], string> = {
        baja:  'Monitorear semanalmente. Aplicar controles culturales como remoción de tejido afectado.',
        media: 'Aplicar fungicida/insecticida según el tipo de plaga. Revisión cada 3 días.',
        alta:  '⚠️ Alerta máxima: Consultar técnico agrícola inmediatamente. Considerar tratamiento de área completa.',
      };
      setRecomendacion(recomendaciones[data.severidad]);
    } catch {
      toast.error('No se pudo registrar la incidencia. Intenta de nuevo.');
    }
  }

  return (
    <>
      <Header title="Reportar incidencia" showBack />
      <Container>
        <div className="bg-accent-50 border border-accent-200 rounded-xl p-4 flex gap-3 mb-5">
          <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <p className="text-sm text-accent-700">
            Reporte oportunamente cualquier plaga o enfermedad. La detección temprana reduce pérdidas hasta un 60%.
          </p>
        </div>

        <form onSubmit={(e) => { void handleSubmit(onSubmit)(e); }} className="space-y-5" noValidate>
          <Controller
            name="campañaId"
            control={control}
            render={({ field }) => (
              <Select
                label="Campaña afectada"
                options={campañaOptions}
                placeholder="Seleccione una campaña"
                error={errors.campañaId?.message}
                value={field.value?.toString() ?? ''}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />

          <Controller
            name="plagaId"
            control={control}
            render={({ field }) => (
              <PlagaSelector
                value={field.value?.toString() ?? ''}
                onChange={field.onChange}
                error={errors.plagaId?.message}
              />
            )}
          />

          {/* Severidad con radio buttons grandes */}
          <div>
            <p className="block text-sm font-semibold text-dark mb-2">Severidad</p>
            <div className="grid grid-cols-3 gap-2">
              {SEVERIDADES.map((s) => (
                <label
                  key={s.value}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${s.color}`}
                >
                  <input
                    type="radio"
                    value={s.value}
                    {...register('severidad')}
                    className="sr-only"
                  />
                  <span className="text-lg mb-1">
                    {s.value === 'baja' ? '🟢' : s.value === 'media' ? '🟡' : '🔴'}
                  </span>
                  <span className="font-bold text-sm">{s.label}</span>
                </label>
              ))}
            </div>
            {errors.severidad && (
              <p className="mt-1 text-sm text-accent font-medium">{errors.severidad.message}</p>
            )}
          </div>

          <Input
            label="Fecha de observación"
            type="date"
            max={today()}
            {...register('fecha')}
            error={errors.fecha?.message}
          />

          <TextArea
            label="Observaciones"
            placeholder="Describa los síntomas, porcentaje de área afectada, condiciones del cultivo..."
            {...register('observaciones')}
            error={errors.observaciones?.message}
            rows={4}
          />

          <FileUpload label="Foto de la incidencia (opcional)" onImage={setFotoBase64} />

          <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
            Reportar incidencia
          </Button>
        </form>
      </Container>

      {/* Modal de recomendación */}
      <Modal
        isOpen={!!recomendacion}
        onClose={() => { setRecomendacion(null); navigate(-1); }}
        title="Recomendación del sistema"
      >
        <div className="space-y-4">
          <div className="bg-secondary-50 border border-secondary-200 rounded-xl p-4">
            <p className="text-dark text-sm leading-relaxed">{recomendacion}</p>
          </div>
          <p className="text-xs text-muted">
            Este es un apoyo a la toma de decisiones. Consulta siempre a un técnico agrícola certificado.
          </p>
          <Button
            className="w-full"
            onClick={() => { setRecomendacion(null); navigate(-1); }}
          >
            Entendido
          </Button>
        </div>
      </Modal>
    </>
  );
}
