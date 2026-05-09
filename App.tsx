// App.tsx — Root with SecureStore token persistence + Push notification setup
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Network from 'expo-network';
import { Colors } from '@/constants/theme';
import { migrateDatabase, getProfile, getActiveCrop, getLatestReading } from '@/db/database';
import { useAppStore } from '@/store';
import { AppNavigator } from '@/navigation/AppNavigator';
import { OnboardingScreen } from '@/screens/OnboardingScreen';
import { AuthScreen } from '@/screens/AuthScreen';
import { TokenStorage } from '@/services/storage';
import { registerForPushNotifications, scheduleDailyTaskReminder } from '@/services/notifications';

function AppInner() {
  const db = useSQLiteContext();

  const setIsOnline       = useAppStore((s) => s.setIsOnline);
  const onboardingDone    = useAppStore((s) => s.onboardingDone);
  const setOnboardingDone = useAppStore((s) => s.setOnboardingDone);
  const setProfile        = useAppStore((s) => s.setProfile);
  const setActiveCrop     = useAppStore((s) => s.setActiveCrop);
  const setSensor         = useAppStore((s) => s.setSensorReading);
  const setDemoMode       = useAppStore((s) => s.setDemoMode);
  const setAuthToken      = useAppStore((s) => s.setAuthToken);

  const [ready,    setReady]    = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const checkNet = async () => {
      const state = await Network.getNetworkStateAsync();
      setIsOnline(state.isConnected ?? false);
    };
    checkNet();
    const interval = setInterval(checkNet, 30_000);

    const init = async () => {
      try {
        // ── 1. Try to restore token from SecureStore ──────────────────────
        const saved = await TokenStorage.load();
        if (saved) {
          setAuthToken(saved.token, saved.farmerId);
        }

        // ── 2. Load local SQLite data ─────────────────────────────────────
        const profile = await getProfile(db);
        if (profile && profile.district && profile.district !== '') {
          setProfile(profile);
          setOnboardingDone(true);
          setDemoMode(false);

          const crop    = await getActiveCrop(db);
          if (crop) setActiveCrop(crop);

          const reading = await getLatestReading(db);
          if (reading) setSensor(reading);

          // If no saved token, show auth to get a fresh one
          if (!saved) setShowAuth(true);

        } else {
          // First launch — demo mode
          setDemoMode(true);
          setOnboardingDone(true);
        }

        // ── 3. Register for push notifications ────────────────────────────
        registerForPushNotifications().catch(() => {});
        scheduleDailyTaskReminder('Check your crop and soil readings').catch(() => {});

      } catch (e) {
        console.error('App init error:', e);
      } finally {
        setReady(true);
      }
    };
    init();
    return () => clearInterval(interval);
  }, [db]);

  if (!ready) return null;

  if (!onboardingDone) {
    return (
      <OnboardingScreen
        onComplete={() => {
          setOnboardingDone(true);
          setDemoMode(false);
          setShowAuth(true);
        }}
      />
    );
  }

  if (showAuth) {
    return (
      <AuthScreen
        onSuccess={async (farmerId, token) => {
          if (farmerId === 'demo') {
            setDemoMode(true);
          } else {
            setAuthToken(token, farmerId);
            // Persist token so farmer stays logged in
            await TokenStorage.save(token, farmerId);
            setDemoMode(false);
          }
          setShowAuth(false);
        }}
      />
    );
  }

  return <AppNavigator />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SQLiteProvider databaseName="mdumeni.db" onInit={migrateDatabase} useSuspense={false}>
        <StatusBar style="light" backgroundColor={Colors.green700} />
        <AppInner />
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}
