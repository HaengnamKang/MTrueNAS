import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, RefreshControl } from 'react-native';
import { Card, Text, SegmentedButtons, useTheme, IconButton, Icon } from 'react-native-paper';
import { useAlerts } from '../../../hooks/useAlerts';
import { useTrueNasClient } from '../../../hooks/useTrueNasClient';
import { formatRelativeTime } from '../../../shared/utils/formatters';
import type { Alert as TrueNasAlert } from '../../../shared/types/truenas';
import ErrorState from '../../../shared/components/ErrorState';
import EmptyState from '../../../shared/components/EmptyState';

const LEVEL_COLORS: Record<string, string> = {
  INFO: '#2196F3',
  NOTICE: '#2196F3',
  WARNING: '#FF9800',
  ERROR: '#F44336',
  CRITICAL: '#F44336',
  ALERT: '#F44336',
  EMERGENCY: '#B71C1C',
};

const LEVEL_ICONS: Record<string, string> = {
  INFO: 'information-outline',
  NOTICE: 'information-outline',
  WARNING: 'alert-outline',
  ERROR: 'alert-circle-outline',
  CRITICAL: 'alert-octagon-outline',
  ALERT: 'alert-octagon-outline',
  EMERGENCY: 'alert-octagon',
};

export default function AlertsScreen() {
  const theme = useTheme();
  const { data: alerts, isError, refetch, isFetching } = useAlerts();
  const client = useTrueNasClient();
  const [filter, setFilter] = useState('all');

  if (isError) return <ErrorState message="Failed to load alerts" onRetry={refetch} />;

  const filtered = alerts?.filter((a) => {
    if (filter === 'active') return !a.dismissed;
    if (filter === 'dismissed') return a.dismissed;
    return true;
  }) ?? [];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.filterContainer}>
        <SegmentedButtons
          value={filter}
          onValueChange={setFilter}
          buttons={[
            { value: 'all', label: 'All' },
            { value: 'active', label: 'Active' },
            { value: 'dismissed', label: 'Dismissed' },
          ]}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
      >
        {filtered.length === 0 ? (
          <EmptyState icon="bell-off-outline" title="No Alerts" description="Everything looks good!" />
        ) : (
          filtered.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onDismiss={() => {
                client.dismissAlert(alert.id).then(() => refetch());
              }}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

function AlertCard({ alert, onDismiss }: { alert: TrueNasAlert; onDismiss: () => void }) {
  const color = LEVEL_COLORS[alert.level] ?? '#9E9E9E';
  const icon = LEVEL_ICONS[alert.level] ?? 'information-outline';

  return (
    <Card style={[styles.alertCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
      <Card.Content>
        <View style={styles.alertHeader}>
          <View style={styles.alertTitleRow}>
            <Icon source={icon} size={18} color={color} />
            <Text variant="labelMedium" style={[styles.levelBadge, { color }]}>
              {alert.level}
            </Text>
            <Text variant="bodySmall" style={{ opacity: 0.5, marginLeft: 'auto' }}>
              {formatRelativeTime(alert.datetime.$date)}
            </Text>
          </View>
          {!alert.dismissed && (
            <IconButton icon="close" size={16} onPress={onDismiss} />
          )}
        </View>
        <Text variant="bodyMedium" style={{ marginTop: 4 }}>
          {alert.formatted || alert.text}
        </Text>
        <Text variant="bodySmall" style={{ opacity: 0.4, marginTop: 4 }}>
          {alert.source} &middot; {alert.klass}
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  filterContainer: { padding: 16, paddingBottom: 8 },
  content: { padding: 16, paddingTop: 0, gap: 8, paddingBottom: 32 },
  alertCard: { borderRadius: 8 },
  alertHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  alertTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  levelBadge: { fontWeight: '700' },
});
