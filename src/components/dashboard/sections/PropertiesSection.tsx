import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Star, MessageSquare } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { ConfirmDialog } from '../../ui/ConfirmDialog';
import { PropertyForm } from '../../forms/PropertyForm';
import { useDeleteProperty, useSetFeatured } from '../../../hooks/mutations';
import { useProperties, useAgents, useMyAgent } from '../../../hooks/queries';
import { useAuth } from '../../../contexts/AuthContext';
import { formatPrice, timeAgo } from '../../../utils/format';
import { extractApiError } from '../../../services/api';
import { useToast } from '../../ui/Toast';
import { primaryRole } from '../../../utils/roles';
import { cn } from '../../../utils/cn';
import { propertyStatusLabel } from '../../../utils/propertyStatus';
import { CardTable, RowActions, LoadingRows, TableEmpty, thClass, tdClass } from './shared';
import type { Property } from '../../../types';

const statusTone: Record<string, 'forest' | 'gold' | 'neutral' | 'info'> = {
  'For Sale': 'forest',
  'For Lease': 'gold',
  Sold: 'neutral',
  'Off Market': 'info',
};

export function PropertiesSection() {
  const { user } = useAuth();
  const isAdmin = user?.roles.includes('Admin') ?? false;
  const [searchParams, setSearchParams] = useSearchParams();
  const shouldCreate = searchParams.get('new') === '1';

  const [formOpen, setFormOpen] = useState(shouldCreate);
  const [editing, setEditing] = useState<Property | null>(null);
  const [deleting, setDeleting] = useState<Property | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const { notify } = useToast();
  const deleteProperty = useDeleteProperty();
  const setFeatured = useSetFeatured();

  const role = primaryRole(user?.roles);
  const myAgentQuery = useMyAgent(role === 'Agent');
  const agentId = role === 'Agent' ? myAgentQuery.data?.id : undefined;

  const propertiesQuery = useProperties(role === 'Agent' && agentId ? { agentId, pageSize: 100 } : { pageSize: 100 });
  const agentsQuery = useAgents();

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    if (searchParams.get('new') === '1') {
      const next = new URLSearchParams(searchParams);
      next.delete('new');
      setSearchParams(next, { replace: true });
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteProperty.mutateAsync(deleting.id);
      notify({ type: 'success', title: 'Property deleted', description: `"${deleting.title}" was removed.` });
      setDeleting(null);
    } catch (err) {
      notify({ type: 'error', title: 'Could not delete property', description: extractApiError(err) });
    }
  };

  const toggleFeatured = async (p: Property) => {
    setTogglingId(p.id);
    try {
      await setFeatured.mutateAsync({ id: p.id, featured: !p.featured });
      notify({
        type: 'success',
        title: p.featured ? 'Removed from featured' : 'Featured property',
        description: p.featured
          ? `"${p.title}" no longer appears on the home page.`
          : `"${p.title}" will now appear on the home page.`,
      });
    } catch (err) {
      notify({ type: 'error', title: 'Could not update featured', description: extractApiError(err) });
    } finally {
      setTogglingId(null);
    }
  };

  const agents = agentsQuery.data?.items ?? [];
  const properties = propertiesQuery.data?.items ?? [];

  return (
    <>
      <CardTable
        title={isAdmin ? 'All Properties' : 'My Properties'}
        actions={
          <Button variant="primary" size="sm" onClick={openCreate} leftIcon={<Plus className="h-4 w-4" />}>
            Add Property
          </Button>
        }
      >
        {propertiesQuery.isLoading ? (
          <LoadingRows rows={5} />
        ) : properties.length === 0 ? (
          <TableEmpty />
        ) : (
          <table className="w-full min-w-[780px] border-collapse">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50/60">
                <th className={thClass}>Title</th>
                <th className={thClass}>Agent</th>
                <th className={thClass}>Price</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Enquiries</th>
                {isAdmin && <th className={thClass}>Featured</th>}
                <th className={thClass}>Listed</th>
                <th className={thClass}></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {properties.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-ink-50/60">
                  <td className={tdClass}>
                    <span className="font-medium text-ink-900">{p.title}</span>
                    <span className="block text-xs text-ink-400">{p.address}, {p.city}</span>
                  </td>
                  <td className={tdClass}>{p.agentName}</td>
                  <td className={tdClass}>{formatPrice(p.price, p.currency)}</td>
                  <td className={tdClass}>
                    <Badge tone={statusTone[p.status] ?? 'neutral'}>{propertyStatusLabel(p.status)}</Badge>
                  </td>
                  <td className={tdClass}>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-100 px-2.5 py-1 text-xs font-semibold text-ink-700">
                      <MessageSquare className="h-3 w-3 text-forest-500" />
                      {p.enquiryCount}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className={tdClass}>
                      <button
                        type="button"
                        onClick={() => toggleFeatured(p)}
                        disabled={togglingId === p.id}
                        title={p.featured ? 'Remove from home page' : 'Feature on home page'}
                        className={cn(
                          'rounded-lg p-1.5 transition-colors',
                          p.featured ? 'text-gold-500 hover:text-gold-600' : 'text-ink-300 hover:text-gold-500',
                          togglingId === p.id && 'animate-pulse',
                        )}
                      >
                        <Star className={cn('h-5 w-5', p.featured && 'fill-gold-500')} />
                      </button>
                    </td>
                  )}
                  <td className={tdClass}>{timeAgo(p.createdAt)}</td>
                  <td className={tdClass}>
                    <RowActions
                      viewUrl={`/properties/${p.slug}`}
                      onEdit={() => { setEditing(p); setFormOpen(true); }}
                      onDelete={() => setDeleting(p)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardTable>

      <PropertyForm open={formOpen} property={editing} agents={agents} onClose={closeForm} />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete property"
        description={`Are you sure you want to delete "${deleting?.title}"? This cannot be undone.`}
        confirmLabel="Delete property"
        loading={deleteProperty.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}
