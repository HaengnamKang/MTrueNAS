import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text, useTheme, Icon } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { StorageStackParamList } from '../../../navigation/types';
import { useDatasetsByPool } from '../../../hooks/useDatasets';
import { formatBytes } from '../../../shared/utils/formatters';
import ErrorState from '../../../shared/components/ErrorState';
import EmptyState from '../../../shared/components/EmptyState';

type Props = NativeStackScreenProps<StorageStackParamList, 'DatasetList'>;

export default function DatasetListScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const { poolName } = route.params;
  const { data: datasets, isError, refetch, isLoading } = useDatasetsByPool(poolName);

  if (isError) return <ErrorState message="Failed to load datasets" onRetry={refetch} />;
  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <Text>Loading...</Text>
      </View>
    );
  }
  if (!datasets || datasets.length === 0) {
    return <EmptyState icon="folder-off-outline" title="No Datasets" />;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {datasets.map((ds) => (
        <Card
          key={ds.id}
          onPress={() => navigation.navigate('DatasetDetail', { datasetId: ds.id })}
        >
          <Card.Content>
            <View style={styles.header}>
              <View style={styles.nameRow}>
                <Icon
                  source={ds.type === 'FILESYSTEM' ? 'folder' : 'cube-outline'}
                  size={18}
                  color={theme.colors.primary}
                />
                <Text variant="titleSmall" style={{ marginLeft: 6 }}>{ds.name}</Text>
              </View>
              {ds.encrypted && <Icon source="lock" size={14} color={theme.colors.outline} />}
            </View>
            <View style={styles.stats}>
              <Text variant="bodySmall">Used: {formatBytes(ds.used.parsed)}</Text>
              <Text variant="bodySmall">Available: {formatBytes(ds.available.parsed)}</Text>
              <Text variant="bodySmall">Compression: {ds.compression.value}</Text>
              {ds.snapshot_count > 0 && (
                <Text variant="bodySmall">Snapshots: {ds.snapshot_count}</Text>
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
  content: { padding: 16, gap: 8 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  stats: { marginTop: 8, gap: 2 },
});
