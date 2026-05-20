import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Maximize2, Mountain, Calendar, Navigation, Pencil } from 'lucide-react';
import { Predio } from '../types/predio.types';
import { predioService } from '../services/predioService';
import { Header } from '../components/layout/Header';
import { Container } from '../components/layout/Container';
import { Spinner } from '../components/ui/Spinner';
import { formatArea, formatDate } from '../utils/formatters';

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="text-primary mt-0.5 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-muted font-medium uppercase tracking-wide">{label}</p>
        <p className="text-dark font-semibold mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export function PredioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [predio, setPredio] = useState<Predio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    predioService.obtener(Number(id))
      .then(setPredio)
      .catch(() => setError('No se pudo cargar el predio'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <>
      <Header title="Detalle del predio" showBack />
      <div className="flex justify-center py-16"><Spinner size="lg" /></div>
    </>
  );

  if (error || !predio) return (
    <>
      <Header title="Detalle del predio" showBack />
      <Container>
        <div className="bg-accent-50 border border-accent-200 rounded-xl p-5 text-center">
          <p className="text-accent font-medium">{error ?? 'Predio no encontrado'}</p>
        </div>
      </Container>
    </>
  );

  return (
    <>
      <Header
        title={predio.nombre}
        showBack
        rightElement={
          <button
            onClick={() => navigate(`/predios/${id}/editar`)}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Editar predio"
          >
            <Pencil className="w-5 h-5" />
          </button>
        }
      />
      <Container>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-1">
          <InfoRow
            icon={<MapPin className="w-4 h-4" />}
            label="Ubicación"
            value={predio.ubicacion}
          />
          <InfoRow
            icon={<Maximize2 className="w-4 h-4" />}
            label="Área total"
            value={formatArea(predio.areaTotal)}
          />
          {Number(predio.altitud) > 0 && (
            <InfoRow
              icon={<Mountain className="w-4 h-4" />}
              label="Altitud"
              value={`${predio.altitud} msnm`}
            />
          )}
          <InfoRow
            icon={<Navigation className="w-4 h-4" />}
            label="Coordenadas"
            value={`${Number(predio.latitud).toFixed(6)}, ${Number(predio.longitud).toFixed(6)}`}
          />
          <InfoRow
            icon={<Calendar className="w-4 h-4" />}
            label="Registrado el"
            value={formatDate(predio.createdAt)}
          />
        </div>
      </Container>
    </>
  );
}
