import { useEffect, useRef } from 'react';
import { HubConnectionState } from '@microsoft/signalr';
import { useRealtime } from '../contexts/RealtimeContext';

/**
 * Keeps the shared SignalR connection subscribed to the currently selected
 * conversation's backend group (conversation:{id}).
 *
 * Group membership is connection-specific, so membership is re-established
 * whenever the connection is freshly connected or has just reconnected.
 * The backend remains authoritative: JoinConversation is authorized server-side.
 */
export function useConversationSubscription(conversationId: number | null) {
  const { connection, isConnected } = useRealtime();
  const joinedRef = useRef<number | null>(null);
  const prevConnectedRef = useRef(false);

  useEffect(() => {
    if (!connection) {
      joinedRef.current = null;
      prevConnectedRef.current = false;
      return;
    }

    const nowConnected = isConnected && connection.state === HubConnectionState.Connected;

    // A fresh connection (initial connect, StrictMode recreation, or a SignalR
    // reconnect) starts with no group membership, so reset the bookkeeping.
    if (nowConnected && !prevConnectedRef.current) {
      joinedRef.current = null;
    }
    prevConnectedRef.current = nowConnected;

    if (!nowConnected) return;

    const desired = conversationId;
    const actual = joinedRef.current;
    if (desired === actual) return;

    if (actual !== null) {
      connection.invoke('LeaveConversation', actual).catch((error: unknown) => {
        console.warn(`[realtime] LeaveConversation(${actual}) failed.`, error);
      });
    }
    if (desired !== null) {
      connection.invoke('JoinConversation', desired).catch((error: unknown) => {
        console.warn(`[realtime] JoinConversation(${desired}) failed.`, error);
      });
    }
    joinedRef.current = desired;
  }, [connection, isConnected, conversationId]);
}
