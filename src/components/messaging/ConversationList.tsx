import { AlertTriangle, MessagesSquare, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { ConversationItem } from './ConversationItem';
import type { Conversation } from '../../types';

interface ConversationListProps {
  conversations: Conversation[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  selectedId: number | null;
  currentUserId: string;
  onSelect: (id: number) => void;
}

export function ConversationList({ conversations, isLoading, isError, onRetry, selectedId, currentUserId, onSelect }: ConversationListProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white">
      <div className="border-b border-ink-100 px-4 py-3">
        <h2 className="font-display text-sm font-semibold text-ink-900">Conversations</h2>
      </div>
      {isLoading ? (
        <div className="space-y-2 p-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-ink-100 p-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-ink-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/2 rounded bg-ink-100" />
                  <div className="h-2.5 w-2/3 rounded bg-ink-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 p-8 text-center">
          <AlertTriangle className="h-6 w-6 text-gold-500" />
          <p className="text-sm text-ink-500">Could not load conversations.</p>
          <Button variant="outline" size="sm" leftIcon={<RefreshCw className="h-4 w-4" />} onClick={onRetry}>
            Try again
          </Button>
        </div>
      ) : conversations.length === 0 ? (
        <EmptyState
          icon={<MessagesSquare className="h-6 w-6" />}
          title="No conversations yet"
          description="Conversations begin when the first message is sent by you or the property agent."
        />
      ) : (
        <div className="space-y-2 p-3">
          {conversations.map((c) => (
            <ConversationItem
              key={c.id}
              conversation={c}
              isActive={c.id === selectedId}
              currentUserId={currentUserId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
