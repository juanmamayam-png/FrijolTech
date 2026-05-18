import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <Loader2
      className={`animate-spin text-primary ${sizeClasses[size]} ${className}`}
      aria-label="Cargando..."
    />
  );
}

export function FullPageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-light">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-3 text-muted text-sm">Cargando...</p>
      </div>
    </div>
  );
}
