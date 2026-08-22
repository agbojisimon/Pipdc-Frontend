import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Bell, ChevronDown, Eye, ExternalLink, MessagesSquare } from 'lucide-react';
import { Badge } from '../../ui/Badge';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { useNotifyAgent } from '../../../hooks/mutations';
import { useAgentEnquirySummaries, useAgentEnquiries } from '../../../hooks/queries';
import { formatDate, timeAgo } from '../../../utils/format';
import { extractApiError } from '../../../services/api';
import { useToast } from '../../ui/Toast';
import { cn } from '../../../utils/cn';
import { enquiryStatusLabel, enquiryStatusTone } from '../../../utils/enquiryStatus';
import { CardTable, LoadingRows, TableEmpty, thClass, tdClass } from './shared';
import type { AgentEnquirySummary, Enquiry } from '../../../types';

interface AdminAgentEnquiriesProps {
  agentId: number;
  notifyingId: number | null;
  onView: (e: Enquiry) => void;
  onNotify: (e: Enquiry) => void;
}

function AdminAgentEnquiries({ agentId, notifyingId, onView, onNotify }: AdminAgentEnquiriesProps) {
  const enquiriesQuery = useAgentEnquiries(agentId);
  const navigate = useNavigate();
  const enquiries = enquiriesQuery.data?.items ?? [];

  if (enquiriesQuery.isLoading) return <LoadingRows rows={3} />;

  if (enquiries.length === 0) {
    return <p className="px-4 py-6 text-center text-sm text-ink-400">No enquiries for this agent.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] border-collapse">
        <thead>
          <tr className="border-b border-ink-100 bg-white/60">
            <th className={thClass}>Client</th>
            <th className={thClass}>Message</th>
            <th className={thClass}>Property</th>
            <th className={thClass}>Status</th>
            <th className={thClass}>Date</th>
            <th className={thClass}></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-50 bg-white">
          {enquiries.map((e) => (
            <tr key={e.id} className={cn('transition-colors hover:bg-ink-50/60', !e.isRead && 'bg-gold-50/40')}>
              <td className={tdClass}>
                <span className="flex items-center gap-2 font-medium text-ink-900">
                  {e.fullName}
                  {!e.isRead && <Badge tone="danger">New</Badge>}
                </span>
                <span className="block text-xs text-ink-400">{e.email}</span>
              </td>
              <td className={tdClass}>
                <span className="line-clamp-1 max-w-[220px] text-ink-600">{e.message}</span>
              </td>
              <td className={tdClass}>
                <Link to={`/properties/${e.propertySlug}`} className="font-medium text-forest-600 hover:text-forest-700">
                  {e.propertyTitle}
                </Link>
              </td>
              <td className={tdClass}>
                <Badge tone={enquiryStatusTone(e.status)}>{enquiryStatusLabel(e.status)}</Badge>
              </td>
              <td className={tdClass}>{timeAgo(e.createdAt)}</td>
              <td className={tdClass}>
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onView(e)}
                    title="View details"
                    className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-ink-100 hover:text-forest-600"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNotify(e)}
                    disabled={notifyingId !== null}
                    title="Notify agent"
                    className={cn(
                      'rounded-lg p-2 transition-colors hover:bg-ink-100 hover:text-forest-600 disabled:cursor-not-allowed disabled:opacity-50',
                      notifyingId === e.id ? 'animate-pulse text-forest-600' : 'text-ink-400',
                    )}
                  >
                    <Bell className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/dashboard/messages?enquiry=${e.id}`)}
                    title="View conversation"
                    className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-ink-100 hover:text-forest-600"
                  >
                    <MessagesSquare className="h-4 w-4" />
                  </button>
                  <Link
                    to={`/properties/${e.propertySlug}`}
                    title="View property"
                    className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-ink-100 hover:text-forest-600"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AgentSummaryCard({
  summary,
  expanded,
  notifyingId,
  onToggle,
  onView,
  onNotify,
}: {
  summary: AgentEnquirySummary;
  expanded: boolean;
  notifyingId: number | null;
  onToggle: () => void;
  onView: (e: Enquiry) => void;
  onNotify: (e: Enquiry) => void;
}) {
  return (
    <article className="overflow-hidden rounded-xl border border-ink-100 bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-ink-50/50"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-gradient text-sm font-semibold text-white">
            {summary.agentName.charAt(0)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink-900">{summary.agentName}</p>
            <p className="mt-0.5 text-xs text-ink-500">
              Total enquiries: {summary.totalEnquiries} · Unread: {summary.unreadEnquiries} · Latest:{' '}
              {summary.latestEnquiryAt ? timeAgo(summary.latestEnquiryAt) : '—'}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {summary.unreadEnquiries > 0 && <Badge tone="danger">{summary.unreadEnquiries} unread</Badge>}
          <ChevronDown className={cn('h-4 w-4 text-ink-400 transition-transform', expanded && 'rotate-180')} />
        </div>
      </button>
      {expanded && (
        <div className="border-t border-ink-100 bg-ink-50/40">
          <AdminAgentEnquiries agentId={summary.agentId} notifyingId={notifyingId} onView={onView} onNotify={onNotify} />
        </div>
      )}
    </article>
  );
}

export function AdminEnquiriesSection({ title }: { title: string }) {
  const summariesQuery = useAgentEnquirySummaries();
  const { notify } = useToast();
  const navigate = useNavigate();
  const notifyAgent = useNotifyAgent();

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [viewing, setViewing] = useState<Enquiry | null>(null);
  const [notifyingId, setNotifyingId] = useState<number | null>(null);

  const summaries = summariesQuery.data?.items ?? [];

  const handleNotify = async (e: Enquiry) => {
    setNotifyingId(e.id);
    try {
      const result = await notifyAgent.mutateAsync(e.id);
      notify({
        type: 'success',
        title: 'Agent notification prepared',
        description: `Notification payload ready for ${result.agentName}. Email delivery is not enabled yet.`,
      });
    } catch (err) {
      notify({ type: 'error', title: 'Could not notify agent', description: extractApiError(err) });
    } finally {
      setNotifyingId(null);
    }
  };

  return (
    <>
      <CardTable title={title}>
        {summariesQuery.isLoading ? (
          <LoadingRows rows={5} />
        ) : summariesQuery.isError ? (
          <div className="flex flex-col items-center gap-3 p-12 text-center">
            <AlertTriangle className="h-6 w-6 text-gold-500" />
            <p className="text-sm text-ink-500">Could not load agent enquiry summaries.</p>
            <Button variant="outline" size="sm" onClick={() => summariesQuery.refetch()}>
              Try again
            </Button>
          </div>
        ) : summaries.length === 0 ? (
          <TableEmpty />
        ) : (
          <div className="space-y-3 p-5">
            {summaries.map((s) => (
              <AgentSummaryCard
                key={s.agentId}
                summary={s}
                expanded={expandedId === s.agentId}
                notifyingId={notifyingId}
                onToggle={() => setExpandedId(expandedId === s.agentId ? null : s.agentId)}
                onView={setViewing}
                onNotify={handleNotify}
              />
            ))}
          </div>
        )}
      </CardTable>

      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title="Enquiry details" size="md">
        {viewing && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Client</p>
                <p className="mt-1 font-medium text-ink-900">{viewing.fullName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Contact</p>
                <p className="mt-1 text-ink-800">{viewing.email}</p>
                <p className="text-ink-500">{viewing.phone || 'No phone provided'}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Property</p>
              <p className="mt-1 text-ink-800">{viewing.propertyTitle}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Agent</p>
              <p className="mt-1 text-ink-800">{viewing.agentName}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Message</p>
              <p className="mt-1 whitespace-pre-wrap text-ink-700">{viewing.message}</p>
            </div>
            <div className="flex items-center justify-between border-t border-ink-100 pt-3 text-xs text-ink-400">
              <span>Submitted {formatDate(viewing.createdAt)}</span>
              <span className="flex items-center gap-2">
                {viewing.isRead ? (
                  <span>Read {viewing.agentReadAt ? `· ${formatDate(viewing.agentReadAt)}` : ''}</span>
                ) : (
                  <Badge tone="danger">Unread</Badge>
                )}
                <Badge tone={enquiryStatusTone(viewing.status)}>{enquiryStatusLabel(viewing.status)}</Badge>
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to={`/properties/${viewing.propertySlug}`} className="inline-flex">
                <Button variant="outline" size="sm" leftIcon={<ExternalLink className="h-4 w-4" />}>
                  View Property
                </Button>
              </Link>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Bell className="h-4 w-4" />}
                loading={notifyingId === viewing.id}
                disabled={notifyingId !== null && notifyingId !== viewing.id}
                onClick={() => handleNotify(viewing)}
              >
                Notify Agent
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<MessagesSquare className="h-4 w-4" />}
                onClick={() => navigate(`/dashboard/messages?enquiry=${viewing.id}`)}
              >
                View Conversation
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
