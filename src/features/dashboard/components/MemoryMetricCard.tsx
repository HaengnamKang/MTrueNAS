import React from 'react';
import type { SystemInfo } from '../../../shared/types/truenas';
import MetricCard from '../../../shared/components/MetricCard';
import { formatBytes } from '../../../shared/utils/formatters';
import { THRESHOLDS } from '../../../shared/utils/constants';

interface Props {
  info: SystemInfo;
  onPress?: () => void;
}

export default function MemoryMetricCard({ info, onPress }: Props) {
  // Note: SystemInfo.physmem is total physical memory.
  // Actual used memory requires reporting API calls.
  // For now, show total memory as an info card.
  return (
    <MetricCard
      title="Memory"
      value={formatBytes(info.physmem)}
      subtitle="Total Physical Memory"
      onPress={onPress}
    />
  );
}
