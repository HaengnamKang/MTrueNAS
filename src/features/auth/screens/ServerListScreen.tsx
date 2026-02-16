import React, { useCallback, useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card, IconButton, FAB, useTheme } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/types';
import { useConnectionStore, type ServerConfig } from '../../../state/connectionStore';
import { WebSocketService } from '../../../services/websocket/WebSocketService';
import * as serverConfigStore from '../../../services/storage/serverConfigStore';
import { formatRelativeTime } from '../../../shared/utils/formatters';

type Props = NativeStackScreenProps<AuthStackParamList, 'ServerList'>;

export default function ServerListScreen({ navigation }: Props) {
  const theme = useTheme();
  const setActiveServer = useConnectionStore((s) => s.setActiveServer);
  const [servers, setServers] = useState<ServerConfig[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      serverConfigStore.getServers().then(setServers);
    }, []),
  );

  const handleConnect = async (server: ServerConfig) => {
    setConnecting(server.id);
    try {
      const apiKey = await serverConfigStore.getApiKey(server.id);
      if (!apiKey) {
        Alert.alert('Error', 'API key not found. Please re-add this server.');
        return;
      }

      const ws = WebSocketService.getInstance();
      await ws.connect(
        {
          host: server.host,
          port: server.port,
          useTls: server.useTls,
          apiVersion: server.apiVersion,
        },
        apiKey,
      );
      await serverConfigStore.updateLastConnected(server.id);
      await serverConfigStore.setActiveServerId(server.id);
      setActiveServer(server);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Connection failed';
      Alert.alert('Connection Error', message);
    } finally {
      setConnecting(null);
    }
  };

  const handleDelete = (server: ServerConfig) => {
    Alert.alert(
      'Delete Server',
      `Remove "${server.name}" from saved servers?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await serverConfigStore.deleteServer(server.id);
            setServers((prev) => prev.filter((s) => s.id !== server.id));
          },
        },
      ],
    );
  };

  if (servers.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
        <Text variant="headlineMedium" style={styles.title}>
          MTrueNAS
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Connect to your TrueNAS server
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('AddServer')}
          style={styles.addButton}
          icon="plus"
        >
          Add Server
        </Button>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={servers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card
            style={styles.card}
            onPress={() => handleConnect(item)}
          >
            <Card.Title
              title={item.name}
              subtitle={`${item.host}:${item.port}${item.lastConnected ? ` \u00b7 ${formatRelativeTime(new Date(item.lastConnected))}` : ''}`}
              left={(props) => (
                <IconButton
                  {...props}
                  icon="server"
                  mode="contained-tonal"
                  size={20}
                />
              )}
              right={(props) => (
                <IconButton
                  {...props}
                  icon="delete-outline"
                  onPress={() => handleDelete(item)}
                />
              )}
            />
          </Card>
        )}
      />
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={theme.colors.onPrimary}
        onPress={() => navigation.navigate('AddServer')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 32,
    opacity: 0.7,
  },
  addButton: {
    minWidth: 200,
  },
  list: {
    padding: 16,
    gap: 8,
  },
  card: {},
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
