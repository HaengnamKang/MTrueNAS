import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useConnectionStore } from '../../state/connectionStore';

export default function ConnectionIndicator() {
  const theme = useTheme();
  const connectionState = useConnectionStore((s) => s.connectionState);
  const serverName = useConnectionStore((s) => s.activeServerConfig?.name);

  if (connectionState === 'connected') return null;

  const messages: Record<string, { text: string; color: string }> = {
    connecting: { text: 'Connecting...', color: (theme.colors as Record<string, string>).statusDegraded },
    authenticating: { text: 'Authenticating...', color: (theme.colors as Record<string, string>).statusDegraded },
    reconnecting: { text: 'Reconnecting...', color: (theme.colors as Record<string, string>).statusDegraded },
    error: { text: 'Connection Error', color: (theme.colors as Record<string, string>).statusCritical },
    disconnected: { text: 'Disconnected', color: (theme.colors as Record<string, string>).statusOffline },
  };

  const info = messages[connectionState] ?? messages.disconnected;

  return (
    <View style={[styles.container, { backgroundColor: info.color }]}>
      <Text variant="labelSmall" style={styles.text}>
        {info.text}{serverName ? ` - ${serverName}` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
  },
});
