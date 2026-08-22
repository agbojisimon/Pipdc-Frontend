import { Heart } from 'lucide-react';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { useSavedProperties } from '../../../hooks/queries';
import { useAuth } from '../../../contexts/AuthContext';
import { useFavourites } from '../../../hooks/useFavourites';
import { formatPrice, timeAgo } from '../../../utils/format';
import { propertyStatusLabel } from '../../../utils/propertyStatus';
import { CardTable, RowActions, LoadingRows, TableEmpty, thClass, tdClass } from './shared';
const statusTone: Record<string, 'forest' | 'gold' | 'neutral' | 'info'> = {
  'For Sale': 'forest',
  'For Lease': 'gold',
  Sold: 'neutral',
  'Off Market': 'info',
};

export function SavedSection() {
  const savedQuery = useSavedProperties();
  const { isAuthenticated } = useAuth();
  const { toggle } = useFavourites();

  const items = savedQuery.data?.items ?? [];

  return (
    <CardTable title="Saved Properties">
      {!isAuthenticated ? (
        <TableEmpty />
      ) : savedQuery.isLoading ? (
        <LoadingRows rows={4} />
      ) : items.length === 0 ? (
        <TableEmpty />
      ) : (
        <table className="w-full min-w-[680px] border-collapse">
          <thead>
            <tr className="border-b border-ink-100 bg-ink-50/60">
              <th className={thClass}>Property</th>
              <th className={thClass}>Price</th>
              <th className={thClass}>Status</th>
              <th className={thClass}>Saved</th>
              <th className={thClass}></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50">
            {items.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-ink-50/60">
                <td className={tdClass}>
                  <span className="font-medium text-ink-900">{p.title}</span>
                  <span className="block text-xs text-ink-400">{p.address}, {p.city}</span>
                </td>
                <td className={tdClass}>{formatPrice(p.price, p.currency)}</td>
                <td className={tdClass}><Badge tone={statusTone[p.status] ?? 'neutral'}>{propertyStatusLabel(p.status)}</Badge></td>
                <td className={tdClass}>{timeAgo(p.createdAt)}</td>
                <td className={tdClass}>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-end sm:gap-1.5">
                    <RowActions viewUrl={`/properties/${p.slug}`} />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggle(p.id)}
                      leftIcon={<Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />}
                      className="text-red-600"
                    >
                      Unsave
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </CardTable>
  );
}
