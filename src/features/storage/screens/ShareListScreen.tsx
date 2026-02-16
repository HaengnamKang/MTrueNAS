import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text, SegmentedButtons, useTheme, Icon } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { StorageStackParamList } from '../../../navigation/types';
import { useSmbShares, useNfsShares } from '../../../hooks/useShares';
import ErrorState from '../../../shared/components/ErrorState';
import EmptyState from '../../../shared/components/EmptyState';

type Props = NativeStackScreenProps<StorageStackParamList, 'ShareList'>;

export default function ShareListScreen({ navigation }: Props) {
  const theme = useTheme();
  const [tab, setTab] = useState<'smb' | 'nfs'>('smb');
  const smb = useSmbShares();
  const nfs = useNfsShares();

  const data = tab === 'smb' ? smb : nfs;
  const isError = data.isError;
  const shares = tab === 'smb' ? smb.data : nfs.data;

  if (isError) return <ErrorState message="Failed to load shares" onRetry={data.refetch} />;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.tabs}>
        <SegmentedButtons
          value={tab}
          onValueChange={(v) => setTab(v as 'smb' | 'nfs')}
          buttons={[
            { value: 'smb', label: 'SMB' },
            { value: 'nfs', label: 'NFS' },
          ]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {!shares || shares.length === 0 ? (
          <EmptyState icon="share-off-outline" title={`No ${tab.toUpperCase()} Shares`} />
        ) : (
          shares.map((share: any) => (
            <Card
              key={share.id}
              onPress={() =>
                navigation.navigate('ShareDetail', { shareId: share.id, shareType: tab })
              }
            >
              <Card.Content>
                <View style={styles.header}>
                  <Text variant="titleSmall">{share.name ?? share.path}</Text>
                  <View style={styles.badges}>
                    {share.enabled ? (
                      <Icon source="check-circle" size={16} color={(theme.colors as Record<string, string>).statusHealthy} />
                    ) : (
                      <Icon source="close-circle" size={16} color={(theme.colors as Record<string, string>).statusOffline} />
                    )}
                    {share.ro && <Text variant="labelSmall" style={{ opacity: 0.6 }}>RO</Text>}
                  </View>
                </View>
                <Text variant="bodySmall" style={{ opacity: 0.6 }}>{share.path}</Text>
                {share.comment ? (
                  <Text variant="bodySmall" style={{ opacity: 0.5 }}>{share.comment}</Text>
                ) : null}
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabs: { padding: 16, paddingBottom: 8 },
  content: { padding: 16, paddingTop: 0, gap: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badges: { flexDirection: 'row', gap: 6, alignItems: 'center' },
});
