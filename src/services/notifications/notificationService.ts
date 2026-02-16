import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { Alert, AlertLevel } from '../../shared/types/truenas';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowInForeground: false,
  }),
});

export async function requestPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleAlertNotification(alert: Alert): Promise<string> {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: `TrueNAS ${alert.level}`,
      body: alert.formatted || alert.text,
      data: { alertId: alert.id, source: alert.source },
      priority: getNotificationPriority(alert.level),
    },
    trigger: null, // immediate
  });
  return id;
}

function getNotificationPriority(
  level: AlertLevel,
): Notifications.AndroidNotificationPriority {
  switch (level) {
    case 'EMERGENCY':
    case 'ALERT':
    case 'CRITICAL':
      return Notifications.AndroidNotificationPriority.MAX;
    case 'ERROR':
      return Notifications.AndroidNotificationPriority.HIGH;
    case 'WARNING':
      return Notifications.AndroidNotificationPriority.DEFAULT;
    default:
      return Notifications.AndroidNotificationPriority.LOW;
  }
}

export async function setBadgeCount(count: number): Promise<void> {
  await Notifications.setBadgeCountAsync(count);
}

export async function setupNotificationChannel(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('truenas-alerts', {
      name: 'TrueNAS Alerts',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }
}
