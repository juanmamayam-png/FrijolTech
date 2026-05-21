import { useState, useEffect, useCallback } from 'react';
import { CampañaConEtapas } from '../types/campana.types';
import { campañaService } from '../services/campanaService';

export function useCampaña(id: number | null) {
  const [campaña, setCampaña] = useState<CampañaConEtapas | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await campañaService.consultar(id);
      setCampaña(data);
    } catch {
      setError('No se pudo cargar la campaña');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { void cargar(); }, [cargar]);

  return { campaña, loading, error, recargar: cargar };
}
