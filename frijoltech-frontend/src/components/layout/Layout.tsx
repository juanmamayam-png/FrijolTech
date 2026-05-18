import { ReactNode, useEffect, useState } from 'react';
import { BottomNav } from './BottomNav';
import { WifiOff } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline  = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online',  handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online',  handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-light flex flex-col">
      {!isOnline && (
        <div className="bg-accent text-white text-sm py-2 px-4 flex items-center gap-2 justify-center">
          <WifiOff className="w-4 h-4" />
          <span>Sin conexión — algunos datos pueden no actualizarse</span>
        </div>
      )}
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
