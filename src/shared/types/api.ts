import { API } from '../utils/constants';

export interface JsonRpcRequest {
  jsonrpc: typeof API.JSONRPC_VERSION;
  id: string;
  method: string;
  params?: unknown[];
}

export interface JsonRpcResponse<T = unknown> {
  jsonrpc: typeof API.JSONRPC_VERSION;
  id: string;
  result?: T;
  error?: JsonRpcError;
}

export interface JsonRpcError {
  code: number;
  message: string;
  data?: unknown;
}

export interface JsonRpcNotification {
  jsonrpc: typeof API.JSONRPC_VERSION;
  method: 'collection_update';
  params: CollectionUpdateParams;
}

export interface CollectionUpdateParams {
  collection: string;
  event: 'ADDED' | 'CHANGED' | 'REMOVED';
  fields: Record<string, unknown>;
}

export type JsonRpcMessage = JsonRpcResponse | JsonRpcNotification;

export function isNotification(msg: JsonRpcMessage): msg is JsonRpcNotification {
  return 'method' in msg && msg.method === 'collection_update';
}

export function isResponse(msg: JsonRpcMessage): msg is JsonRpcResponse {
  return 'id' in msg;
}
