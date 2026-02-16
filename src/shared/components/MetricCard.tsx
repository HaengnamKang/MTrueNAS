import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme, TouchableRipple } from 'react-native-paper';
import { THRESHOLDS } from '../utils/constants';

interface Props {
  title: string;
  value: string;
  unit?: string;
  subtitle?: string;
  icon?: string;
  percent?: number;
  warningThreshold?: number;
  criticalThreshold?: number;
  onPress?: () => void;
}

export default function MetricCard({
  title,
  value,
  unit,
  subtitle,
  percent,
  warningThreshold = THRESHOLDS.CPU_WARNING,
  criticalThreshold = THRESHOLDS.CPU_CRITICAL,
  onPress,
}: Props) {
  const theme = useTheme();
  const colors = theme.colors as Record<string, string>;

  let valueColor = theme.colors.onSurface;
  if (percent !== undefined) {
    if (percent >= criticalThreshold) {
      valueColor = colors.statusCritical;
    } else if (percent >= warningThreshold) {
      valueColor = colors.statusDegraded;
    } else {
      valueColor = colors.statusHealthy;
    }
  }

  const content = (
    <Card.Content style={styles.content}>
      <Text variant="labelMedium" style={{ color: theme.colors.outline }}>
        {title}
      </Text>
      <View style={styles.valueRow}>
        <Text variant="headlineMedium" style={[styles.value, { color: valueColor }]}>
          {value}
        </Text>
        {unit && (
          <Text variant="bodyMedium" style={{ color: theme.colors.outline, marginLeft: 4 }}>
            {unit}
          </Text>
        )}
      </View>
      {subtitle && (
        <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
          {subtitle}
        </Text>
      )}
      {percent !== undefined && (
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${Math.min(percent, 100)}%`,
                backgroundColor: valueColor,
              },
            ]}
          />
        </View>
      )}
    </Card.Content>
  );

  if (onPress) {
    return (
      <Card style={styles.card}>
        <TouchableRipple onPress={onPress}>{content}</TouchableRipple>
      </Card>
    );
  }

  return <Card style={styles.card}>{content}</Card>;
}

const styles = StyleSheet.create({
  card: {},
  content: {
    paddingVertical: 12,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  value: {
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
});
