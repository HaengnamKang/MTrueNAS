import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import { Card, Text, FAB, useTheme, IconButton, Dialog, Portal, TextInput, Button } from 'react-native-paper';
import { useSnapshots, useCreateSnapshot, useDeleteSnapshot } from '../../../hooks/useSnapshots';
import { formatRelativeTime, formatBytes } from '../../../shared/utils/formatters';
import ErrorState from '../../../shared/components/ErrorState';
import EmptyState from '../../../shared/components/EmptyState';

export default function SnapshotListScreen() {
  const theme = useTheme();
  const { data: snapshots, isError, refetch, isLoading } = useSnapshots();
  const createMutation = useCreateSnapshot();
  const deleteMutation = useDeleteSnapshot();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [newDataset, setNewDataset] = useState('');
  const [newName, setNewName] = useState('');

  const handleCreate = () => {
    if (!newDataset.trim() || !newName.trim()) return;
    createMutation.mutate(
      { dataset: newDataset.trim(), name: newName.trim() },
      {
        onSuccess: () => {
          setDialogVisible(false);
          setNewDataset('');
          setNewName('');
        },
      },
    );
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Delete Snapshot', `Delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteMutation.mutate(id),
      },
    ]);
  };

  if (isError) return <ErrorState message="Failed to load snapshots" onRetry={refetch} />;
  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <Text>Loading...</Text>
      </View>
    );
  }
  if (!snapshots || snapshots.length === 0) {
    return (
      <>
        <EmptyState icon="camera-off" title="No Snapshots" description="Create a snapshot to get started" />
        <FAB
          icon="plus"
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          color={theme.colors.onPrimary}
          onPress={() => {
            setNewName(`manual-${new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')}`);
            setDialogVisible(true);
          }}
        />
      </>
    );
  }

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.content}
      >
        {snapshots.map((snap) => (
          <Card key={snap.id}>
            <Card.Content>
              <View style={styles.header}>
                <View style={{ flex: 1 }}>
                  <Text variant="bodyMedium" style={{ fontWeight: '600' }}>{snap.name}</Text>
                  <Text variant="bodySmall" style={{ opacity: 0.6 }}>
                    {snap.dataset} &middot; {snap.properties?.creation?.value ?? ''}
                  </Text>
                </View>
                <IconButton
                  icon="delete-outline"
                  size={20}
                  onPress={() => handleDelete(snap.id, snap.name)}
                />
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={theme.colors.onPrimary}
        onPress={() => {
          setNewName(`manual-${new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')}`);
          setDialogVisible(true);
        }}
      />

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Create Snapshot</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Dataset"
              value={newDataset}
              onChangeText={setNewDataset}
              mode="outlined"
              placeholder="pool/dataset"
              style={{ marginBottom: 8 }}
            />
            <TextInput
              label="Snapshot Name"
              value={newName}
              onChangeText={setNewName}
              mode="outlined"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button
              onPress={handleCreate}
              loading={createMutation.isPending}
              disabled={!newDataset.trim() || !newName.trim()}
            >
              Create
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 8, paddingBottom: 80 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fab: { position: 'absolute', right: 16, bottom: 16 },
});
