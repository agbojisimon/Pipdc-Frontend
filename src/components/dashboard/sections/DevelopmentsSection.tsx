import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Plus, Star } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { ConfirmDialog } from '../../ui/ConfirmDialog';
import { DevelopmentProjectForm } from '../../forms/DevelopmentProjectForm';
import { useDeleteDevelopmentProject, useSetDevelopmentFeatured } from '../../../hooks/mutations';
import { useAdminDevelopmentProjects } from '../../../hooks/queries';
import { useToast } from '../../ui/Toast';
import { timeAgo } from '../../../utils/format';
import { extractApiError } from '../../../services/api';
import { cn } from '../../../utils/cn';
import { developmentStatusTone, developmentStatusLabel } from '../../../utils/developmentStatus';
import { CardTable, RowActions, LoadingRows, TableEmpty, thClass, tdClass } from './shared';
import type { DevelopmentProject } from '../../../types/development';

export function DevelopmentsSection() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const shouldCreate = searchParams.get('new') === '1';

  const [formOpen, setFormOpen] = useState(shouldCreate);
  const [editing, setEditing] = useState<DevelopmentProject | null>(null);
  const [deleting, setDeleting] = useState<DevelopmentProject | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const { notify } = useToast();
  const deleteProject = useDeleteDevelopmentProject();
  const setFeatured = useSetDevelopmentFeatured();

  const projectsQuery = useAdminDevelopmentProjects({ pageSize: 100 });

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
      await deleteProject.mutateAsync(deleting.id);
      notify({ type: 'success', title: 'Project deleted', description: `"${deleting.name}" was removed.` });
      setDeleting(null);
    } catch (err) {
      notify({ type: 'error', title: 'Could not delete project', description: extractApiError(err) });
    }
  };

  const toggleFeatured = async (p: DevelopmentProject) => {
    setTogglingId(p.id);
    try {
      await setFeatured.mutateAsync({ id: p.id, featured: !p.featured });
      notify({
        type: 'success',
        title: p.featured ? 'Removed from featured' : 'Featured project',
        description: p.featured
          ? `"${p.name}" no longer appears on the home page.`
          : `"${p.name}" will now appear on the home page.`,
      });
    } catch (err) {
      notify({ type: 'error', title: 'Could not update featured', description: extractApiError(err) });
    } finally {
      setTogglingId(null);
    }
  };

  const projects = projectsQuery.data?.items ?? [];

  return (
    <>
      <CardTable
        title="Development Projects"
        actions={
          <Button variant="primary" size="sm" onClick={openCreate} leftIcon={<Plus className="h-4 w-4" />}>
            Add Project
          </Button>
        }
      >
        {projectsQuery.isLoading ? (
          <LoadingRows rows={5} />
        ) : projects.length === 0 ? (
          <TableEmpty />
        ) : (
          <table className="w-full min-w-[780px] border-collapse">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50/60">
                <th className={thClass}>Project</th>
                <th className={thClass}>Location</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Progress</th>
                <th className={thClass}>Units</th>
                <th className={thClass}>Updates</th>
                <th className={thClass}>Featured</th>
                <th className={thClass}>Created</th>
                <th className={thClass}></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {projects.map((p) => (
                <tr
                  key={p.id}
                  className="cursor-pointer transition-colors hover:bg-ink-50/60"
                  onClick={() => navigate(`/dashboard/developments/${p.id}`)}
                >
                  <td className={tdClass}>
                    <span className="font-medium text-ink-900">{p.name}</span>
                    {p.developer && <span className="block text-xs text-ink-400">{p.developer}</span>}
                  </td>
                  <td className={tdClass}>{p.location}</td>
                  <td className={tdClass}>
                    <Badge tone={developmentStatusTone(p.status)}>{developmentStatusLabel(p.status)}</Badge>
                  </td>
                  <td className={tdClass}>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-ink-100">
                        <div
                          className="h-full rounded-full bg-forest-500 transition-all"
                          style={{ width: `${p.progressPercentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-ink-600">{p.progressPercentage}%</span>
                    </div>
                  </td>
                  <td className={tdClass}>{p.unitCount}</td>
                  <td className={tdClass}>{p.updateCount}</td>
                  <td className={tdClass}>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); toggleFeatured(p); }}
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
                  <td className={tdClass}>{timeAgo(p.createdAt)}</td>
                  <td className={tdClass} onClick={(e) => e.stopPropagation()}>
                    <RowActions
                      viewUrl={`/developments/${p.slug}`}
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

      <DevelopmentProjectForm open={formOpen} project={editing} onClose={closeForm} />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete project"
        description={`Are you sure you want to delete "${deleting?.name}"? This cannot be undone.`}
        confirmLabel="Delete project"
        loading={deleteProject.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}
