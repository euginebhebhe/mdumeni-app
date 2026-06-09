import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SQLiteProvider } from 'expo-sqlite';
import { migrateDatabase } from './src/db/database';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <SQLiteProvider databaseName="mdumeni.db" onInit={migrateDatabase} useSuspense={false}>
        <AppNavigator />
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}