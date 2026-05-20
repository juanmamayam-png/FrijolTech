import { Sprout, Calendar, ChevronRight } from 'lucide-react';
import { Campaña } from '../../types/campana.types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatDateShort } from '../../utils/formatters';

interface CampañaCardProps {
  campaña: Campaña;
  onClick?: () => void;
}

const estadoBadge: Record<Campaña['estado'], { label: string; variant: 'green' | 'yellow' | 'gray' }> = {
  activa:     { label: 'Activa',     variant: 'green' },
  finalizada: { label: 'Finalizada', variant: 'gray' },
  cancelada:  { label: 'Cancelada',  variant: 'yellow' },
};

export function CampañaCard({ campaña, onClick }: CampañaCardProps) {
  const badge = estadoBadge[campaña.estado];
  return (
    <Card
      className="cursor-pointer hover:shadow-md hover:border-primary/20 transition-all active:scale-[0.98]"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Sprout className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="font-bold text-dark font-serif truncate">Lote #{campaña.loteId}</span>
            <Badge variant={badge.variant}>{badge.label}</Badge>
          </div>
          <div className="flex items-center gap-1 text-muted text-sm">
            <Calendar className="w-3.5 h-3.5" />
            <span>Siembra: {formatDateShort(campaña.fechaSiembra)}</span>
          </div>
          <p className="text-sm text-muted mt-1">{campaña.areaSembrada} ha sembradas</p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted flex-shrink-0 ml-2" />
      </div>
    </Card>
  );
}
