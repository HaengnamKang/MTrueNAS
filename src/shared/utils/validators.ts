const IP_REGEX = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
const HOSTNAME_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export function isValidHost(value: string): boolean {
  if (!value || value.length === 0) return false;
  return IP_REGEX.test(value) || HOSTNAME_REGEX.test(value);
}

export function isValidPort(port: number): boolean {
  return Number.isInteger(port) && port >= 1 && port <= 65535;
}

export function isValidApiKey(key: string): boolean {
  return typeof key === 'string' && key.trim().length >= 10;
}

export function buildWebSocketUrl(host: string, port: number, useTls: boolean, path: string): string {
  const protocol = useTls ? 'wss' : 'ws';
  const portSuffix = (useTls && port === 443) || (!useTls && port === 80) ? '' : `:${port}`;
  return `${protocol}://${host}${portSuffix}${path}`;
}

export function buildRestBaseUrl(host: string, port: number, useTls: boolean, basePath: string): string {
  const protocol = useTls ? 'https' : 'http';
  const portSuffix = (useTls && port === 443) || (!useTls && port === 80) ? '' : `:${port}`;
  return `${protocol}://${host}${portSuffix}${basePath}`;
}
