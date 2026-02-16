import { STORAGE_KEYS } from '../../shared/utils/constants';
import * as storage from './secureStorage';
import type { ServerConfig } from '../../state/connectionStore';

function apiKeyStorageKey(serverId: string): string {
  return `${STORAGE_KEYS.API_KEY_PREFIX}${serverId}`;
}

export async function getServers(): Promise<ServerConfig[]> {
  return (await storage.getJsonItem<ServerConfig[]>(STORAGE_KEYS.SERVERS)) ?? [];
}

export async function saveServer(server: ServerConfig, apiKey: string): Promise<void> {
  const servers = await getServers();
  const index = servers.findIndex((s) => s.id === server.id);
  if (index >= 0) {
    servers[index] = server;
  } else {
    servers.push(server);
  }
  await storage.setJsonItem(STORAGE_KEYS.SERVERS, servers);
  await storage.setItem(apiKeyStorageKey(server.id), apiKey);
}

export async function deleteServer(serverId: string): Promise<void> {
  const servers = await getServers();
  const filtered = servers.filter((s) => s.id !== serverId);
  await storage.setJsonItem(STORAGE_KEYS.SERVERS, filtered);
  await storage.deleteItem(apiKeyStorageKey(serverId));
}

export async function getApiKey(serverId: string): Promise<string | null> {
  return storage.getItem(apiKeyStorageKey(serverId));
}

export async function updateLastConnected(serverId: string): Promise<void> {
  const servers = await getServers();
  const server = servers.find((s) => s.id === serverId);
  if (server) {
    server.lastConnected = new Date().toISOString();
    await storage.setJsonItem(STORAGE_KEYS.SERVERS, servers);
  }
}

export async function getActiveServerId(): Promise<string | null> {
  return storage.getItem(STORAGE_KEYS.ACTIVE_SERVER_ID);
}

export async function setActiveServerId(serverId: string | null): Promise<void> {
  if (serverId) {
    await storage.setItem(STORAGE_KEYS.ACTIVE_SERVER_ID, serverId);
  } else {
    await storage.deleteItem(STORAGE_KEYS.ACTIVE_SERVER_ID);
  }
}
