import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Icon, useTheme } from 'react-native-paper';

interface Props {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = 'Something went wrong', onRetry }: Props) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Icon source="alert-circle-outline" size={48} color={theme.colors.error} />
      <Text variant="titleMedium" style={[styles.title, { color: theme.colors.error }]}>
        Error
      </Text>
      <Text variant="bodyMedium" style={{ color: theme.colors.outline, textAlign: 'center' }}>
        {message}
      </Text>
      {onRetry && (
        <Button mode="outlined" onPress={onRetry} style={styles.button}>
          Retry
        </Button>
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
  button: {
    marginTop: 16,
  },
});
