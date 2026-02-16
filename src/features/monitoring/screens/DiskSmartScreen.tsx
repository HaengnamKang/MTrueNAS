import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text, DataTable, useTheme, ActivityIndicator } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MonitoringStackParamList } from '../../../navigation/types';
import { useTrueNasClient } from '../../../hooks/useTrueNasClient';
import ErrorState from '../../../shared/components/ErrorState';

type Props = NativeStackScreenProps<MonitoringStackParamList, 'DiskSmart'>;

export default function DiskSmartScreen({ route }: Props) {
  const theme = useTheme();
  const client = useTrueNasClient();
  const { diskName } = route.params;

  const { data: attrs, isLoading, isError, refetch } = useQuery({
    queryKey: ['disk', 'smart', diskName],
    queryFn: () => client.getDiskSmartAttributes(diskName),
    staleTime: 60_000,
  });

  if (isError) return <ErrorState message="Failed to load SMART data" onRetry={refetch} />;

  if (isLoading || !attrs) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" />
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
          <Text variant="titleMedium">SMART Attributes - {diskName}</Text>
        </Card.Content>
      </Card>

      <DataTable>
        <DataTable.Header>
          <DataTable.Title>ID</DataTable.Title>
          <DataTable.Title>Attribute</DataTable.Title>
          <DataTable.Title numeric>Value</DataTable.Title>
          <DataTable.Title numeric>Worst</DataTable.Title>
          <DataTable.Title numeric>Thresh</DataTable.Title>
        </DataTable.Header>

        {attrs.map((attr) => (
          <DataTable.Row key={attr.id}>
            <DataTable.Cell>{attr.id}</DataTable.Cell>
            <DataTable.Cell>{attr.name}</DataTable.Cell>
            <DataTable.Cell numeric>{attr.value}</DataTable.Cell>
            <DataTable.Cell numeric>{attr.worst}</DataTable.Cell>
            <DataTable.Cell numeric>{attr.thresh}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
