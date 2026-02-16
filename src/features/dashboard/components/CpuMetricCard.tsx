import React from 'react';
import type { SystemInfo } from '../../../shared/types/truenas';
import MetricCard from '../../../shared/components/MetricCard';
import { formatLoadAverage } from '../../../shared/utils/formatters';
import { THRESHOLDS } from '../../../shared/utils/constants';

interface Props {
  info: SystemInfo;
  onPress?: () => void;
}

export default function CpuMetricCard({ info, onPress }: Props) {
  const load1 = info.loadavg[0];
  const loadPercent = Math.min((load1 / info.cores) * 100, 100);

  return (
    <MetricCard
      title="CPU Load"
      value={load1.toFixed(2)}
      subtitle={`Load avg: ${formatLoadAverage(info.loadavg)}`}
      percent={loadPercent}
      warningThreshold={THRESHOLDS.CPU_WARNING}
      criticalThreshold={THRESHOLDS.CPU_CRITICAL}
      onPress={onPress}
    />
  );
}
