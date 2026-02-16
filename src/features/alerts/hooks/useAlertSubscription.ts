import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { WebSocketService } from '../../../services/websocket/WebSocketService';
import { scheduleAlertNotification } from '../../../services/notifications/notificationService';
import type { CollectionUpdateParams } from '../../../shared/types/api';

export function useAlertSubscription() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ws = WebSocketService.getInstance();

    const unsubscribe = ws.subscribe('alert.list', (params: unknown) => {
      const data = params as CollectionUpdateParams;
      // Invalidate alerts query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['alerts'] });

      // If app is in background, send local notification
      if (AppState.currentState !== 'active' && data.event === 'ADDED' && data.fields) {
        const fields = data.fields as Record<string, unknown>;
        scheduleAlertNotification({
          id: (fields.id as string) ?? 'unknown',
          node: '',
          source: (fields.source as string) ?? '',
          klass: (fields.klass as string) ?? '',
          args: null,
          key: '',
          datetime: { $date: Date.now() },
          last_occurrence: { $date: Date.now() },
          dismissed: false,
          mail: null,
          text: (fields.text as string) ?? 'New alert',
          formatted: (fields.formatted as string) ?? (fields.text as string) ?? 'New alert',
          one_shot: false,
          level: (fields.level as string as any) ?? 'INFO',
        }).catch(() => {});
      }
    });

    return unsubscribe;
  }, [queryClient]);
}
