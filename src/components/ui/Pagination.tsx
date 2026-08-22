import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1);

  return (
    <nav aria-label="Pagination" className={cn('flex flex-wrap items-center justify-center gap-1.5', className)}>
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="inline-flex h-11 min-w-11 items-center justify-center rounded-lg border border-ink-200 bg-white text-ink-700 transition-colors hover:border-forest-500 hover:text-forest-600 disabled:opacity-40 disabled:hover:border-ink-200 disabled:hover:text-ink-700"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {visible.map((p, idx) => {
        const prev = visible[idx - 1];
        const showEllipsis = prev && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-1.5">
            {showEllipsis && <span className="px-1 text-ink-400">…</span>}
            <button
              onClick={() => onPageChange(p)}
              className={cn(
                'inline-flex h-11 min-w-11 items-center justify-center rounded-lg border px-2 text-sm font-medium transition-colors',
                p === page
                  ? 'border-forest-500 bg-forest-500 text-white'
                  : 'border-ink-200 bg-white text-ink-700 hover:border-forest-500 hover:text-forest-600',
              )}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          </span>
        );
      })}
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="inline-flex h-11 min-w-11 items-center justify-center rounded-lg border border-ink-200 bg-white text-ink-700 transition-colors hover:border-forest-500 hover:text-forest-600 disabled:opacity-40 disabled:hover:border-ink-200 disabled:hover:text-ink-700"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
