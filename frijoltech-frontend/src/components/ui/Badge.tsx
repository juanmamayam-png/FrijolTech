import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'green' | 'yellow' | 'red' | 'gray' | 'primary';
}

const variantClasses = {
  green:   'bg-green-100 text-green-800',
  yellow:  'bg-yellow-100 text-yellow-800',
  red:     'bg-accent-50 text-accent',
  gray:    'bg-gray-100 text-gray-600',
  primary: 'bg-primary-100 text-primary',
};

export function Badge({ children, variant = 'gray' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}
