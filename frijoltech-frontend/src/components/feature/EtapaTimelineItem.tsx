import { CheckCircle2, Clock, Circle } from 'lucide-react';
import { EtapaFenologica } from '../../types/etapa.types';
import { Button } from '../ui/Button';
import { formatDateShort } from '../../utils/formatters';

interface EtapaTimelineItemProps {
  etapa: EtapaFenologica;
  isLast: boolean;
  onRegistrarAvance?: (etapa: EtapaFenologica) => void;
}

const estadoConfig = {
  completada: {
    Icon: CheckCircle2,
    iconColor: 'text-green-600',
    lineColor: 'bg-green-400',
    labelColor: 'text-green-700',
    label: 'Completada',
  },
  en_curso: {
    Icon: Clock,
    iconColor: 'text-accent',
    lineColor: 'bg-accent',
    labelColor: 'text-accent',
    label: 'En curso',
  },
  pendiente: {
    Icon: Circle,
    iconColor: 'text-gray-300',
    lineColor: 'bg-gray-200',
    labelColor: 'text-muted',
    label: 'Pendiente',
  },
};

export function EtapaTimelineItem({ etapa, isLast, onRegistrarAvance }: EtapaTimelineItemProps) {
  const config = estadoConfig[etapa.estado];
  const { Icon } = config;

  return (
    <div className="flex gap-4">
      {/* Línea vertical + ícono */}
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white border-2 ${
          etapa.estado === 'completada' ? 'border-green-400' :
          etapa.estado === 'en_curso' ? 'border-accent' : 'border-gray-200'
        }`}>
          <Icon className={`w-4 h-4 ${config.iconColor}`} />
        </div>
        {!isLast && <div className={`w-0.5 flex-1 mt-1 ${config.lineColor} min-h-[2rem]`} />}
      </div>

      {/* Contenido */}
      <div className={`flex-1 pb-6 ${isLast ? '' : ''}`}>
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <h3 className="font-bold text-dark text-base">{etapa.nombre}</h3>
            <p className={`text-xs font-medium mt-0.5 ${config.labelColor}`}>{config.label}</p>
          </div>
          {(etapa.estado === 'en_curso' || etapa.estado === 'pendiente') && onRegistrarAvance && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRegistrarAvance(etapa)}
            >
              Registrar avance
            </Button>
          )}
        </div>
        <div className="mt-2 text-sm text-muted space-y-0.5">
          <p>📅 Fecha estimada: <strong>{formatDateShort(etapa.fechaEstimada)}</strong></p>
          <p>⏱ Duración: <strong>{etapa.duracionDias} días</strong></p>
          <p className="text-xs">🌡 {etapa.umbralTempMin}–{etapa.umbralTempMax}°C · 💧 ≥{etapa.umbralHumedadMin}% humedad</p>
        </div>
      </div>
    </div>
  );
}
