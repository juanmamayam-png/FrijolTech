import { ReactNode } from 'react';

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`max-w-2xl mx-auto px-4 py-5 ${className}`}>
      {children}
    </div>
  );
}
