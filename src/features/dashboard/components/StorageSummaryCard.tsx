import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import type { Pool } from '../../../shared/types/truenas';
import StatusBadge from '../../../shared/components/StatusBadge';
import PoolUsageBar from '../../../shared/components/PoolUsageBar';

interface Props {
  pools: Pool[];
  onPress?: () => void;
}

export default function StorageSummaryCard({ pools, onPress }: Props) {
  const totalSize = pools.reduce((sum, p) => sum + p.size, 0);
  const totalAllocated = pools.reduce((sum, p) => sum + p.allocated, 0);
  const allHealthy = pools.every((p) => p.healthy);

  return (
    <Card onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleMedium">Storage</Text>
          <StatusBadge status={allHealthy ? 'ONLINE' : 'DEGRADED'} compact />
        </View>
        <Text variant="bodySmall" style={styles.subtitle}>
          {pools.length} pool{pools.length !== 1 ? 's' : ''}
        </Text>
        <PoolUsageBar used={totalAllocated} total={totalSize} />
        {pools.map((pool) => (
          <View key={pool.id} style={styles.poolRow}>
            <View style={styles.poolInfo}>
              <Text variant="bodySmall" style={{ fontWeight: '600' }}>{pool.name}</Text>
              <StatusBadge status={pool.status} compact />
            </View>
            <PoolUsageBar used={pool.allocated} total={pool.size} />
          </View>
        ))}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtitle: {
    opacity: 0.6,
    marginTop: 4,
    marginBottom: 8,
  },
  poolRow: {
    marginTop: 12,
  },
  poolInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
});
