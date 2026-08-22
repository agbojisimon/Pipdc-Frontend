import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRealtime } from '../contexts/RealtimeContext';
import { queryKeys } from './queries';
import type { Message } from '../types';

const NEW_MESSAGE_EVENT = 'NewMessage';

/**
 * Registers exactly one NewMessage listener on the shared SignalR connection
 * and folds newly persisted messages into the existing React Query messages
 * cache for the message's own conversation.
 *
 * SignalR is delivery-only: the backend has already committed the message, so
 * nothing is written back to the server. Cache updates are idempotent by
 * Message.Id and appended to preserve the REST ordering (oldest → newest).
 */
export function useNewMessageListener() {
  const { connection } = useRealtime();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!connection) return;

    const handler = (message: Message) => {
      if (!message || typeof message.id !== 'number' || typeof message.conversationId !== 'number') {
        console.warn('[realtime] Ignoring malformed NewMessage payload.', message);
        return;
      }

      const key = queryKeys.messages(message.conversationId);

      // Never seed an unfetched cache: REST owns initialization so the full
      // history is always loaded. A fetched cache is updated only when the
      // incoming message is not already present.
      const state = queryClient.getQueryState<Message[]>(key);
      if (!state?.data) return;

      queryClient.setQueryData<Message[]>(key, (current) => {
        if (!current || current.some((m) => m.id === message.id)) return current;
        return [...current, message];
      });
    };

    connection.on(NEW_MESSAGE_EVENT, handler);

    return () => {
      connection.off(NEW_MESSAGE_EVENT, handler);
    };
  }, [connection, queryClient]);
}
