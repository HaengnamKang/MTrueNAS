import React from 'react';
import { Card, Text, useTheme } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import type { SystemInfo } from '../../../shared/types/truenas';
import { formatUptime } from '../../../shared/utils/formatters';

interface Props {
  info: SystemInfo;
}

export default function ServerInfoCard({ info }: Props) {
  const theme = useTheme();

  return (
    <Card>
      <Card.Content>
        <Text variant="titleMedium">Server Info</Text>
        <View style={styles.grid}>
          <InfoRow label="Hostname" value={info.hostname} />
          <InfoRow label="Version" value={info.version} />
          <InfoRow label="Uptime" value={formatUptime(info.uptime_seconds)} />
          <InfoRow label="CPU" value={`${info.model} (${info.cores} cores)`} />
        </View>
      </Card.Content>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text variant="bodySmall" style={styles.label}>{label}</Text>
      <Text variant="bodyMedium" style={styles.value} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { marginTop: 8, gap: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { opacity: 0.6, flex: 1 },
  value: { flex: 2, textAlign: 'right' },
});
