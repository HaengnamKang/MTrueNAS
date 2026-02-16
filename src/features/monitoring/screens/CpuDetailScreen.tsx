import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { useSystemInfo } from '../../../hooks/useSystemInfo';
import { formatLoadAverage } from '../../../shared/utils/formatters';
import MetricCard from '../../../shared/components/MetricCard';

export default function CpuDetailScreen() {
  const theme = useTheme();
  const { data: info } = useSystemInfo();

  if (!info) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const load1 = info.loadavg[0];
  const loadPercent = Math.min((load1 / info.cores) * 100, 100);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <MetricCard title="CPU Load (1 min)" value={load1.toFixed(2)} percent={loadPercent} />

      <Card>
        <Card.Content>
          <Text variant="titleMedium">Load Average</Text>
          <View style={styles.loadRow}>
            <LoadItem label="1 min" value={info.loadavg[0]} cores={info.cores} />
            <LoadItem label="5 min" value={info.loadavg[1]} cores={info.cores} />
            <LoadItem label="15 min" value={info.loadavg[2]} cores={info.cores} />
          </View>
        </Card.Content>
      </Card>

      <Card>
        <Card.Content>
          <Text variant="titleMedium">CPU Info</Text>
          <View style={styles.infoGrid}>
            <InfoRow label="Model" value={info.model} />
            <InfoRow label="Cores" value={String(info.cores)} />
            <InfoRow label="Load Average" value={formatLoadAverage(info.loadavg)} />
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

function LoadItem({ label, value, cores }: { label: string; value: number; cores: number }) {
  const percent = Math.min((value / cores) * 100, 100);
  const colors = useTheme().colors as Record<string, string>;
  const color = percent >= 95 ? colors.statusCritical : percent >= 80 ? colors.statusDegraded : colors.statusHealthy;

  return (
    <View style={styles.loadItem}>
      <Text variant="headlineSmall" style={{ color, fontWeight: 'bold' }}>{value.toFixed(2)}</Text>
      <Text variant="bodySmall" style={{ opacity: 0.6 }}>{label}</Text>
    </View>
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
  loadRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 12 },
  loadItem: { alignItems: 'center' },
  infoGrid: { marginTop: 8, gap: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
