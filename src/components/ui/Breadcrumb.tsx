import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1 text-sm text-ink-500">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <Fragment key={idx}>
            {item.to && !isLast ? (
              <Link to={item.to} className="transition-colors hover:text-forest-600">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'font-medium text-ink-800' : ''}>{item.label}</span>
            )}
            {!isLast && <ChevronRight className="h-3.5 w-3.5 text-ink-300" />}
          </Fragment>
        );
      })}
    </nav>
  );
}
