import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { List, Divider, useTheme } from 'react-native-paper';
import { useConnectionStore } from '../../../state/connectionStore';
import { useSettingsStore } from '../../../state/settingsStore';

export default function SettingsScreen() {
  const theme = useTheme();
  const activeServer = useConnectionStore((s) => s.activeServerConfig);
  const themeMode = useSettingsStore((s) => s.themeMode);
  const temperatureUnit = useSettingsStore((s) => s.temperatureUnit);
  const clearConnection = useConnectionStore((s) => s.clearConnection);

  return (
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
        <List.Subheader>About</List.Subheader>
        <List.Item
          title="MTrueNAS"
          description="Version 1.0.0"
          left={(props) => <List.Icon {...props} icon="information" />}
        />
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
