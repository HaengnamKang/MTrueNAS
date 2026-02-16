import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text, Button, useTheme, Divider } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { StorageStackParamList } from '../../../navigation/types';
import { useQuery } from '@tanstack/react-query';
import { useTrueNasClient } from '../../../hooks/useTrueNasClient';
import StatusBadge from '../../../shared/components/StatusBadge';
import PoolUsageBar from '../../../shared/components/PoolUsageBar';
import { formatBytes, formatPercent, formatRelativeTime } from '../../../shared/utils/formatters';

type Props = NativeStackScreenProps<StorageStackParamList, 'PoolDetail'>;

export default function PoolDetailScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const client = useTrueNasClient();
  const { poolId, poolName } = route.params;

  const { data: pool } = useQuery({
    queryKey: ['pool', poolId],
    queryFn: () => client.getPool(poolId),
    staleTime: 30_000,
  });

  if (!pool) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Card>
        <Card.Content>
          <View style={styles.header}>
            <Text variant="titleLarge">{pool.name}</Text>
            <StatusBadge status={pool.status} />
          </View>
          <PoolUsageBar used={pool.allocated} total={pool.size} />
          <View style={styles.statsGrid}>
            <StatItem label="Total" value={formatBytes(pool.size)} />
            <StatItem label="Used" value={formatBytes(pool.allocated)} />
            <StatItem label="Free" value={formatBytes(pool.free)} />
            <StatItem label="Fragmentation" value={formatPercent(pool.fragmentation)} />
          </View>
        </Card.Content>
      </Card>

      {pool.scan.function !== 'NONE' && (
        <Card>
          <Card.Content>
            <Text variant="titleMedium">Last Scrub</Text>
            <View style={styles.detailGrid}>
              <DetailRow label="Status" value={pool.scan.state} />
              {pool.scan.end_time && (
                <DetailRow label="Completed" value={formatRelativeTime(pool.scan.end_time.$date)} />
              )}
              {pool.scan.errors !== undefined && (
                <DetailRow label="Errors" value={String(pool.scan.errors)} />
              )}
            </View>
          </Card.Content>
        </Card>
      )}

      <Card>
        <Card.Content>
          <Text variant="titleMedium">Topology</Text>
          {pool.topology.data.length > 0 && (
            <VdevSection title="Data" vdevs={pool.topology.data} />
          )}
          {pool.topology.log.length > 0 && (
            <VdevSection title="Log" vdevs={pool.topology.log} />
          )}
          {pool.topology.cache.length > 0 && (
            <VdevSection title="Cache" vdevs={pool.topology.cache} />
          )}
          {pool.topology.spare.length > 0 && (
            <VdevSection title="Spare" vdevs={pool.topology.spare} />
          )}
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        <Button
          mode="outlined"
          icon="folder-multiple"
          onPress={() => navigation.navigate('DatasetList', { poolName })}
        >
          Datasets
        </Button>
        <Button
          mode="outlined"
          icon="camera"
          onPress={() => navigation.navigate('SnapshotList', {})}
        >
          Snapshots
        </Button>
        <Button
          mode="outlined"
          icon="share-variant"
          onPress={() => navigation.navigate('ShareList')}
        >
          Shares
        </Button>
      </View>
    </ScrollView>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <Text variant="bodySmall" style={{ opacity: 0.6 }}>{label}</Text>
      <Text variant="bodyMedium" style={{ fontWeight: '600' }}>{value}</Text>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text variant="bodySmall" style={{ opacity: 0.6, flex: 1 }}>{label}</Text>
      <Text variant="bodyMedium" style={{ flex: 2, textAlign: 'right' }}>{value}</Text>
    </View>
  );
}

function VdevSection({ title, vdevs }: { title: string; vdevs: Array<{ name: string; type: string; status: string; children: Array<{ name: string; status: string }> }> }) {
  return (
    <View style={{ marginTop: 8 }}>
      <Text variant="labelMedium" style={{ opacity: 0.6, marginBottom: 4 }}>{title}</Text>
      {vdevs.map((vdev, i) => (
        <View key={i} style={styles.vdev}>
          <View style={styles.vdevHeader}>
            <Text variant="bodySmall" style={{ fontWeight: '600' }}>{vdev.name}</Text>
            <Text variant="labelSmall">{vdev.type}</Text>
          </View>
          {vdev.children.map((child, j) => (
            <Text key={j} variant="bodySmall" style={{ marginLeft: 16, opacity: 0.7 }}>
              {child.name} ({child.status})
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12, paddingBottom: 32 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, gap: 12 },
  statItem: { minWidth: '40%' },
  detailGrid: { marginTop: 8, gap: 4 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actions: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  vdev: { marginBottom: 8 },
  vdevHeader: { flexDirection: 'row', justifyContent: 'space-between' },
});
