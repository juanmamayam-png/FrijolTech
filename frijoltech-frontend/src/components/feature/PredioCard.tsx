import { MapPin, Maximize2, ChevronRight } from 'lucide-react';
import { Predio } from '../../types/predio.types';
import { Card } from '../ui/Card';
import { formatArea } from '../../utils/formatters';

interface PredioCardProps {
  predio: Predio;
  onClick?: () => void;
}

export function PredioCard({ predio, onClick }: PredioCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md hover:border-primary/20 transition-all active:scale-[0.98]"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      aria-label={`Ver detalles de ${predio.nombre}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-dark text-lg truncate font-serif">{predio.nombre}</h3>
          <div className="flex items-center gap-1 mt-1 text-muted text-sm">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{predio.ubicacion}</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-muted text-sm">
            <Maximize2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{formatArea(predio.areaTotal)}</span>
            {predio.altitud > 0 && <span className="ml-2 text-xs">· {predio.altitud} msnm</span>}
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted flex-shrink-0 ml-2" />
      </div>
    </Card>
  );
}
