import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ className, hover, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-2xl border border-ink-100 bg-white shadow-soft',
      hover && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-lift',
      className,
    )}
    {...props}
  />
));
Card.displayName = 'Card';

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6', className)} {...props} />;
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('border-b border-ink-100 px-4 py-3 sm:px-6 sm:py-4', className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('font-display text-lg font-semibold text-ink-900', className)} {...props} />;
}
