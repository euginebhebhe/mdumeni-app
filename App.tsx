// App.tsx — Root component
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SQLiteProvider } from 'expo-sqlite';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Network from 'expo-network';
import { Colors } from '@/constants/theme';
import { migrateDatabase } from '@/db/database';
import { useAppStore } from '@/store';
import { AppNavigator } from '@/navigation/AppNavigator';

function AppInit({ children }: { children: React.ReactNode }) {
  const setIsOnline = useAppStore((s) => s.setIsOnline);

  useEffect(() => {
    const checkNetwork = async () => {
      const state = await Network.getNetworkStateAsync();
      setIsOnline(state.isConnected ?? false);
    };
    checkNetwork();
    const interval = setInterval(checkNetwork, 30_000);
    return () => clearInterval(interval);
  }, [setIsOnline]);

  return <>{children}</>;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SQLiteProvider
        databaseName="mdumeni.db"
        onInit={migrateDatabase}
        useSuspense={false}
      >
        <AppInit>
          <StatusBar style="light" backgroundColor={Colors.green700} />
          <AppNavigator />
        </AppInit>
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}
