import React from 'react';
import { ScrollView, StyleSheet, RefreshControl, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { StorageStackParamList } from '../../../navigation/types';
import { usePools } from '../../../hooks/usePools';
import StatusBadge from '../../../shared/components/StatusBadge';
import PoolUsageBar from '../../../shared/components/PoolUsageBar';
import ErrorState from '../../../shared/components/ErrorState';
import EmptyState from '../../../shared/components/EmptyState';

type Props = NativeStackScreenProps<StorageStackParamList, 'StorageOverview'>;

export default function StorageOverviewScreen({ navigation }: Props) {
  const theme = useTheme();
  const { data: pools, isLoading, isError, refetch, isFetching } = usePools();

  if (isError) return <ErrorState message="Failed to load pools" onRetry={refetch} />;
  if (!pools && isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <Text>Loading...</Text>
      </View>
    );
  }
  if (!pools || pools.length === 0) {
    return <EmptyState icon="database-off-outline" title="No Storage Pools" description="No pools found on this server" />;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
    >
      {pools.map((pool) => (
        <Card
          key={pool.id}
          onPress={() => navigation.navigate('PoolDetail', { poolId: pool.id, poolName: pool.name })}
        >
          <Card.Content>
            <View style={styles.header}>
              <Text variant="titleMedium">{pool.name}</Text>
              <StatusBadge status={pool.status} compact />
            </View>
            <PoolUsageBar used={pool.allocated} total={pool.size} />
            <View style={styles.meta}>
              <Text variant="bodySmall" style={{ opacity: 0.6 }}>
                Fragmentation: {pool.fragmentation ?? 0}%
              </Text>
              {pool.scan.function !== 'NONE' && (
                <Text variant="bodySmall" style={{ opacity: 0.6 }}>
                  Last scrub: {pool.scan.state}
                </Text>
              )}
            </View>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  meta: { marginTop: 8, gap: 2 },
});
