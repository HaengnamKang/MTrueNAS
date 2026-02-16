import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import type { Alert } from '../../../shared/types/truenas';

interface Props {
  alerts: Alert[];
  onPress?: () => void;
}

export default function AlertSummaryCard({ alerts, onPress }: Props) {
  const theme = useTheme();
  const colors = theme.colors as Record<string, string>;
  const active = alerts.filter((a) => !a.dismissed);
  const critical = active.filter((a) => ['CRITICAL', 'ALERT', 'EMERGENCY'].includes(a.level));
  const warning = active.filter((a) => a.level === 'WARNING' || a.level === 'ERROR');
  const info = active.filter((a) => a.level === 'INFO' || a.level === 'NOTICE');

  return (
    <Card onPress={onPress}>
      <Card.Content>
        <Text variant="titleMedium">Alerts</Text>
        {active.length === 0 ? (
          <Text variant="bodyMedium" style={{ marginTop: 8, opacity: 0.5 }}>
            No active alerts
          </Text>
        ) : (
          <View style={styles.counters}>
            {critical.length > 0 && (
              <CountBadge count={critical.length} label="Critical" color={colors.statusCritical} />
            )}
            {warning.length > 0 && (
              <CountBadge count={warning.length} label="Warning" color={colors.statusDegraded} />
            )}
            {info.length > 0 && (
              <CountBadge count={info.length} label="Info" color={colors.statusInfo} />
            )}
          </View>
        )}
      </Card.Content>
    </Card>
  );
}

function CountBadge({ count, label, color }: { count: number; label: string; color: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text variant="titleMedium" style={styles.badgeCount}>{count}</Text>
      <Text variant="labelSmall" style={styles.badgeLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  counters: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    minWidth: 60,
  },
  badgeCount: {
    color: '#fff',
    fontWeight: 'bold',
  },
  badgeLabel: {
    color: '#fff',
    opacity: 0.9,
  },
});
