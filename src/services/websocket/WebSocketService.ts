import { API } from '../../shared/utils/constants';
import { buildWebSocketUrl } from '../../shared/utils/validators';
import type { JsonRpcRequest, JsonRpcResponse, JsonRpcNotification } from '../../shared/types/api';
import { isNotification, isResponse } from '../../shared/types/api';
import type {
  ConnectionState,
  WebSocketConfig,
  ConnectionStateListener,
  EventListener,
  PendingRequest,
} from './types';

let requestIdCounter = 0;
function nextId(): string {
  return String(++requestIdCounter);
}

export class WebSocketService {
  private static instance: WebSocketService | null = null;

  private ws: WebSocket | null = null;
  private config: WebSocketConfig | null = null;
  private apiKey: string | null = null;

  private _connectionState: ConnectionState = 'disconnected';
  private pendingRequests = new Map<string, PendingRequest>();
  private eventListeners = new Map<string, Set<EventListener>>();
  private connectionStateListeners = new Set<ConnectionStateListener>();
  private messageQueue: JsonRpcRequest[] = [];

  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private keepAliveTimer: ReturnType<typeof setInterval> | null = null;
  private intentionalClose = false;

  private constructor() {}

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  get connectionState(): ConnectionState {
    return this._connectionState;
  }

  private setConnectionState(state: ConnectionState) {
    this._connectionState = state;
    this.connectionStateListeners.forEach((listener) => listener(state));
  }

  onConnectionStateChange(listener: ConnectionStateListener): () => void {
    this.connectionStateListeners.add(listener);
    return () => {
      this.connectionStateListeners.delete(listener);
    };
  }

  async connect(config: WebSocketConfig, apiKey: string): Promise<void> {
    this.config = config;
    this.apiKey = apiKey;
    this.intentionalClose = false;
    this.reconnectAttempts = 0;

    return this.doConnect();
  }

