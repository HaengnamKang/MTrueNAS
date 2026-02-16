import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Icon, useTheme } from 'react-native-paper';

interface Props {
  icon?: string;
  title: string;
  description?: string;
}

export default function EmptyState({ icon = 'inbox-outline', title, description }: Props) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Icon source={icon} size={48} color={theme.colors.outline} />
      <Text variant="titleMedium" style={[styles.title, { color: theme.colors.outline }]}>
        {title}
      </Text>
      {description && (
        <Text variant="bodyMedium" style={{ color: theme.colors.outline, textAlign: 'center' }}>
          {description}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 8,
  },
  title: {
    marginTop: 8,
  },
});
