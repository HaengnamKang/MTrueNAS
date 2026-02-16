import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { useNetworkInterfaces } from '../../../hooks/useNetworkInterfaces';
import ErrorState from '../../../shared/components/ErrorState';
import EmptyState from '../../../shared/components/EmptyState';

export default function NetworkDetailScreen() {
  const theme = useTheme();
  const { data: interfaces, isLoading, isError, refetch } = useNetworkInterfaces();

  if (isError) return <ErrorState message="Failed to load network interfaces" onRetry={refetch} />;

  if (!interfaces || isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (interfaces.length === 0) {
    return <EmptyState icon="ethernet" title="No network interfaces found" />;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {interfaces.map((iface) => (
        <Card key={iface.id}>
          <Card.Content>
            <View style={styles.header}>
              <Text variant="titleMedium">{iface.name}</Text>
              <Text
                variant="labelSmall"
                style={{
                  color: iface.state.link_state === 'LINK_STATE_UP'
                    ? (theme.colors as Record<string, string>).statusHealthy
                    : (theme.colors as Record<string, string>).statusOffline,
                }}
              >
                {iface.state.link_state === 'LINK_STATE_UP' ? 'UP' : 'DOWN'}
              </Text>
            </View>
            {iface.description ? (
              <Text variant="bodySmall" style={{ opacity: 0.6 }}>{iface.description}</Text>
            ) : null}
            <View style={styles.details}>
              <Text variant="bodySmall">Type: {iface.type}</Text>
              <Text variant="bodySmall">MTU: {iface.state.mtu}</Text>
              {iface.aliases
                .filter((a) => a.type === 'INET')
                .map((alias, i) => (
                  <Text key={i} variant="bodySmall">IP: {alias.address}/{alias.netmask}</Text>
                ))}
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  details: { marginTop: 8, gap: 2 },
});
