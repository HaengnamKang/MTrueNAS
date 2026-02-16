export type ConnectionState =
  | 'disconnected'
  | 'connecting'
  | 'authenticating'
  | 'connected'
  | 'reconnecting'
  | 'error';

export interface WebSocketConfig {
  host: string;
  port: number;
  useTls: boolean;
  apiVersion: 'modern' | 'legacy';
}

export type ConnectionStateListener = (state: ConnectionState) => void;
export type EventListener = (data: unknown) => void;

export interface PendingRequest {
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
  timeout: ReturnType<typeof setTimeout>;
}
