import { Badge } from '../ui/Badge';
import { timeAgo } from '../../utils/format';
import { cn } from '../../utils/cn';
import type { Conversation } from '../../types';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  currentUserId: string;
  onSelect: (id: number) => void;
}

export function ConversationItem({ conversation, isActive, currentUserId, onSelect }: ConversationItemProps) {
  const isClientViewer = conversation.client.userId === currentUserId;
  const otherName = isClientViewer ? conversation.agent.fullName : conversation.client.fullName;
  const lastActivity = conversation.lastMessageAt ?? conversation.createdAt;

  return (
    <button
      type="button"
      onClick={() => onSelect(conversation.id)}
      className={cn(
        'w-full rounded-xl border p-3 text-left transition-colors',
        isActive ? 'border-forest-300 bg-forest-50/70' : 'border-ink-100 bg-white hover:bg-ink-50/60',
      )}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-gradient text-sm font-semibold text-white">
          {otherName.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold text-ink-900">{otherName}</p>
            <span className="shrink-0 text-xs text-ink-400">{timeAgo(lastActivity)}</span>
          </div>
          <p className="mt-0.5 truncate text-xs text-forest-600">{conversation.property.title}</p>
          {conversation.unreadCount > 0 && (
            <Badge tone="danger" className="mt-1.5">
              {conversation.unreadCount} new
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}
