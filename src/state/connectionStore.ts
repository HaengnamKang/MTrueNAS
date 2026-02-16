import { create } from 'zustand';

export type ConnectionState =
  | 'disconnected'
  | 'connecting'
  | 'authenticating'
  | 'connected'
  | 'reconnecting'
  | 'error';

export interface ServerConfig {
  id: string;
  name: string;
  host: string;
  port: number;
  apiVersion: 'modern' | 'legacy';
  useTls: boolean;
  lastConnected?: string;
}

interface ConnectionStore {
  connectionState: ConnectionState;
  activeServerId: string | null;
  activeServerConfig: ServerConfig | null;
  error: string | null;

  setConnectionState: (state: ConnectionState) => void;
  setActiveServer: (config: ServerConfig) => void;
  setError: (error: string | null) => void;
  clearConnection: () => void;
}

export const useConnectionStore = create<ConnectionStore>((set) => ({
  connectionState: 'disconnected',
  activeServerId: null,
  activeServerConfig: null,
  error: null,

  setConnectionState: (connectionState) => set({ connectionState }),

  setActiveServer: (config) =>
    set({
      activeServerId: config.id,
      activeServerConfig: config,
      connectionState: 'connected',
      error: null,
    }),

  setError: (error) => set({ error, connectionState: 'error' }),

  clearConnection: () =>
    set({
      connectionState: 'disconnected',
      activeServerId: null,
      activeServerConfig: null,
      error: null,
    }),
}));
