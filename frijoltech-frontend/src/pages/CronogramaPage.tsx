import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Sprout } from 'lucide-react';
import { useCampana } from '../hooks/useCampanas';
import { EtapaFenologica } from '../types/etapa.types';
import { Header } from '../components/layout/Header';
import { Container } from '../components/layout/Container';
import { EtapaTimelineItem } from '../components/feature/EtapaTimelineItem';
import { Spinner } from '../components/ui/Spinner';
import { Badge } from '../components/ui/Badge';
import { formatDateShort } from '../utils/formatters';

export function CronogramaPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { campana: data, loading, error } = useCampana(id ? Number(id) : null);

  function handleRegistrarAvance(etapa: EtapaFenologica) {
    navigate(`/etapas/${etapa.id}/avance`, {
      state: { etapaNombre: etapa.nombre, campanaId: data?.campana.id },
    });
  }

  if (loading) return (
    <>
      <Header title="Cronograma" showBack />
      <div className="flex justify-center py-16"><Spinner size="lg" /></div>
    </>
  );

  if (error || !data) return (
    <>
      <Header title="Cronograma" showBack />
      <Container>
        <div className="bg-accent-50 border border-accent-200 rounded-xl p-5 text-center">
          <p className="text-accent font-medium">{error ?? 'No se encontró la campaña'}</p>
        </div>
      </Container>
    </>
  );

  const { campana, etapas } = data;
  const etapaEnCurso = etapas.find((e) => e.estado === 'en_curso');

  return (
    <>
      <Header
        title="Cronograma fenológico"
        subtitle={`${etapas.length} etapas`}
        showBack
      />
      <Container>
        {/* Resumen de campana */}
        <div className="bg-primary rounded-2xl p-5 mb-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Sprout className="w-5 h-5 text-secondary" />
            <span className="font-bold font-serif">Lote #{campana.loteId}</span>
            <Badge variant="green">{campana.estado}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-secondary-200 text-xs">Fecha de siembra</p>
              <p className="font-semibold flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
                {formatDateShort(campana.fechaSiembra)}
              </p>
            </div>
            <div>
              <p className="text-secondary-200 text-xs">Área sembrada</p>
              <p className="font-semibold mt-0.5">{campana.areaSembrada} ha</p>
            </div>
          </div>
          {etapaEnCurso && (
            <div className="mt-3 pt-3 border-t border-white/20">
              <p className="text-xs text-secondary-200">Etapa actual</p>
              <p className="font-bold mt-0.5">{etapaEnCurso.nombre}</p>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-dark font-serif mb-5 text-lg">Etapas del cultivo</h2>
          {etapas.map((etapa, idx) => (
            <EtapaTimelineItem
              key={etapa.id}
              etapa={etapa}
              isLast={idx === etapas.length - 1}
              onRegistrarAvance={handleRegistrarAvance}
            />
          ))}
        </div>
      </Container>
    </>
  );
}
