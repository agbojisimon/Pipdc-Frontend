import { useState } from 'react';
import { UserPlus, UserMinus } from 'lucide-react';
import { Badge } from '../../ui/Badge';
import { ConfirmDialog } from '../../ui/ConfirmDialog';
import { useAddRole, useRemoveRole } from '../../../hooks/mutations';
import { useUsers, useAgentProperties } from '../../../hooks/queries';
import { useAuth } from '../../../contexts/AuthContext';
import { formatDate } from '../../../utils/format';
import { extractApiError } from '../../../services/api';
import { useToast } from '../../ui/Toast';
import { CardTable, LoadingRows, TableEmpty, thClass, tdClass } from './shared';
import type { User } from '../../../types';

export function UsersSection() {
  const usersQuery = useUsers();
  const { user: currentUser } = useAuth();
  const { notify } = useToast();
  const addRole = useAddRole();
  const removeRole = useRemoveRole();

  const [promoting, setPromoting] = useState<User | null>(null);
  const [demoting, setDemoting] = useState<User | null>(null);

  const propertyQuery = useAgentProperties(demoting?.agentId ?? undefined);
  const affectedCount = propertyQuery.data?.totalCount ?? 0;

  const users = usersQuery.data?.items ?? [];

  const confirmPromote = async () => {
    if (!promoting) return;
    try {
      await addRole.mutateAsync({ email: promoting.email, role: 'Agent' });
      notify({ type: 'success', title: 'Promoted to Agent', description: `${promoting.fullName} now has the Agent role.` });
      setPromoting(null);
    } catch (err) {
      notify({ type: 'error', title: 'Could not promote user', description: extractApiError(err) });
    }
  };

  const confirmDemote = async () => {
    if (!demoting) return;
    try {
      await removeRole.mutateAsync({ email: demoting.email, role: 'Agent' });
      notify({ type: 'success', title: 'Agent role removed', description: `${demoting.fullName} is no longer an agent.` });
      setDemoting(null);
    } catch (err) {
      notify({ type: 'error', title: 'Could not remove Agent role', description: extractApiError(err) });
    }
  };

  const isSelf = (u: User) => currentUser?.id === u.id;

  return (
    <>
      <CardTable title="Registered Users">
        {usersQuery.isLoading ? (
          <LoadingRows rows={5} />
        ) : users.length === 0 ? (
          <TableEmpty />
        ) : (
          <table className="w-full min-w-[820px] border-collapse">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50/60">
                <th className={thClass}>User</th>
                <th className={thClass}>Roles</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Joined</th>
                <th className={thClass}></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {users.map((u) => {
                const isAgent = u.roles.includes('Agent');
                const isAdmin = u.roles.includes('Admin');
                return (
                  <tr key={u.id} className="transition-colors hover:bg-ink-50/60">
                    <td className={tdClass}>
                      <span className="font-medium text-ink-900">{u.fullName}{isSelf(u) && <span className="ml-1.5 text-xs text-ink-400">(you)</span>}</span>
                      <span className="block text-xs text-ink-400">{u.email}</span>
                    </td>
                    <td className={tdClass}>
                      <div className="flex flex-wrap gap-1.5">
                        {u.roles.map((r) => (
                          <Badge key={r} tone={r === 'Admin' ? 'forest' : r === 'Agent' ? 'gold' : 'neutral'}>{r}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className={tdClass}><Badge tone={u.status === 'Active' ? 'forest' : 'neutral'}>{u.status}</Badge></td>
                    <td className={tdClass}>{formatDate(u.createdAt)}</td>
                    <td className={tdClass}>
                      <div className="flex items-center justify-end gap-1">
                        {!isAdmin && !isAgent && (
                          <button
                            type="button"
                            title="Promote to Agent"
                            onClick={() => setPromoting(u)}
                            className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-forest-50 hover:text-forest-600"
                          >
                            <UserPlus className="h-4 w-4" />
                          </button>
                        )}
                        {isAgent && !isAdmin && (
                          <button
                            type="button"
                            title="Remove Agent role"
                            onClick={() => setDemoting(u)}
                            className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          >
                            <UserMinus className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </CardTable>

      <ConfirmDialog
        open={Boolean(promoting)}
        title="Promote user to Agent"
        description={`${promoting?.fullName} will receive the Agent role and a PIPDC Agency profile they can use to list properties.`}
        confirmLabel="Promote to Agent"
        tone="primary"
        loading={addRole.isPending}
        onConfirm={confirmPromote}
        onCancel={() => setPromoting(null)}
      />

      <ConfirmDialog
        open={Boolean(demoting)}
        title="Remove Agent role"
        description={
          demoting ? (
            <span>
              {demoting.fullName} currently owns{' '}
              <span className="font-semibold text-ink-900">{affectedCount}</span> property listing{affectedCount === 1 ? '' : 's'}.
              These will be transferred to the administrator agent account before the role is removed.
            </span>
          ) : undefined
        }
        confirmLabel="Remove Agent role"
        loading={removeRole.isPending}
        onConfirm={confirmDemote}
        onCancel={() => setDemoting(null)}
      />
    </>
  );
}
