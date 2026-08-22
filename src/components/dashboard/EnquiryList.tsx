import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { timeAgo } from '../../utils/format';
import { enquiryStatusLabel, enquiryStatusTone } from '../../utils/enquiryStatus';
import { cn } from '../../utils/cn';
import type { Enquiry } from '../../types';

interface EnquiryListProps {
  title: string;
  items: Enquiry[];
  emptyMessage?: string;
  viewAll?: { to: string; label: string };
  showUnread?: boolean;
}

export function EnquiryList({ title, items, emptyMessage = 'No enquiries yet.', viewAll, showUnread = false }: EnquiryListProps) {
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
            {items.map((e) => (
              <div key={e.id} className={cn('rounded-xl border border-ink-100 p-3', showUnread && !e.isRead && 'border-gold-200 bg-gold-50/40')}>
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-semibold text-ink-800">{e.fullName}</p>
                  <div className="flex shrink-0 items-center gap-2">
                    {showUnread && !e.isRead && <Badge tone="danger">New</Badge>}
                    <Badge tone={enquiryStatusTone(e.status)}>{enquiryStatusLabel(e.status)}</Badge>
                  </div>
                </div>
                <p className="mt-1 line-clamp-1 text-xs text-ink-500">
                  <MessageSquare className="mr-0.5 inline h-3 w-3" />
                  {e.message}
                </p>
                <p className="mt-1 text-xs text-ink-400">{e.propertyTitle} · {timeAgo(e.createdAt)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
