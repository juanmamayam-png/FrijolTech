import { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: 'sm' | 'md' | 'lg';
}

const paddingClasses = { sm: 'p-3', md: 'p-5', lg: 'p-6' };

export function Card({ children, padding = 'md', className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-surface rounded-2xl shadow-sm border border-line ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
