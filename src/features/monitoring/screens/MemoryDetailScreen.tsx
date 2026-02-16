import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { useSystemInfo } from '../../../hooks/useSystemInfo';
import { formatBytes } from '../../../shared/utils/formatters';

export default function MemoryDetailScreen() {
  const theme = useTheme();
  const { data: info } = useSystemInfo();

  if (!info) {
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
          <Text variant="titleMedium">Physical Memory</Text>
          <Text variant="headlineMedium" style={styles.value}>{formatBytes(info.physmem)}</Text>
          <Text variant="bodySmall" style={styles.hint}>
            Detailed memory breakdown requires the reporting API and will be enhanced with real-time charts.
          </Text>
        </Card.Content>
      </Card>

      <Card>
        <Card.Content>
          <Text variant="titleMedium">System Details</Text>
          <View style={styles.grid}>
            <InfoRow label="Product" value={info.system_product} />
            <InfoRow label="Manufacturer" value={info.system_manufacturer} />
            <InfoRow label="Serial" value={info.system_serial} />
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text variant="bodySmall" style={{ opacity: 0.6, flex: 1 }}>{label}</Text>
      <Text variant="bodyMedium" style={{ flex: 2, textAlign: 'right' }} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  value: { fontWeight: 'bold', marginTop: 8 },
  hint: { opacity: 0.5, marginTop: 8 },
  grid: { marginTop: 8, gap: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
