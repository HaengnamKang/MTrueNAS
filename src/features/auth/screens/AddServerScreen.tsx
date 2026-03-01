import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { TextInput, Button, useTheme, HelperText, Snackbar, Switch, Text } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/types';
import { isValidHost, isValidPort, isValidApiKey } from '../../../shared/utils/validators';
import { API } from '../../../shared/utils/constants';
import { WebSocketService } from '../../../services/websocket/WebSocketService';
import { useConnectionStore, type ServerConfig } from '../../../state/connectionStore';
import * as serverConfigStore from '../../../services/storage/serverConfigStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'AddServer'>;

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export default function AddServerScreen({ navigation }: Props) {
  const theme = useTheme();
  const setActiveServer = useConnectionStore((s) => s.setActiveServer);
  const setConnectionState = useConnectionStore((s) => s.setConnectionState);

  const [name, setName] = useState('');
  const [host, setHost] = useState('');
  const [port, setPort] = useState(String(API.DEFAULT_PORT));
  const [apiKey, setApiKey] = useState('');
  const [useTls, setUseTls] = useState(true);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const hostValid = host.length === 0 || isValidHost(host);
  const portValid = port.length === 0 || isValidPort(Number(port));
  const apiKeyValid = apiKey.length === 0 || isValidApiKey(apiKey);
  const canSubmit =
    name.trim().length > 0 &&
    isValidHost(host) &&
    isValidPort(Number(port)) &&
    isValidApiKey(apiKey);

  const buildConfig = (): ServerConfig => ({
    id: generateId(),
    name: name.trim(),
    host: host.trim(),
    port: Number(port),
    apiVersion: 'modern',
    useTls,
  });

  const handleTestConnection = async () => {
    if (!canSubmit) return;
    setTesting(true);
    setTestResult(null);

    const ws = WebSocketService.getInstance();
    const config = buildConfig();

    try {
      await ws.connect(
        {
          host: config.host,
          port: config.port,
          useTls: config.useTls,
          apiVersion: config.apiVersion,
        },
        apiKey.trim(),
      );
      setTestResult('Connection successful!');
      ws.disconnect();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Connection failed';
      setTestResult(message);
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    if (!canSubmit) return;
    setSaving(true);

    const config = buildConfig();
    const ws = WebSocketService.getInstance();

    try {
      // Save server config
      await serverConfigStore.saveServer(config, apiKey.trim());
      await serverConfigStore.setActiveServerId(config.id);

      // Connect
      await ws.connect(
        {
          host: config.host,
          port: config.port,
          useTls: config.useTls,
          apiVersion: config.apiVersion,
        },
        apiKey.trim(),
      );

      await serverConfigStore.updateLastConnected(config.id);
      setActiveServer(config);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Connection failed';
      Alert.alert('Connection Error', message);
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          label="Server Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          placeholder="My TrueNAS"
          style={styles.input}
        />

        <TextInput
          label="Host / IP Address"
          value={host}
          onChangeText={setHost}
          mode="outlined"
          placeholder="192.168.1.100 or truenas.local"
          autoCapitalize="none"
          keyboardType="url"
          style={styles.input}
          error={!hostValid}
        />
        {!hostValid && (
          <HelperText type="error">Invalid hostname or IP address</HelperText>
        )}

        <TextInput
          label="Port"
          value={port}
          onChangeText={setPort}
          mode="outlined"
          keyboardType="number-pad"
          style={styles.input}
          error={!portValid}
        />
        {!portValid && (
          <HelperText type="error">Port must be between 1 and 65535</HelperText>
        )}

        <View style={styles.switchRow}>
          <Text variant="bodyLarge">Use HTTPS (TLS)</Text>
          <Switch value={useTls} onValueChange={(v) => {
            setUseTls(v);
            if (!port || port === '443') setPort(v ? '443' : '80');
            if (!port || port === '80') setPort(v ? '443' : '80');
          }} />
        </View>

        <TextInput
          label="API Key"
          value={apiKey}
          onChangeText={setApiKey}
          mode="outlined"
          secureTextEntry
          placeholder="Enter your TrueNAS API key"
          autoCapitalize="none"
          style={styles.input}
          error={!apiKeyValid}
        />
        {!apiKeyValid && (
          <HelperText type="error">API key is too short</HelperText>
        )}

        <Button
          mode="outlined"
          onPress={handleTestConnection}
          loading={testing}
          disabled={!canSubmit || testing || saving}
          style={styles.button}
          icon="connection"
        >
          Test Connection
        </Button>

        <Button
          mode="contained"
          onPress={handleSave}
          loading={saving}
          disabled={!canSubmit || testing || saving}
          style={styles.button}
          icon="content-save"
        >
          Save & Connect
        </Button>
      </ScrollView>

      <Snackbar
        visible={testResult !== null}
        onDismiss={() => setTestResult(null)}
        duration={3000}
      >
        {testResult ?? ''}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 8,
  },
  input: {
    marginBottom: 4,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  button: {
    marginTop: 8,
  },
});
