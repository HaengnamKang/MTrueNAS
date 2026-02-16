import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useConnectionStore } from '../state/connectionStore';
import type { RootStackParamList } from './types';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const connectionState = useConnectionStore((s) => s.connectionState);
  const isConnected = connectionState === 'connected';

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isConnected ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}
