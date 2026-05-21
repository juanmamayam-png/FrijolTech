import { useNavigate } from 'react-router-dom';
import { Home, Sprout, Plus, Bug, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

const cards = [
  {
    title: 'Mis predios',
    description: 'Ver y registrar predios',
    Icon: Home,
    to: '/predios',
    bg: 'bg-primary',
  },
  {
    title: 'Mis campañas',
    description: 'Cronogramas activos',
    Icon: Sprout,
    to: '/campañas',
    bg: 'bg-secondary',
  },
  {
    title: 'Nueva campaña',
    description: 'Iniciar siembra',
    Icon: Plus,
    to: '/campañas/nueva',
    bg: 'bg-dark',
  },
  {
    title: 'Reportar plaga',
    description: 'Registrar incidencia',
    Icon: Bug,
    to: '/incidencias/nueva',
    bg: 'bg-accent',
  },
];

export function DashboardPage() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-light">
      {/* Header */}
      <div className="bg-primary px-5 pt-10 pb-8">
        <div className="max-w-2xl mx-auto flex items-start justify-between">
          <div>
            <p className="text-secondary-200 text-sm font-medium">Buenos días,</p>
            <h1 className="text-2xl font-bold text-white font-serif mt-0.5">
              {usuario?.nombre.split(' ')[0] ?? 'Agricultor'}
            </h1>
            <p className="text-secondary-200 text-sm mt-1">¿Qué deseas hacer hoy?</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors mt-1"
            aria-label="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>

      {/* Grid de acciones */}
      <div className="max-w-2xl mx-auto px-4 mt-6 pb-24">
        <div className="grid grid-cols-2 gap-4">
          {cards.map(({ title, description, Icon, to, bg }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className={`${bg} rounded-2xl p-5 flex flex-col items-start gap-3 text-white shadow-md active:scale-95 transition-transform hover:opacity-90 min-h-[130px]`}
              aria-label={title}
            >
              <div className="bg-white/20 rounded-xl p-2">
                <Icon className="w-7 h-7" />
              </div>
              <div className="text-left">
                <p className="font-bold text-base leading-tight">{title}</p>
                <p className="text-xs opacity-80 mt-0.5">{description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Botón de acción rápida */}
        <div className="mt-8">
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => navigate('/campañas/nueva')}
          >
            <Plus className="w-5 h-5" />
            Iniciar nueva campaña
          </Button>
        </div>
      </div>
    </div>
  );
}
