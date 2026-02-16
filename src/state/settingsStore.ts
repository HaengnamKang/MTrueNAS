import { create } from 'zustand';

export type AlertLevel = 'INFO' | 'NOTICE' | 'WARNING' | 'ERROR' | 'CRITICAL' | 'ALERT' | 'EMERGENCY';

interface SettingsStore {
  themeMode: 'light' | 'dark' | 'system';
  refreshInterval: number;
  notificationsEnabled: boolean;
  alertLevels: AlertLevel[];
  temperatureUnit: 'celsius' | 'fahrenheit';
  backgroundMonitoringEnabled: boolean;

  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  setRefreshInterval: (interval: number) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setAlertLevels: (levels: AlertLevel[]) => void;
  setTemperatureUnit: (unit: 'celsius' | 'fahrenheit') => void;
  setBackgroundMonitoringEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  themeMode: 'system',
  refreshInterval: 30,
  notificationsEnabled: true,
  alertLevels: ['WARNING', 'ERROR', 'CRITICAL', 'ALERT', 'EMERGENCY'],
  temperatureUnit: 'celsius',
  backgroundMonitoringEnabled: false,

  setThemeMode: (themeMode) => set({ themeMode }),
  setRefreshInterval: (refreshInterval) => set({ refreshInterval }),
  setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
  setAlertLevels: (alertLevels) => set({ alertLevels }),
  setTemperatureUnit: (temperatureUnit) => set({ temperatureUnit }),
  setBackgroundMonitoringEnabled: (backgroundMonitoringEnabled) => set({ backgroundMonitoringEnabled }),
}));
