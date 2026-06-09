// src/navigation/AppNavigator.tsx
// Bottom tab navigator — 5 tabs in correct order
// Home · Calendar · Analytics · AI Chat · Settings

import React, { useEffect, useRef } from 'react';
import { useAppInit } from '@/hooks/useAppInit';
import { pollLatestReading } from '@/services/api';
import { checkAndAlertSensorThresholds, checkHarvestAlert, scheduleDailyTaskReminder } from '@/services/notifications';
import { insertReading } from '@/db/database';
import { useSQLiteContext } from 'expo-sqlite';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/ui';
import { OfflineBanner } from '@/components/OfflineBanner';
import { useAppStore } from '@/store';
import { prefetchAllPrices } from '@/services/priceCache';
import { Colors, BorderRadius } from '@/constants/theme';
import type { RootTabParamList } from '@/types';

// Screen imports (each screen is its own file)
import { HomeScreen } from '@/screens/HomeScreen';
import { MarketScreen }  from '@/screens/MarketScreen';
import { PlanScreen }    from '@/screens/PlanScreen';
import { MyFarmScreen }  from '@/screens/MyFarmScreen';
import { MoreScreen }    from '@/screens/MoreScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();

// ── Tab icon component ────────────────────────────────────────────────────────
interface TabIconProps {
  emoji:    string;
  label:    string;
  focused:  boolean;
  badge?:   number;
}

function TabIcon({ emoji, label, focused, badge }: TabIconProps) {
  return (
    <View style={tabStyles.iconWrap}>
      <View style={[tabStyles.iconInner, focused && tabStyles.iconInnerActive]}>
        <Text style={tabStyles.emoji}>{emoji}</Text>
        {badge && badge > 0 ? (
          <View style={tabStyles.badge}>
            <Text style={tabStyles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={[tabStyles.label, focused && tabStyles.labelActive]}>
        {label}
      </Text>
    </View>
  );
}

// ── Wrapped screen with header ─────────────────────────────────────────────
function WithHeader({ screen: Screen, showHeader = true }: {
  screen: React.ComponentType;
  showHeader?: boolean;
}) {
  const profile = useAppStore((s) => s.profile);
  const isDemoMode = useAppStore((s) => s.isDemoMode);
  const farmName = isDemoMode
    ? '🧪 Demo Farm'
    : profile?.district ? `${profile.district} Farm` : 'My Farm';
  const region   = profile?.agro_region ? `Region ${profile.agro_region}` : '';

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <OfflineBanner />
      {showHeader && <AppHeader farmName={farmName} region={region} />}
      <Screen />
    </View>
  );
}

// ── Main navigator ────────────────────────────────────────────────────────────
export function AppNavigator() {
  useAppInit(); // seed demo data + load profile from SQLite on startup

  // Schedule harvest alert when days to harvest changes
  const daysToHarvest = useAppStore((s) => s.session?.daily_calendar?.days_to_harvest);
  const cropName      = useAppStore((s) => s.activeCrop?.crop_name);
  useEffect(() => {
    if (daysToHarvest && cropName) {
      checkHarvestAlert(cropName, daysToHarvest).catch(() => {});
    }
  }, [daysToHarvest, cropName]);

  // Update daily notification task when session refreshes
  const todayTask = useAppStore((s) => s.session?.daily_calendar?.tasks_today?.[0]?.title);
  useEffect(() => {
    if (todayTask) {
      scheduleDailyTaskReminder(todayTask).catch(() => {});
    }
  }, [todayTask]);

  // Poll /sensor/latest every 30 seconds when online
  // This picks up readings submitted via the web input form
  const isOnline     = useAppStore((s) => s.isOnline);
  const setSensor    = useAppStore((s) => s.setSensorReading);
  const db           = useSQLiteContext();
  const lastReadingAt = useRef<string | null>(null);

  useEffect(() => {
    if (!isOnline) return;

    const poll = async () => {
      const reading = await pollLatestReading();
      if (!reading) return;
      // Only update if we got a newer reading
      if (reading.recorded_at === lastReadingAt.current) return;
      lastReadingAt.current = reading.recorded_at;
      const r = {
        device_id:   reading.device_id,
        soil_ph:     reading.soil_ph,
        moisture_pct: reading.moisture_pct,
        temp_c:      reading.temp_c,
        battery_pct: reading.battery_pct,
        recorded_at: reading.recorded_at,
        is_synced:   1 as const,
      };
      await insertReading(db, r);
      setSensor({ ...r, id: Date.now() });

      // Check thresholds and send alerts
      checkAndAlertSensorThresholds(reading.soil_ph, reading.moisture_pct).catch(() => {});
    };

    poll(); // immediate on mount
    const interval = setInterval(poll, 30_000); // then every 30s
    return () => clearInterval(interval);
  }, [isOnline, db, setSensor]);
  const criticalAlerts = useAppStore(
    (s) => s.activeAlerts.filter((a) => a.severity === 'critical').length
  );

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.white,
            borderTopWidth: 1,
            borderTopColor: Colors.slate100,
            height: 60,
            paddingBottom: 0,
            paddingTop: 0,
          },
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen
          name="Home"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="🏠" label="Home" focused={focused} />
            ),
          }}
        >
          {() => <WithHeader screen={HomeScreen} showHeader={false} />}
        </Tab.Screen>

        <Tab.Screen
          name="Market"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="📈" label="Market" focused={focused} />
            ),
          }}
        >
          {() => <WithHeader screen={MarketScreen} showHeader={false} />}
        </Tab.Screen>

        <Tab.Screen
          name="Plan"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="🧮" label="Plan" focused={focused} />
            ),
          }}
        >
          {() => <WithHeader screen={PlanScreen} showHeader={false} />}
        </Tab.Screen>

        <Tab.Screen
          name="MyFarm"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="🌱" label="My Farm" focused={focused} />
            ),
          }}
        >
          {() => <WithHeader screen={MyFarmScreen} showHeader={false} />}
        </Tab.Screen>

        <Tab.Screen
          name="More"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="⋯" label="More" focused={focused} />
            ),
          }}
        >
          {() => <WithHeader screen={MoreScreen} showHeader={false} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// ── Tab icon styles ───────────────────────────────────────────────────────────
const tabStyles = StyleSheet.create({
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingTop: 8,
    width: 60,
  },
  iconInner: {
    width: 36,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.sm,
    position: 'relative',
  },
  iconInnerActive: {
    backgroundColor: Colors.green050,
  },
  emoji: {
    fontSize: 19,
    lineHeight: 24,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.slate300,
    letterSpacing: 0.01,
  },
  labelActive: {
    color: Colors.green600,
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -4,
    backgroundColor: Colors.red500,
    borderRadius: BorderRadius.full,
    minWidth: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.white,
  },
});