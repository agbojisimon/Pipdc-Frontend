import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const baseField =
  'w-full rounded-xl border bg-white px-4 text-base md:text-sm text-ink-900 placeholder-ink-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-forest-500/40 focus:border-forest-500 disabled:bg-ink-100 disabled:cursor-not-allowed';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink-700">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">{leftIcon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              baseField,
              'h-11',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/30' : 'border-ink-200',
              className,
            )}
            aria-invalid={Boolean(error)}
            {...props}
          />
          {rightIcon && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400">{rightIcon}</span>}
        </div>
        {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-ink-400">{hint}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, label, error, id, children, ...props }, ref) => {
  const selectId = id ?? props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-ink-700">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={cn(
          baseField,
          'h-11 cursor-pointer appearance-none bg-[url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%234B5563" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>\')] bg-[length:16px] bg-[right_0.75rem_center] bg-no-repeat pr-10',
          error ? 'border-red-400' : 'border-ink-200',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
});
Select.displayName = 'Select';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, label, error, hint, id, ...props }, ref) => {
  const areaId = id ?? props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={areaId} className="mb-1.5 block text-sm font-medium text-ink-700">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={areaId}
        className={cn(
          baseField,
          'min-h-[120px] py-2.5 resize-y',
          error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/30' : 'border-ink-200',
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-ink-400">{hint}</p>}
    </div>
  );
});
Textarea.displayName = 'Textarea';
