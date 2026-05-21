import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightElement, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-semibold text-dark mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">{leftIcon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full rounded-xl border-2 bg-surface px-4 py-3 text-dark text-base
              placeholder:text-faint/70 transition-colors
              focus:outline-none focus:border-primary
              disabled:bg-light disabled:cursor-not-allowed
              ${error ? 'border-accent' : 'border-line'}
              ${leftIcon ? 'pl-10' : ''}
              ${rightElement ? 'pr-12' : ''}
              ${className}
            `}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          {rightElement && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</span>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-accent font-medium" role="alert">
            {error}
          </p>
        )}
        {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
