export const API = {
  DEFAULT_PORT: 443,
  WS_PATH_MODERN: '/api/current',
  WS_PATH_LEGACY: '/websocket',
  REST_BASE_PATH: '/api/v2.0',
  JSONRPC_VERSION: '2.0' as const,
  KEEPALIVE_INTERVAL_MS: 30_000,
  REQUEST_TIMEOUT_MS: 15_000,
  MAX_RECONNECT_ATTEMPTS: 10,
  RECONNECT_BASE_DELAY_MS: 1_000,
  RECONNECT_MAX_DELAY_MS: 30_000,
};

export const POLLING = {
  SYSTEM_INFO_MS: 30_000,
  POOLS_MS: 60_000,
  ALERTS_MS: 30_000,
  REALTIME_METRICS_MS: 5_000,
  DISKS_MS: 60_000,
  SERVICES_MS: 60_000,
};

export const STORAGE_KEYS = {
  SERVERS: 'mtruenas_servers',
  API_KEY_PREFIX: 'mtruenas_apikey_',
  SETTINGS: 'mtruenas_settings',
  ACTIVE_SERVER_ID: 'mtruenas_active_server',
};

export const CHART = {
  MAX_DATA_POINTS: 60,
  TIME_WINDOWS: [
    { label: '1H', hours: 1 },
    { label: '6H', hours: 6 },
    { label: '24H', hours: 24 },
    { label: '7D', hours: 168 },
  ] as const,
};

export const THRESHOLDS = {
  CPU_WARNING: 80,
  CPU_CRITICAL: 95,
  MEMORY_WARNING: 80,
  MEMORY_CRITICAL: 95,
  POOL_WARNING: 80,
  POOL_CRITICAL: 90,
  DISK_TEMP_WARNING: 45,
  DISK_TEMP_CRITICAL: 55,
};
