import React from 'react';
import { ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainTabParamList } from '../../../navigation/types';
import { useSystemInfo } from '../../../hooks/useSystemInfo';
import { usePools } from '../../../hooks/usePools';
import { useAlerts } from '../../../hooks/useAlerts';
import { useServices } from '../../../hooks/useServices';
import ServerInfoCard from '../components/ServerInfoCard';
import CpuMetricCard from '../components/CpuMetricCard';
import MemoryMetricCard from '../components/MemoryMetricCard';
import StorageSummaryCard from '../components/StorageSummaryCard';
import AlertSummaryCard from '../components/AlertSummaryCard';
import ServiceStatusCard from '../components/ServiceStatusCard';
import ConnectionIndicator from '../../../shared/components/ConnectionIndicator';
import ErrorState from '../../../shared/components/ErrorState';

type NavProp = NativeStackNavigationProp<MainTabParamList>;

export default function DashboardScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NavProp>();
  const systemInfo = useSystemInfo();
  const pools = usePools();
  const alerts = useAlerts();
  const services = useServices();

  const isLoading =
    systemInfo.isLoading && pools.isLoading && alerts.isLoading;
  const hasError = systemInfo.isError && !systemInfo.data;

  const handleRefresh = () => {
    systemInfo.refetch();
    pools.refetch();
    alerts.refetch();
    services.refetch();
  };

  if (isLoading) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.centered}
      >
        <ActivityIndicator size="large" />
      </ScrollView>
    );
  }

  if (hasError) {
    return <ErrorState message="Failed to load server data" onRetry={handleRefresh} />;
  }

  return (
    <>
      <ConnectionIndicator />
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={systemInfo.isFetching}
            onRefresh={handleRefresh}
          />
        }
      >
        {systemInfo.data && <ServerInfoCard info={systemInfo.data} />}

        {systemInfo.data && (
          <CpuMetricCard
            info={systemInfo.data}
            onPress={() => navigation.navigate('Monitoring', { screen: 'CpuDetail' })}
          />
        )}

        {systemInfo.data && (
          <MemoryMetricCard
            info={systemInfo.data}
            onPress={() => navigation.navigate('Monitoring', { screen: 'MemoryDetail' })}
          />
        )}

        {pools.data && (
          <StorageSummaryCard
            pools={pools.data}
            onPress={() => navigation.navigate('Storage', { screen: 'StorageOverview' })}
          />
        )}

        {alerts.data && (
          <AlertSummaryCard
            alerts={alerts.data}
            onPress={() => navigation.navigate('Alerts')}
          />
        )}

        {services.data && <ServiceStatusCard services={services.data} />}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
