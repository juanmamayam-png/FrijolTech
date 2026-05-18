import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightElement?: ReactNode;
}

export function Header({ title, subtitle, showBack = false, rightElement }: HeaderProps) {
  const navigate = useNavigate();
  return (
    <header className="bg-primary text-white px-4 pt-safe-top pb-4 sticky top-0 z-30 shadow-md">
      <div className="max-w-2xl mx-auto flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold font-serif truncate">{title}</h1>
          {subtitle && <p className="text-sm text-secondary-200 truncate">{subtitle}</p>}
        </div>
        {rightElement}
      </div>
    </header>
  );
}
