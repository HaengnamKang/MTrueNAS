import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { MonitoringStackParamList } from './types';
import MonitoringOverviewScreen from '../features/monitoring/screens/MonitoringOverviewScreen';
import CpuDetailScreen from '../features/monitoring/screens/CpuDetailScreen';
import MemoryDetailScreen from '../features/monitoring/screens/MemoryDetailScreen';
import NetworkDetailScreen from '../features/monitoring/screens/NetworkDetailScreen';
import DiskDetailScreen from '../features/monitoring/screens/DiskDetailScreen';
import DiskSmartScreen from '../features/monitoring/screens/DiskSmartScreen';

const Stack = createNativeStackNavigator<MonitoringStackParamList>();

export default function MonitoringStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
      <Stack.Screen
        name="MonitoringOverview"
        component={MonitoringOverviewScreen}
        options={{ title: 'Monitoring' }}
      />
      <Stack.Screen name="CpuDetail" component={CpuDetailScreen} options={{ title: 'CPU' }} />
      <Stack.Screen name="MemoryDetail" component={MemoryDetailScreen} options={{ title: 'Memory' }} />
      <Stack.Screen name="NetworkDetail" component={NetworkDetailScreen} options={{ title: 'Network' }} />
      <Stack.Screen name="DiskDetail" component={DiskDetailScreen} options={{ title: 'Disks' }} />
      <Stack.Screen name="DiskSmart" component={DiskSmartScreen} options={{ title: 'SMART Data' }} />
    </Stack.Navigator>
  );
}
