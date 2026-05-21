import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Campaña } from '../types/campana.types';
import { campañaService } from '../services/campanaService';
import { Header } from '../components/layout/Header';
import { Container } from '../components/layout/Container';
import { CampañaCard } from '../components/feature/CampanaCard';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';

export function CampañasPage() {
  const navigate = useNavigate();
  const [campañas, setCampañas] = useState<Campaña[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    campañaService.listar().then(setCampañas).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header title="Mis campañas" showBack />
      <Container>
        {loading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : campañas.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted mb-4">No tienes campañas activas</p>
            <Button onClick={() => navigate('/campañas/nueva')}>
              <Plus className="w-4 h-4" /> Iniciar campaña
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {campañas.map((c) => (
              <CampañaCard
                key={c.id}
                campaña={c}
                onClick={() => navigate(`/campañas/${c.id}/cronograma`)}
              />
            ))}
          </div>
        )}
      </Container>

      <button
        onClick={() => navigate('/campañas/nueva')}
        className="fixed bottom-24 right-5 md:bottom-8 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-xl hover:bg-primary-600 active:scale-95 transition-all z-20"
        aria-label="Nueva campaña"
      >
        <Plus className="w-7 h-7 text-white" />
      </button>
    </>
  );
}