  private doConnect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.config || !this.apiKey) {
        reject(new Error('No config or API key'));
        return;
      }

      this.cleanup();
      this.setConnectionState('connecting');

      const wsPath =
        this.config.apiVersion === 'modern'
          ? API.WS_PATH_MODERN
          : API.WS_PATH_LEGACY;

      const url = buildWebSocketUrl(
        this.config.host,
        this.config.port,
        this.config.useTls,
        wsPath,
      );

      try {
        this.ws = new WebSocket(url);
      } catch (err) {
        this.setConnectionState('error');
        reject(err);
        return;
      }

      this.ws.onopen = () => {
        this.setConnectionState('authenticating');
        this.authenticate()
          .then(() => {
            this.setConnectionState('connected');
            this.reconnectAttempts = 0;
            this.startKeepAlive();
            this.flushMessageQueue();
            resolve();
          })
          .catch((err) => {
            this.setConnectionState('error');
            reject(err);
          });
      };

      this.ws.onmessage = (event: MessageEvent) => {
        this.handleMessage(event.data as string);
      };

      this.ws.onclose = () => {
        this.stopKeepAlive();
        if (!this.intentionalClose) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = () => {
        if (this._connectionState === 'connecting') {
          this.setConnectionState('error');
          reject(new Error('WebSocket connection failed'));
        }
      };
    });
  }

  disconnect() {
    this.intentionalClose = true;
    this.cleanup();
    this.setConnectionState('disconnected');
  }

  private cleanup() {
    this.stopKeepAlive();
    this.clearReconnectTimer();

    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onclose = null;
      this.ws.onerror = null;
      if (
        this.ws.readyState === WebSocket.OPEN ||
        this.ws.readyState === WebSocket.CONNECTING
      ) {
        this.ws.close();
      }
      this.ws = null;
    }

    // Reject all pending requests
    this.pendingRequests.forEach((pending) => {
      clearTimeout(pending.timeout);
      pending.reject(new Error('Connection closed'));
    });
    this.pendingRequests.clear();
  }

  private async authenticate(): Promise<void> {
    const method =
      this.config?.apiVersion === 'modern'
        ? 'auth.login_with_api_key'
        : 'auth.login_with_api_key';

    const result = await this.call<boolean>(method, [this.apiKey!]);
    if (result !== true) {
      throw new Error('Authentication failed');
    }
  }

  async call<T = unknown>(method: string, params: unknown[] = []): Promise<T> {
    const id = nextId();
    const request: JsonRpcRequest = {
      jsonrpc: API.JSONRPC_VERSION,
      id,
      method,
      params,
    };

    if (this._connectionState !== 'connected' && this._connectionState !== 'authenticating') {
      // Queue message for later if not connected
      if (this._connectionState === 'reconnecting' || this._connectionState === 'connecting') {
        this.messageQueue.push(request);
        return new Promise<T>((resolve, reject) => {
          const timeout = setTimeout(() => {
            this.pendingRequests.delete(id);
            reject(new Error(`Request timeout: ${method}`));
          }, API.REQUEST_TIMEOUT_MS);

          this.pendingRequests.set(id, {
            resolve: resolve as (value: unknown) => void,
            reject,
            timeout,
          });
        });
      }
      throw new Error(`Cannot call ${method}: not connected (state: ${this._connectionState})`);
    }

    return new Promise<T>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error(`Request timeout: ${method}`));
      }, API.REQUEST_TIMEOUT_MS);

      this.pendingRequests.set(id, {
        resolve: resolve as (value: unknown) => void,
        reject,
        timeout,
      });

      this.send(request);
    });
  }

  private send(request: JsonRpcRequest) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(request));
    }
  }

  private handleMessage(data: string) {
    let msg: JsonRpcResponse | JsonRpcNotification;
    try {
      msg = JSON.parse(data);
    } catch {
      return;
    }

    if (isNotification(msg)) {
      const collection = msg.params.collection;
      const listeners = this.eventListeners.get(collection);
      listeners?.forEach((listener) => listener(msg.params));
    } else if (isResponse(msg)) {
      const pending = this.pendingRequests.get(msg.id);
      if (pending) {
        clearTimeout(pending.timeout);
        this.pendingRequests.delete(msg.id);

        if (msg.error) {
          pending.reject(
            new Error(`${msg.error.message} (code: ${msg.error.code})`),
          );
        } else {
          pending.resolve(msg.result);
        }
      }
    }
  }

  subscribe(collection: string, listener: EventListener): () => void {
    if (!this.eventListeners.has(collection)) {
      this.eventListeners.set(collection, new Set());
      // Subscribe on the server
      if (this._connectionState === 'connected') {
        this.call('core.subscribe', [collection]).catch(() => {});
      }
    }
    this.eventListeners.get(collection)!.add(listener);

    return () => {
      const listeners = this.eventListeners.get(collection);
      if (listeners) {
        listeners.delete(listener);
        if (listeners.size === 0) {
          this.eventListeners.delete(collection);
          if (this._connectionState === 'connected') {
            this.call('core.unsubscribe', [collection]).catch(() => {});
          }
        }
      }
    };
  }

  private startKeepAlive() {
    this.stopKeepAlive();
    this.keepAliveTimer = setInterval(() => {
      if (this._connectionState === 'connected') {
        this.call('core.ping').catch(() => {});
      }
    }, API.KEEPALIVE_INTERVAL_MS);
  }

  private stopKeepAlive() {
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= API.MAX_RECONNECT_ATTEMPTS) {
      this.setConnectionState('error');
      return;
    }

    this.setConnectionState('reconnecting');
    const delay = Math.min(
      API.RECONNECT_BASE_DELAY_MS * Math.pow(2, this.reconnectAttempts),
      API.RECONNECT_MAX_DELAY_MS,
    );
    this.reconnectAttempts++;

    this.reconnectTimer = setTimeout(() => {
      this.doConnect().catch(() => {
        // Will trigger onclose -> scheduleReconnect again
      });
    }, delay);
  }

  private clearReconnectTimer() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private flushMessageQueue() {
    const queue = [...this.messageQueue];
    this.messageQueue = [];
    queue.forEach((request) => this.send(request));
  }
}
