import { Eye } from 'lucide-react';
import { Badge } from '../../ui/Badge';
import { Modal } from '../../ui/Modal';
import { useMyEnquiries } from '../../../hooks/queries';
import { formatDate, timeAgo } from '../../../utils/format';
import { CardTable, LoadingRows, TableEmpty, thClass, tdClass } from './shared';
import type { Enquiry } from '../../../types';
import { useState } from 'react';

const enquiryTone: Record<string, 'neutral' | 'gold' | 'forest'> = {
  Pending: 'gold',
  Responded: 'forest',
  Closed: 'neutral',
};

export function MyEnquiriesSection() {
  const enquiriesQuery = useMyEnquiries();
  const [viewing, setViewing] = useState<Enquiry | null>(null);

  const enquiries = enquiriesQuery.data?.items ?? [];

  return (
    <>
      <CardTable title="My Enquiries">
        {enquiriesQuery.isLoading ? (
          <LoadingRows rows={4} />
        ) : enquiries.length === 0 ? (
          <TableEmpty />
        ) : (
          <table className="w-full min-w-[680px] border-collapse">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50/60">
                <th className={thClass}>Property</th>
                <th className={thClass}>Message</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Sent</th>
                <th className={thClass}></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {enquiries.map((e) => (
                <tr key={e.id} className="transition-colors hover:bg-ink-50/60">
                  <td className={tdClass}><span className="font-medium text-ink-900">{e.propertyTitle}</span></td>
                  <td className={tdClass}><span className="line-clamp-1 text-ink-600">{e.message}</span></td>
                  <td className={tdClass}><Badge tone={enquiryTone[e.status] ?? 'neutral'}>{e.status}</Badge></td>
                  <td className={tdClass}>{timeAgo(e.createdAt)}</td>
                  <td className={tdClass}>
                    <button
                      type="button"
                      onClick={() => setViewing(e)}
                      title="View details"
                      className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-ink-100 hover:text-forest-600"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardTable>

      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title="Enquiry details" size="md">
        {viewing && (
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Property</p>
              <p className="mt-1 text-ink-800">{viewing.propertyTitle}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Message</p>
              <p className="mt-1 whitespace-pre-wrap text-ink-700">{viewing.message}</p>
            </div>
            <div className="flex items-center justify-between border-t border-ink-100 pt-3 text-xs text-ink-400">
              <span>Sent {formatDate(viewing.createdAt)}</span>
              <Badge tone={enquiryTone[viewing.status] ?? 'neutral'}>{viewing.status}</Badge>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
