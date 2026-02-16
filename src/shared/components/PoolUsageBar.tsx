import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { formatBytes, formatPercent } from '../utils/formatters';
import { THRESHOLDS } from '../utils/constants';

interface Props {
  used: number;
  total: number;
  label?: string;
}

export default function PoolUsageBar({ used, total, label }: Props) {
  const theme = useTheme();
  const colors = theme.colors as Record<string, string>;
  const percent = total > 0 ? (used / total) * 100 : 0;

  let barColor = colors.statusHealthy;
  if (percent >= THRESHOLDS.POOL_CRITICAL) {
    barColor = colors.statusCritical;
  } else if (percent >= THRESHOLDS.POOL_WARNING) {
    barColor = colors.statusDegraded;
  }

  return (
    <View style={styles.container}>
      {label && (
        <Text variant="bodySmall" style={{ color: theme.colors.outline, marginBottom: 4 }}>
          {label}
        </Text>
      )}
      <View style={styles.barContainer}>
        <View
          style={[styles.bar, { width: `${Math.min(percent, 100)}%`, backgroundColor: barColor }]}
        />
      </View>
      <View style={styles.labels}>
        <Text variant="bodySmall">
          {formatBytes(used)} / {formatBytes(total)}
        </Text>
        <Text variant="bodySmall" style={{ color: barColor, fontWeight: '600' }}>
          {formatPercent(percent)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  barContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: 8,
    borderRadius: 4,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
});
