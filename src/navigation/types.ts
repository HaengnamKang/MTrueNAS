import type { NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  ServerList: undefined;
  AddServer: { serverId?: string } | undefined;
};

// Monitoring Stack
export type MonitoringStackParamList = {
  MonitoringOverview: undefined;
  CpuDetail: undefined;
  MemoryDetail: undefined;
  NetworkDetail: undefined;
  DiskDetail: undefined;
  DiskSmart: { diskName: string };
};

// Storage Stack
export type StorageStackParamList = {
  StorageOverview: undefined;
  PoolDetail: { poolId: number; poolName: string };
  DatasetList: { poolName: string };
  DatasetDetail: { datasetId: string };
  SnapshotList: { datasetId?: string };
  ShareList: undefined;
  ShareDetail: { shareId: number; shareType: 'smb' | 'nfs' };
};

// Settings Stack
export type SettingsStackParamList = {
  SettingsMain: undefined;
  NotificationSettings: undefined;
  ConnectionSettings: undefined;
  About: undefined;
};

// Main Tabs
export type MainTabParamList = {
  Dashboard: undefined;
  Monitoring: NavigatorScreenParams<MonitoringStackParamList>;
  Storage: NavigatorScreenParams<StorageStackParamList>;
  Alerts: undefined;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
};

// Root Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

// Utility type for useNavigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
