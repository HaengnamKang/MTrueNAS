import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import type { MainTabParamList } from './types';
import DashboardScreen from '../features/dashboard/screens/DashboardScreen';
import MonitoringStack from './MonitoringStack';
import StorageStack from './StorageStack';
import AlertsScreen from '../features/alerts/screens/AlertsScreen';
import SettingsScreen from '../features/settings/screens/SettingsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.surfaceVariant,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          headerShown: true,
          headerTitle: 'MTrueNAS',
          tabBarLabel: 'Dashboard',
        }}
      />
      <Tab.Screen
        name="Monitoring"
        component={MonitoringStack}
        options={{ tabBarLabel: 'Monitor' }}
      />
      <Tab.Screen
        name="Storage"
        component={StorageStack}
        options={{ tabBarLabel: 'Storage' }}
      />
      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{
          headerShown: true,
          headerTitle: 'Alerts',
          tabBarLabel: 'Alerts',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: true,
          headerTitle: 'Settings',
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
}
