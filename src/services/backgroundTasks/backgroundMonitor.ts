import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { RestFallbackClient } from '../api/restFallback';
import * as serverConfigStore from '../storage/serverConfigStore';
import { scheduleAlertNotification } from '../notifications/notificationService';
import * as secureStorage from '../storage/secureStorage';
import { STORAGE_KEYS } from '../../shared/utils/constants';

const TASK_NAME = 'TRUENAS_HEALTH_CHECK';

TaskManager.defineTask(TASK_NAME, async () => {
  try {
    const activeServerId = await serverConfigStore.getActiveServerId();
    if (!activeServerId) return BackgroundFetch.BackgroundFetchResult.NoData;

    const servers = await serverConfigStore.getServers();
    const server = servers.find((s) => s.id === activeServerId);
    if (!server) return BackgroundFetch.BackgroundFetchResult.NoData;

    const apiKey = await serverConfigStore.getApiKey(activeServerId);
    if (!apiKey) return BackgroundFetch.BackgroundFetchResult.NoData;

    // Use REST fallback for background tasks (can't hold WebSocket open)
    const rest = new RestFallbackClient(server.host, server.port, server.useTls, apiKey);

    // Check system health
    const [sysInfo, alerts] = await Promise.all([
      rest.getSystemInfo().catch(() => null),
      rest.getAlerts().catch(() => []),
    ]);

    if (!sysInfo) {
      await scheduleAlertNotification({
        id: 'bg-unreachable',
        node: '',
        source: 'MTrueNAS',
        klass: 'BackgroundCheck',
        args: null,
        key: 'bg-unreachable',
        datetime: { $date: Date.now() },
        last_occurrence: { $date: Date.now() },
        dismissed: false,
        mail: null,
        text: `Server "${server.name}" is unreachable`,
        formatted: `Server "${server.name}" is unreachable`,
        one_shot: false,
        level: 'WARNING',
      });
      return BackgroundFetch.BackgroundFetchResult.NewData;
    }

    // Check for critical alerts
    const criticalAlerts = alerts.filter(
      (a) =>
        !a.dismissed &&
        ['CRITICAL', 'ALERT', 'EMERGENCY', 'ERROR'].includes(a.level),
    );

    for (const alert of criticalAlerts.slice(0, 3)) {
      await scheduleAlertNotification(alert);
    }

    return criticalAlerts.length > 0
      ? BackgroundFetch.BackgroundFetchResult.NewData
      : BackgroundFetch.BackgroundFetchResult.NoData;
  } catch {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundTask(): Promise<void> {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
  if (!isRegistered) {
    await BackgroundFetch.registerTaskAsync(TASK_NAME, {
      minimumInterval: 15 * 60, // 15 minutes
      stopOnTerminate: false,
      startOnBoot: true,
    });
  }
}

export async function unregisterBackgroundTask(): Promise<void> {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
  if (isRegistered) {
    await BackgroundFetch.unregisterTaskAsync(TASK_NAME);
  }
}
