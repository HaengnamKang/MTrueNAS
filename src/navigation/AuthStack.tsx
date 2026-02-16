import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList } from './types';
import ServerListScreen from '../features/auth/screens/ServerListScreen';
import AddServerScreen from '../features/auth/screens/AddServerScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="ServerList"
        component={ServerListScreen}
        options={{ title: 'My Servers' }}
      />
      <Stack.Screen
        name="AddServer"
        component={AddServerScreen}
        options={{ title: 'Add Server' }}
      />
    </Stack.Navigator>
  );
}
