import { useState } from 'react';
import { Eye } from 'lucide-react';
import { Badge } from '../../ui/Badge';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { ConfirmDialog } from '../../ui/ConfirmDialog';
import { useUpdateEnquiry, useDeleteEnquiry } from '../../../hooks/mutations';
import { useEnquiries } from '../../../hooks/queries';
import { formatDate, timeAgo } from '../../../utils/format';
import { extractApiError } from '../../../services/api';
import { useToast } from '../../ui/Toast';
import { CardTable, RowActions, LoadingRows, TableEmpty, thClass, tdClass } from './shared';
import type { Enquiry, EnquiryStatus } from '../../../types';

const statusOptions: EnquiryStatus[] = ['Pending', 'Responded', 'Closed'];

const enquiryTone: Record<string, 'neutral' | 'gold' | 'forest'> = {
  Pending: 'gold',
  Responded: 'forest',
  Closed: 'neutral',
};

export function EnquiriesSection({ title }: { title: string }) {
  const enquiriesQuery = useEnquiries();
  const { notify } = useToast();
  const updateEnquiry = useUpdateEnquiry();
  const deleteEnquiry = useDeleteEnquiry();

  const [draftStatus, setDraftStatus] = useState<Record<number, EnquiryStatus>>({});
  const [viewing, setViewing] = useState<Enquiry | null>(null);
  const [deleting, setDeleting] = useState<Enquiry | null>(null);

  const enquiries = enquiriesQuery.data?.items ?? [];

  const saveStatus = async (e: Enquiry) => {
    const status = draftStatus[e.id];
    if (!status || status === e.status) return;
    try {
      await updateEnquiry.mutateAsync({
        id: e.id,
        payload: { fullName: e.fullName, email: e.email, phone: e.phone, message: e.message, status },
      });
      notify({ type: 'success', title: 'Status updated', description: `${e.fullName}'s enquiry is now ${status}.` });
    } catch (err) {
      notify({ type: 'error', title: 'Could not update status', description: extractApiError(err) });
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteEnquiry.mutateAsync(deleting.id);
      notify({ type: 'success', title: 'Enquiry deleted', description: `Enquiry from ${deleting.fullName} was removed.` });
      setDeleting(null);
    } catch (err) {
      notify({ type: 'error', title: 'Could not delete enquiry', description: extractApiError(err) });
    }
  };

  return (
    <>
      <CardTable title={title}>
        {enquiriesQuery.isLoading ? (
          <LoadingRows rows={5} />
        ) : enquiries.length === 0 ? (
          <TableEmpty />
        ) : (
          <table className="w-full min-w-[820px] border-collapse">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50/60">
                <th className={thClass}>Name</th>
                <th className={thClass}>Property</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Date</th>
                <th className={thClass}></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {enquiries.map((e) => {
                const draft = draftStatus[e.id];
                return (
                  <tr key={e.id} className="transition-colors hover:bg-ink-50/60">
                    <td className={tdClass}>
                      <span className="font-medium text-ink-900">{e.fullName}</span>
                      <span className="block text-xs text-ink-400">{e.email}</span>
                    </td>
                    <td className={tdClass}>{e.propertyTitle}</td>
                    <td className={tdClass}>
                      <div className="flex items-center gap-2">
                        <select
                          value={draft ?? e.status}
                          onChange={(ev) => setDraftStatus((prev) => ({ ...prev, [e.id]: ev.target.value as EnquiryStatus }))}
                          className="h-9 rounded-lg border border-ink-200 bg-white px-2 text-sm text-ink-700 focus:border-forest-500 focus:outline-none"
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        {draft && draft !== e.status && (
                          <Button variant="primary" size="sm" loading={updateEnquiry.isPending} onClick={() => saveStatus(e)}>
                            Save
                          </Button>
                        )}
                        {!draft && <Badge tone={enquiryTone[e.status] ?? 'neutral'}>{e.status}</Badge>}
                      </div>
                    </td>
                    <td className={tdClass}>{timeAgo(e.createdAt)}</td>
                    <td className={tdClass}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setViewing(e)}
                          title="View details"
                          className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-ink-100 hover:text-forest-600"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <RowActions onDelete={() => setDeleting(e)} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </CardTable>

      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title="Enquiry details" size="md">
        {viewing && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Name</p>
                <p className="mt-1 text-ink-800">{viewing.fullName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Contact</p>
                <p className="mt-1 text-ink-800">{viewing.email}{viewing.phone ? ` · ${viewing.phone}` : ''}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Property</p>
              <p className="mt-1 text-ink-800">{viewing.propertyTitle}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Message</p>
              <p className="mt-1 whitespace-pre-wrap text-ink-700">{viewing.message}</p>
            </div>
            <div className="flex items-center justify-between border-t border-ink-100 pt-3 text-xs text-ink-400">
              <span>Submitted {formatDate(viewing.createdAt)}</span>
              <Badge tone={enquiryTone[viewing.status] ?? 'neutral'}>{viewing.status}</Badge>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete enquiry"
        description={`Are you sure you want to delete the enquiry from ${deleting?.fullName}? This cannot be undone.`}
        confirmLabel="Delete enquiry"
        loading={deleteEnquiry.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}
