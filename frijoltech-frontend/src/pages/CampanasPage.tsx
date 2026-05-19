import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Campana } from '../types/campana.types';
import { campanaService } from '../services/campanaService';
import { Header } from '../components/layout/Header';
import { Container } from '../components/layout/Container';
import { CampanaCard } from '../components/feature/CampanaCard';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';

export function CampanasPage() {
  const navigate = useNavigate();
  const [campanas, setCampanas] = useState<Campana[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    campanaService.listar().then(setCampanas).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header title="Mis campañas" />
      <Container>
        {loading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : campanas.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted mb-4">No tienes campanas activas</p>
            <Button onClick={() => navigate('/campanas/nueva')}>
              <Plus className="w-4 h-4" /> Iniciar campana
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {campanas.map((c) => (
              <CampanaCard
                key={c.id}
                campana={c}
                onClick={() => navigate(`/campanas/${c.id}/cronograma`)}
              />
            ))}
          </div>
        )}
      </Container>

      <button
        onClick={() => navigate('/campanas/nueva')}
        className="fixed bottom-24 right-5 md:bottom-8 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-xl hover:bg-primary-600 active:scale-95 transition-all z-20"
        aria-label="Nueva campaña"
      >
        <Plus className="w-7 h-7 text-white" />
      </button>
    </>
  );
}
