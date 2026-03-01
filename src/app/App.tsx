import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import Providers from './providers';
import RootNavigator from '../navigation/RootNavigator';

// Prevent splash screen from auto-hiding before app is ready
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  useEffect(() => {
    // Hide splash screen once the app is mounted
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <Providers>
      <RootNavigator />
      <StatusBar style="auto" />
    </Providers>
  );
}
