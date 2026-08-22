import { Check } from 'lucide-react';
import type { Message } from '../../types';
import { cn } from '../../utils/cn';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showSender: boolean;
}

export function MessageBubble({ message, isOwn, showSender }: MessageBubbleProps) {
  const time = new Date(message.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  return (
    <div className={cn('flex flex-col', isOwn ? 'items-end' : 'items-start')}>
      {showSender && !isOwn && <span className="mb-1 px-1 text-xs font-medium text-ink-500">{message.senderName}</span>}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm',
          isOwn ? 'rounded-br-md bg-forest-500 text-white' : 'rounded-bl-md border border-ink-100 bg-white text-ink-800',
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <p className={cn('mt-1 flex items-center justify-end gap-1 text-[10px]', isOwn ? 'text-forest-100' : 'text-ink-400')}>
          {time}
          {isOwn && message.isRead && (
            <span title="Read" className="inline-flex items-center gap-0.5">
              <Check className="h-3 w-3" />
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
