import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

const brandColors = {
  primary: '#0D47A1',
  primaryLight: '#5472D3',
  primaryDark: '#002171',
  secondary: '#1B5E20',
  secondaryLight: '#4C8C4A',
  secondaryDark: '#003300',
};

const semanticColors = {
  statusHealthy: '#4CAF50',
  statusDegraded: '#FF9800',
  statusCritical: '#F44336',
  statusOffline: '#9E9E9E',
  statusInfo: '#2196F3',
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: brandColors.primary,
    primaryContainer: '#BBDEFB',
    secondary: brandColors.secondary,
    secondaryContainer: '#C8E6C9',
    error: '#B71C1C',
    errorContainer: '#FFCDD2',
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    background: '#FAFAFA',
    ...semanticColors,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#90CAF9',
    primaryContainer: '#0D47A1',
    secondary: '#81C784',
    secondaryContainer: '#1B5E20',
    error: '#EF9A9A',
    errorContainer: '#B71C1C',
    surface: '#1E1E1E',
    surfaceVariant: '#2C2C2C',
    background: '#121212',
    ...semanticColors,
  },
};

export type AppTheme = typeof lightTheme;
