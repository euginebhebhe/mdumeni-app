// src/navigation/AppNavigator.tsx
// Bottom tab navigator — 5 tabs in correct order
// Home · Calendar · Analytics · AI Chat · Settings

import React from 'react';
import { useAppInit } from '@/hooks/useAppInit';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/ui';
import { useAppStore } from '@/store';
import { Colors, BorderRadius } from '@/constants/theme';
import type { RootTabParamList } from '@/types';

// Screen imports (each screen is its own file)
import { HomeScreen }      from '@/screens/HomeScreen';
import { CalendarScreen }  from '@/screens/CalendarScreen';
import { AnalyticsScreen } from '@/screens/AnalyticsScreen';
import { ChatScreen }      from '@/screens/ChatScreen';
import { SettingsScreen }  from '@/screens/SettingsScreen';

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
  const farmName = profile?.district ? `${profile.district} Farm` : 'My Farm';
  const region   = profile?.agro_region ? `Region ${profile.agro_region}` : '';

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {showHeader && <AppHeader farmName={farmName} region={region} />}
      <Screen />
    </View>
  );
}

// ── Main navigator ────────────────────────────────────────────────────────────
export function AppNavigator() {
  useAppInit(); // seed demo data + load profile from SQLite on startup
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
          {() => <WithHeader screen={HomeScreen} />}
        </Tab.Screen>

        <Tab.Screen
          name="Calendar"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="📅" label="Calendar" focused={focused} />
            ),
          }}
        >
          {() => <WithHeader screen={CalendarScreen} />}
        </Tab.Screen>

        <Tab.Screen
          name="Analytics"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="📊" label="Analytics" focused={focused}
                badge={criticalAlerts} />
            ),
          }}
        >
          {() => <WithHeader screen={AnalyticsScreen} />}
        </Tab.Screen>

        <Tab.Screen
          name="Chat"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="💬" label="AI Chat" focused={focused} />
            ),
          }}
        >
          {() => <WithHeader screen={ChatScreen} showHeader={false} />}
        </Tab.Screen>

        <Tab.Screen
          name="Settings"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="⚙️" label="Settings" focused={focused} />
            ),
          }}
        >
          {() => <WithHeader screen={SettingsScreen} />}
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
