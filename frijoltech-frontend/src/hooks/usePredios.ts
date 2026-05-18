import { useState, useEffect, useCallback } from 'react';
import { Predio } from '../types/predio.types';
import { predioService } from '../services/predioService';

export function usePredios() {
  const [predios, setPredios] = useState<Predio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await predioService.listar();
      setPredios(data);
    } catch {
      setError('No se pudieron cargar los predios');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void cargar(); }, [cargar]);

  return { predios, loading, error, recargar: cargar };
}
