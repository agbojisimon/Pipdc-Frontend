import { Link } from 'react-router-dom';
import { ArrowRight, Building2 } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatPrice, timeAgo } from '../../utils/format';
import { propertyStatusLabel } from '../../utils/propertyStatus';
import type { Property } from '../../types';

const statusTone: Record<string, 'forest' | 'gold' | 'neutral' | 'info'> = {
  'For Sale': 'forest',
  'For Lease': 'gold',
  Sold: 'neutral',
  'Off Market': 'info',
};

interface PropertyListProps {
  title: string;
  items: Property[];
  emptyMessage?: string;
  showAgent?: boolean;
  viewAll?: { to: string; label: string };
}

export function PropertyList({ title, items, emptyMessage = 'No properties yet.', showAgent = true, viewAll }: PropertyListProps) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {viewAll && (
          <Link to={viewAll.to} className="inline-flex items-center gap-1 text-sm font-medium text-forest-600 hover:text-forest-700">
            {viewAll.label} <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </CardHeader>
      <div className="p-5">
        {items.length === 0 ? (
          <p className="text-sm text-ink-400">{emptyMessage}</p>
        ) : (
          <div className="space-y-3">
            {items.map((p) => (
              <Link
                key={p.id}
                to={`/properties/${p.slug}`}
                className="group flex items-center justify-between gap-3 rounded-xl border border-ink-100 p-3 transition-colors hover:border-forest-200 hover:bg-forest-50/40"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-800 group-hover:text-forest-700">{p.title}</p>
                  <p className="text-xs text-ink-400">
                    {showAgent && p.agentName ? `${p.agentName} · ` : ''}
                    <Building2 className="mr-0.5 inline h-3 w-3" />
                    {timeAgo(p.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-sm font-bold text-ink-900">{formatPrice(p.price, p.currency)}</span>
                  <Badge tone={statusTone[p.status] ?? 'neutral'}>{propertyStatusLabel(p.status)}</Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
