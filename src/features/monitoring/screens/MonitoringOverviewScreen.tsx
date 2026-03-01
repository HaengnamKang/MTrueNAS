import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MonitoringStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<MonitoringStackParamList, 'MonitoringOverview'>;

export default function MonitoringOverviewScreen({ navigation }: Props) {
  const theme = useTheme();

  const cards = [
    { title: 'CPU Usage', screen: 'CpuDetail' as const },
    { title: 'Memory Usage', screen: 'MemoryDetail' as const },
    { title: 'Network', screen: 'NetworkDetail' as const },
    { title: 'Disks', screen: 'DiskDetail' as const },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {cards.map((card) => (
        <Card
          key={card.screen}
          style={styles.card}
          mode="outlined"
          onPress={() => navigation.navigate(card.screen)}
        >
          <Card.Content>
            <Text variant="titleMedium">{card.title}</Text>
            <Text variant="bodyMedium" style={styles.placeholder}>
              Tap to view details
            </Text>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12 },
  card: {},
  placeholder: { marginTop: 8, opacity: 0.5 },
});
