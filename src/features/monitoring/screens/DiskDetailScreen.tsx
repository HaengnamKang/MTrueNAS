import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MonitoringStackParamList } from '../../../navigation/types';
import { useDisks } from '../../../hooks/useDisks';
import { formatBytes, formatTemperature } from '../../../shared/utils/formatters';
import { useSettingsStore } from '../../../state/settingsStore';
import { THRESHOLDS } from '../../../shared/utils/constants';
import ErrorState from '../../../shared/components/ErrorState';

type Props = NativeStackScreenProps<MonitoringStackParamList, 'DiskDetail'>;

export default function DiskDetailScreen({ navigation }: Props) {
  const theme = useTheme();
  const colors = theme.colors as Record<string, string>;
  const { data: disks, isError, refetch } = useDisks();
  const tempUnit = useSettingsStore((s) => s.temperatureUnit);

  if (isError) return <ErrorState message="Failed to load disks" onRetry={refetch} />;

  if (!disks) {
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
      {disks.map((disk) => {
        let tempColor = colors.statusHealthy;
        if (disk.temperature != null) {
          if (disk.temperature >= THRESHOLDS.DISK_TEMP_CRITICAL) tempColor = colors.statusCritical;
          else if (disk.temperature >= THRESHOLDS.DISK_TEMP_WARNING) tempColor = colors.statusDegraded;
        }

        return (
          <Card key={disk.identifier} onPress={() => navigation.navigate('DiskSmart', { diskName: disk.name })}>
            <Card.Content>
              <View style={styles.header}>
                <Text variant="titleMedium">{disk.name}</Text>
                {disk.temperature != null && (
                  <Text variant="labelMedium" style={{ color: tempColor, fontWeight: '600' }}>
                    {formatTemperature(disk.temperature, tempUnit)}
                  </Text>
                )}
              </View>
              <View style={styles.details}>
                <Text variant="bodySmall">Model: {disk.model}</Text>
                <Text variant="bodySmall">Serial: {disk.serial}</Text>
                <Text variant="bodySmall">Size: {formatBytes(disk.size)}</Text>
                <Text variant="bodySmall">Type: {disk.type}</Text>
                {disk.pool && <Text variant="bodySmall">Pool: {disk.pool}</Text>}
                {disk.rotationrate !== null && (
                  <Text variant="bodySmall">{disk.rotationrate > 0 ? `${disk.rotationrate} RPM` : 'SSD'}</Text>
                )}
              </View>
            </Card.Content>
          </Card>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  details: { marginTop: 8, gap: 2 },
});
