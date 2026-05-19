import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { avanceSchema, AvanceForm } from '../utils/validators';
import { etapaService } from '../services/etapaService';
import { Header } from '../components/layout/Header';
import { Container } from '../components/layout/Container';
import { TextArea } from '../components/ui/TextArea';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { FileUpload } from '../components/forms/FileUpload';
import { today } from '../utils/formatters';

interface LocationState {
  etapaNombre?: string;
  campanaId?: number;
}

export function RegistroAvancePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const [fotoBase64, setFotoBase64] = useState<string | null>(null);
  const [fecha, setFecha] = useState(today());

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AvanceForm>({
    resolver: zodResolver(avanceSchema),
  });

  async function onSubmit(data: AvanceForm) {
    if (!id || !state?.campanaId) {
      toast.error('Datos de etapa incompletos');
      return;
    }
    try {
      await etapaService.registrarAvance(Number(id), {
        campanaId: state.campanaId,
        observaciones: data.observaciones,
        fotoUrl: fotoBase64 ?? undefined,
      });
      toast.success('Avance registrado exitosamente');
      navigate(-1);
    } catch {
      toast.error('No se pudo guardar el avance. Intenta de nuevo.');
    }
  }

  return (
    <>
      <Header
        title="Registrar avance"
        subtitle={state?.etapaNombre ?? 'Etapa fenológica'}
        showBack
      />
      <Container>
        <form onSubmit={(e) => { void handleSubmit(onSubmit)(e); }} className="space-y-5" noValidate>
          <div>
            <label className="block text-sm font-semibold text-dark mb-1.5">
              Fecha de observación
            </label>
            <Input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              max={today()}
            />
          </div>

          <TextArea
            label="Observaciones"
            placeholder="Describa el estado del cultivo, cambios observados, anomalías..."
            {...register('observaciones')}
            error={errors.observaciones?.message}
            rows={5}
          />

          <FileUpload
            label="Foto del cultivo (opcional)"
            onImage={setFotoBase64}
          />

          <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
            Guardar registro
          </Button>
        </form>
      </Container>
    </>
  );
}
