import { useNavigate } from 'react-router-dom';
import { Plus, MapPin } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Container } from '../components/layout/Container';
import { PredioCard } from '../components/feature/PredioCard';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { usePredios } from '../hooks/usePredios';

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg viewBox="0 0 120 120" className="w-28 h-28 mb-4" aria-hidden="true">
        <rect x="10" y="60" width="100" height="50" rx="8" fill="#d8ecd8"/>
        <rect x="25" y="30" width="70" height="55" rx="6" fill="#b3d9b4"/>
        <rect x="40" y="10" width="40" height="50" rx="4" fill="#2C5F2D"/>
        <rect x="48" y="70" width="24" height="30" rx="3" fill="#97BC62"/>
        <circle cx="60" cy="55" r="8" fill="#F5F1E8"/>
        <path d="M56 55 L59 58 L64 51" stroke="#2C5F2D" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </svg>
      <h3 className="text-lg font-bold text-dark font-serif mb-2">Sin predios registrados</h3>
      <p className="text-muted text-sm mb-6 max-w-xs">
        Agrega tu primer predio para comenzar a gestionar tus cultivos de fríjol.
      </p>
      <Button onClick={onAdd} size="lg">
        <Plus className="w-5 h-5" />
        Agregar primer predio
      </Button>
    </div>
  );
}

export function PrediosPage() {
  const navigate = useNavigate();
  const { predios, loading, error, recargar } = usePredios();

  return (
    <>
      <Header title="Mis predios" rightElement={
        <div className="flex items-center gap-1 text-white/80 text-sm">
          <MapPin className="w-4 h-4" />
          <span>{predios.length}</span>
        </div>
      } />
      <Container>
        {loading && (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        )}

        {error && (
          <div className="bg-accent-50 border border-accent-200 rounded-xl p-4 text-center">
            <p className="text-accent text-sm font-medium mb-3">{error}</p>
            <Button variant="outline" size="sm" onClick={() => { void recargar(); }}>Reintentar</Button>
          </div>
        )}

        {!loading && !error && predios.length === 0 && (
          <EmptyState onAdd={() => navigate('/predios/nuevo')} />
        )}

        {!loading && predios.length > 0 && (
          <div className="space-y-3">
            {predios.map((predio) => (
              <PredioCard
                key={predio.id}
                predio={predio}
                onClick={() => navigate(`/predios/${predio.id}`)}
              />
            ))}
          </div>
        )}
      </Container>

      {/* FAB */}
      {!loading && (
        <button
          onClick={() => navigate('/predios/nuevo')}
          className="fixed bottom-24 right-5 md:bottom-8 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-xl hover:bg-primary-600 active:scale-95 transition-all z-20"
          aria-label="Agregar nuevo predio"
        >
          <Plus className="w-7 h-7 text-white" />
        </button>
      )}
    </>
  );
}
