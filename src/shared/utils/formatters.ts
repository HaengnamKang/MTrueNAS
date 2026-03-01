const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'] as const;

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  return `${value.toFixed(decimals)} ${BYTE_UNITS[i] ?? 'PB'}`;
}

export function formatBytesPerSecond(bytes: number, decimals = 1): string {
  return `${formatBytes(bytes, decimals)}/s`;
}

export function formatPercent(value: number | string | null | undefined, decimals = 1): string {
  if (value == null) return '—';
  const num = Number(value);
  if (isNaN(num)) return '—';
  return `${num.toFixed(decimals)}%`;
}

export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  return parts.join(' ') || '0m';
}

export function formatTemperature(celsius: number | null | undefined, unit: 'celsius' | 'fahrenheit' = 'celsius'): string {
  if (celsius == null) return '—';
  if (unit === 'fahrenheit') {
    return `${((celsius * 9) / 5 + 32).toFixed(0)}°F`;
  }
  return `${celsius.toFixed(0)}°C`;
}

export function formatRelativeTime(date: Date | number): string {
  const now = Date.now();
  const timestamp = typeof date === 'number' ? date : date.getTime();
  const diffMs = now - timestamp;
  const diffSeconds = Math.floor(diffMs / 1000);

  if (diffSeconds < 60) return 'just now';
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export function formatLoadAverage(load: [number, number, number]): string {
  return load.map((v) => v.toFixed(2)).join(' / ');
}
