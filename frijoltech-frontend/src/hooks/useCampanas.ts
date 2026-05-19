import { useState, useEffect, useCallback } from 'react';
import { CampanaConEtapas } from '../types/campana.types';
import { campanaService } from '../services/campanaService';

export function useCampana(id: number | null) {
  const [campana, setCampana] = useState<CampanaConEtapas | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await campanaService.consultar(id);
      setCampana(data);
    } catch {
      setError('No se pudo cargar la campaña');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { void cargar(); }, [cargar]);

  return { campana, loading, error, recargar: cargar };
}
