import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { ConfirmDialog } from '../../ui/ConfirmDialog';
import { AgentForm } from '../../forms/AgentForm';
import { useDeleteAgent } from '../../../hooks/mutations';
import { useAgents } from '../../../hooks/queries';
import { extractApiError } from '../../../services/api';
import { useToast } from '../../ui/Toast';
import { CardTable, RowActions, LoadingRows, TableEmpty, thClass, tdClass } from './shared';
import type { Agent } from '../../../types';

export function AgentsSection() {
  const agentsQuery = useAgents();
  const { notify } = useToast();
  const deleteAgent = useDeleteAgent();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Agent | null>(null);
  const [deleting, setDeleting] = useState<Agent | null>(null);

  const agents = agentsQuery.data?.items ?? [];

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteAgent.mutateAsync(deleting.id);
      notify({ type: 'success', title: 'Agent removed', description: `${deleting.fullName} was deleted.` });
      setDeleting(null);
    } catch (err) {
      notify({ type: 'error', title: 'Could not delete agent', description: extractApiError(err) });
    }
  };

  return (
    <>
      <CardTable
        title="All Agents"
        actions={
          <Button variant="primary" size="sm" onClick={() => { setEditing(null); setFormOpen(true); }} leftIcon={<Plus className="h-4 w-4" />}>
            Add Agent
          </Button>
        }
      >
        {agentsQuery.isLoading ? (
          <LoadingRows rows={5} />
        ) : agents.length === 0 ? (
          <TableEmpty />
        ) : (
          <table className="w-full min-w-[820px] border-collapse">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50/60">
                <th className={thClass}>Agent</th>
                <th className={thClass}>Agency</th>
                <th className={thClass}>Phone</th>
                <th className={thClass}>License</th>
                <th className={thClass}>Properties</th>
                <th className={thClass}>Status</th>
                <th className={thClass}></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {agents.map((a) => (
                <tr key={a.id} className="transition-colors hover:bg-ink-50/60">
                  <td className={tdClass}>
                    <span className="font-medium text-ink-900">{a.fullName}</span>
                    <span className="block text-xs text-ink-400">{a.email}</span>
                  </td>
                  <td className={tdClass}>{a.agency}</td>
                  <td className={tdClass}>{a.phone || '—'}</td>
                  <td className={tdClass}>{a.licenseNumber || '—'}</td>
                  <td className={tdClass}>
                    <Badge tone={a.propertyCount > 0 ? 'forest' : 'neutral'}>
                      {a.propertyCount} {a.propertyCount === 1 ? 'property' : 'properties'}
                    </Badge>
                  </td>
                  <td className={tdClass}><Badge tone={a.verified ? 'forest' : 'neutral'}>{a.verified ? 'Verified' : 'Unverified'}</Badge></td>
                  <td className={tdClass}>
                    <RowActions
                      viewUrl={`/agents/${a.id}`}
                      onEdit={() => { setEditing(a); setFormOpen(true); }}
                      onDelete={() => setDeleting(a)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardTable>

      <AgentForm open={formOpen} agent={editing} onClose={() => { setFormOpen(false); setEditing(null); }} />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete agent"
        description={`Are you sure you want to delete ${deleting?.fullName}? Agents with active listings cannot be deleted.`}
        confirmLabel="Delete agent"
        loading={deleteAgent.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}
