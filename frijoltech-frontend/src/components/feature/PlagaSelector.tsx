import { useState, useEffect } from 'react';
import { Plaga } from '../../types/incidencia.types';
import { plagaService } from '../../services/plagaService';
import { Select } from '../ui/Select';

interface PlagaSelectorProps {
  value: string;
  onChange: (id: number) => void;
  error?: string;
}

export function PlagaSelector({ value, onChange, error }: PlagaSelectorProps) {
  const [plagas, setPlagas] = useState<Plaga[]>([]);

  useEffect(() => {
    plagaService.listar().then(setPlagas).catch(console.error);
  }, []);

  const options = plagas.map((p) => ({
    value: p.id,
    label: `${p.nombreComun} (${p.nombreCientifico})`,
  }));

  return (
    <Select
      label="Plaga / Enfermedad"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      options={options}
      placeholder="Seleccione una plaga o enfermedad"
      error={error}
    />
  );
}
