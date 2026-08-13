import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface LogoProps {
  variant?: 'default' | 'light';
  className?: string;
}

export function Logo({ variant = 'default', className }: LogoProps) {
  const isLight = variant === 'light';
  return (
    <Link to="/" className={cn('inline-flex items-center gap-2.5 group', className)} aria-label="PIPDC home">
      <span className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-forest-gradient shadow-soft">
        <svg viewBox="0 0 64 64" className="h-7 w-7" fill="none" aria-hidden="true">
          <path d="M32 14L50 30V50H38V38H26V50H14V30L32 14Z" fill="#D4AF37" />
          <rect x="14" y="50" width="36" height="4" fill="#FFFFFF" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn('font-display text-lg font-bold tracking-tight', isLight ? 'text-white' : 'text-ink-900')}>
          PIPDC
        </span>
        <span className={cn('text-[10px] font-medium uppercase tracking-[0.18em]', isLight ? 'text-white/70' : 'text-ink-500')}>
          Plateau State
        </span>
      </span>
    </Link>
  );
}
