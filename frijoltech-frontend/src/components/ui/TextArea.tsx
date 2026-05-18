import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const areaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={areaId} className="block text-sm font-semibold text-dark mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={areaId}
          rows={4}
          className={`
            w-full rounded-xl border-2 bg-white px-4 py-3 text-dark text-base
            placeholder:text-muted/60 transition-colors resize-none
            focus:outline-none focus:border-primary
            ${error ? 'border-accent' : 'border-gray-200'}
            ${className}
          `}
          aria-invalid={!!error}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-accent font-medium" role="alert">{error}</p>}
      </div>
    );
  }
);
TextArea.displayName = 'TextArea';
