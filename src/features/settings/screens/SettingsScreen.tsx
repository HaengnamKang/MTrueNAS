import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { List, Divider, useTheme, Portal, Dialog, Button, Text } from 'react-native-paper';
import { useConnectionStore } from '../../../state/connectionStore';
import { useSettingsStore } from '../../../state/settingsStore';
import { getTrueNasClient } from '../../../services/api/TrueNasClient';
import { WebSocketService } from '../../../services/websocket/WebSocketService';

type PowerAction = 'reboot' | 'shutdown' | null;

export default function SettingsScreen() {
  const theme = useTheme();
  const activeServer = useConnectionStore((s) => s.activeServerConfig);
  const themeMode = useSettingsStore((s) => s.themeMode);
  const temperatureUnit = useSettingsStore((s) => s.temperatureUnit);
  const clearConnection = useConnectionStore((s) => s.clearConnection);

  const [powerAction, setPowerAction] = useState<PowerAction>(null);
  const [loading, setLoading] = useState(false);

  const handlePowerAction = async () => {
    if (!powerAction) return;
    setLoading(true);
    try {
      const client = getTrueNasClient();
      if (powerAction === 'reboot') {
        await client.rebootSystem();
      } else {
        await client.shutdownSystem();
      }
    } catch {
      // Expected: server disconnects during reboot/shutdown
    } finally {
      WebSocketService.getInstance().disconnect();
      clearConnection();
      setLoading(false);
      setPowerAction(null);
    }
  };

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <List.Section>
          <List.Subheader>Connection</List.Subheader>
          <List.Item
            title="Server"
            description={activeServer?.name ?? 'Not connected'}
            left={(props) => <List.Icon {...props} icon="server" />}
          />
          <List.Item
            title="Disconnect"
            left={(props) => <List.Icon {...props} icon="logout" />}
            onPress={clearConnection}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Appearance</List.Subheader>
          <List.Item
            title="Theme"
            description={themeMode}
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
          />
          <List.Item
            title="Temperature Unit"
            description={temperatureUnit === 'celsius' ? 'Celsius' : 'Fahrenheit'}
            left={(props) => <List.Icon {...props} icon="thermometer" />}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Power</List.Subheader>
          <List.Item
            title="Restart"
            description="Reboot the TrueNAS server"
            left={(props) => <List.Icon {...props} icon="restart" />}
            onPress={() => setPowerAction('reboot')}
          />
          <List.Item
            title="Shutdown"
            description="Power off the TrueNAS server"
            left={(props) => <List.Icon {...props} icon="power" />}
            titleStyle={{ color: theme.colors.error }}
            onPress={() => setPowerAction('shutdown')}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>About</List.Subheader>
          <List.Item
            title="MTrueNAS"
            description="Version 1.0.0"
            left={(props) => <List.Icon {...props} icon="information" />}
          />
        </List.Section>
      </ScrollView>

      <Portal>
        <Dialog visible={powerAction !== null} onDismiss={() => setPowerAction(null)}>
          <Dialog.Title>
            {powerAction === 'reboot' ? 'Restart Server?' : 'Shutdown Server?'}
          </Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              {powerAction === 'reboot'
                ? 'The server will reboot. You will be disconnected and need to reconnect after it comes back up.'
                : 'The server will power off. You will need physical access to turn it back on.'}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setPowerAction(null)} disabled={loading}>
              Cancel
            </Button>
            <Button
              onPress={handlePowerAction}
              loading={loading}
              textColor={theme.colors.error}
            >
              {powerAction === 'reboot' ? 'Restart' : 'Shutdown'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
