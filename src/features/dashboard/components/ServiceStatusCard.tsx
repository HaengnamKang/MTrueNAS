import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import type { Service } from '../../../shared/types/truenas';

interface Props {
  services: Service[];
}

export default function ServiceStatusCard({ services }: Props) {
  const theme = useTheme();
  const colors = theme.colors as Record<string, string>;
  const running = services.filter((s) => s.state === 'RUNNING');
  const stopped = services.filter((s) => s.state === 'STOPPED' && s.enable);

  return (
    <Card>
      <Card.Content>
        <Text variant="titleMedium">Services</Text>
        <View style={styles.row}>
          <View style={[styles.stat, { backgroundColor: colors.statusHealthy + '20' }]}>
            <Text variant="headlineSmall" style={{ color: colors.statusHealthy, fontWeight: 'bold' }}>
              {running.length}
            </Text>
            <Text variant="bodySmall" style={{ color: colors.statusHealthy }}>Running</Text>
          </View>
          {stopped.length > 0 && (
            <View style={[styles.stat, { backgroundColor: colors.statusDegraded + '20' }]}>
              <Text variant="headlineSmall" style={{ color: colors.statusDegraded, fontWeight: 'bold' }}>
                {stopped.length}
              </Text>
              <Text variant="bodySmall" style={{ color: colors.statusDegraded }}>Stopped</Text>
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  stat: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    flex: 1,
  },
});
