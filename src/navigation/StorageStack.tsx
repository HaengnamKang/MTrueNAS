import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { StorageStackParamList } from './types';
import StorageOverviewScreen from '../features/storage/screens/StorageOverviewScreen';
import PoolDetailScreen from '../features/storage/screens/PoolDetailScreen';
import DatasetListScreen from '../features/storage/screens/DatasetListScreen';
import DatasetDetailScreen from '../features/storage/screens/DatasetDetailScreen';
import SnapshotListScreen from '../features/storage/screens/SnapshotListScreen';
import ShareListScreen from '../features/storage/screens/ShareListScreen';
import ShareDetailScreen from '../features/storage/screens/ShareDetailScreen';

const Stack = createNativeStackNavigator<StorageStackParamList>();

export default function StorageStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
      <Stack.Screen
        name="StorageOverview"
        component={StorageOverviewScreen}
        options={{ title: 'Storage' }}
      />
      <Stack.Screen name="PoolDetail" component={PoolDetailScreen} options={({ route }) => ({ title: route.params.poolName })} />
      <Stack.Screen name="DatasetList" component={DatasetListScreen} options={({ route }) => ({ title: `${route.params.poolName} Datasets` })} />
      <Stack.Screen name="DatasetDetail" component={DatasetDetailScreen} options={{ title: 'Dataset' }} />
      <Stack.Screen name="SnapshotList" component={SnapshotListScreen} options={{ title: 'Snapshots' }} />
      <Stack.Screen name="ShareList" component={ShareListScreen} options={{ title: 'Shares' }} />
      <Stack.Screen name="ShareDetail" component={ShareDetailScreen} options={{ title: 'Share Detail' }} />
    </Stack.Navigator>
  );
}
