# MTrueNAS

TrueNAS SCALE mobile monitoring and management app for iOS and Android.

## Features

- **Dashboard** - Real-time server overview (CPU, memory, storage, alerts, services)
- **Monitoring** - CPU load, memory, network interfaces, disk details with SMART data
- **Storage Management** - Pool status, datasets, snapshots (create/delete), SMB/NFS shares
- **Alerts** - Real-time alert list with severity filtering, dismiss actions
- **Push Notifications** - Background health checks with local notifications
- **Multi-Server** - Save and switch between multiple TrueNAS servers

## Tech Stack

- **React Native** (Expo) - iOS & Android
- **TypeScript** - Type safety
- **JSON-RPC 2.0 over WebSocket** - TrueNAS SCALE 25.04+ API
- **TanStack Query** - Server state management with auto-refresh
- **Zustand** - Client state management
- **React Native Paper** - Material Design 3 UI
- **expo-secure-store** - Encrypted credential storage
- **expo-notifications** - Push notifications
- **expo-background-fetch** - Background monitoring

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android
```

## TrueNAS Setup

1. Open TrueNAS web UI
2. Go to **Settings > API Keys** (or account dropdown > API Keys)
3. Click **Add** to generate an API key
4. Copy the key and enter it in the MTrueNAS app

## Project Structure

```
src/
├── app/              # Root component, providers
├── features/         # Feature modules
│   ├── auth/         # Server list, add server
│   ├── dashboard/    # Main dashboard widgets
│   ├── monitoring/   # CPU, memory, network, disk screens
│   ├── storage/      # Pools, datasets, snapshots, shares
│   ├── alerts/       # Alert list, subscriptions
│   └── settings/     # App settings
├── hooks/            # TanStack Query hooks
├── navigation/       # React Navigation setup
├── services/         # API, WebSocket, notifications, storage
├── shared/           # Reusable components, types, utils
└── state/            # Zustand stores
```

## Requirements

- TrueNAS SCALE 25.04+ (recommended) or SCALE with REST API v2.0
- Node.js 18+
- Expo SDK 54
