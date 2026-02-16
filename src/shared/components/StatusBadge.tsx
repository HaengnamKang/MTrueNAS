import React from 'react';
import { Chip, useTheme } from 'react-native-paper';
import type { PoolStatus } from '../types/truenas';

interface Props {
  status: PoolStatus | string;
  compact?: boolean;
}

function getStatusColor(status: string, colors: Record<string, string>): string {
  switch (status) {
    case 'ONLINE':
    case 'RUNNING':
    case 'HEALTHY':
      return colors.statusHealthy;
    case 'DEGRADED':
      return colors.statusDegraded;
    case 'FAULTED':
    case 'ERROR':
    case 'CRITICAL':
      return colors.statusCritical;
    case 'OFFLINE':
    case 'STOPPED':
    case 'UNAVAIL':
      return colors.statusOffline;
    default:
      return colors.statusInfo;
  }
}

export default function StatusBadge({ status, compact }: Props) {
  const theme = useTheme();
  const color = getStatusColor(status, theme.colors as Record<string, string>);

  return (
    <Chip
      compact={compact}
      textStyle={{ color: '#fff', fontSize: compact ? 10 : 12, fontWeight: '600' }}
      style={{ backgroundColor: color, alignSelf: 'flex-start' }}
    >
      {status}
    </Chip>
  );
}
