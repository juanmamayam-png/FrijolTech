import { NavLink } from 'react-router-dom';
import { Home, MapPin, Sprout, Bug } from 'lucide-react';

const navItems = [
  { to: '/dashboard',  label: 'Inicio',    Icon: Home },
  { to: '/predios',    label: 'Predios',   Icon: MapPin },
  { to: '/campañas',   label: 'Campañas',  Icon: Sprout },
  { to: '/incidencias/nueva', label: 'Plaga', Icon: Bug },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 pb-safe-bottom md:hidden">
      <div className="flex">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-muted hover:text-primary'
              }`
            }
          >
            <Icon className="w-6 h-6" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
