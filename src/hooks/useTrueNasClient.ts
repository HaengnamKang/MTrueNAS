import { useMemo } from 'react';
import { TrueNasClient } from '../services/api/TrueNasClient';
import { WebSocketService } from '../services/websocket/WebSocketService';

export function useTrueNasClient(): TrueNasClient {
  return useMemo(() => new TrueNasClient(WebSocketService.getInstance()), []);
}
