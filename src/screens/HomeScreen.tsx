// src/screens/HomeScreen.tsx
// Dashboard — first screen farmers see every day
// Shows: sensor readings, active crop, today's task, quick actions, AI prompt

import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useAppStore } from '@/store';
import { useSession } from '@/hooks/useSession';
import {
  AlertStrip,
  Card,
  Badge,
  TaskCard,
  SectionTitle,
  PhaseDots,
  EmptyState,
  LoadingSpinner,
} from '@/components/ui';
import { ManualSensorInput } from '@/components/ManualSensorInput';
import { useTranslation } from '@/hooks/useTranslation';
import { Colors, Spacing, BorderRadius, Shadows, Typography } from '@/constants/theme';
import type { RootTabParamList } from '@/types';

type Nav = BottomTabNavigationProp<RootTabParamList>;

// ── Sensor tile ───────────────────────────────────────────────────────────────
interface SensorTileProps {
  label:  string;
  value:  string;
  unit:   string;
  status: string;
  warn?:  boolean;
}

function SensorTile({ label, value, unit, status, warn }: SensorTileProps) {
  return (
    <View style={[styles.sensorTile, warn && styles.sensorTileWarn]}>
      <Text style={styles.tileLabel}>{label}</Text>
      <Text style={[styles.tileValue, warn && styles.tileValueWarn]}>{value}</Text>
      <Text style={styles.tileUnit}>{unit} · {status}</Text>
    </View>
  );
}

// ── Quick action button ────────────────────────────────────────────────────────
interface QuickActionProps {
  icon:    string;
  label:   string;
  bgColor: string;
  badge?:  number;
  onPress: () => void;
}

function QuickAction({ icon, label, bgColor, badge, onPress }: QuickActionProps) {
  return (
    <TouchableOpacity style={styles.qaBtn} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.qaIcon, { backgroundColor: bgColor }]}>
        <Text style={styles.qaEmoji}>{icon}</Text>
        {badge && badge > 0 ? (
          <View style={styles.qaBadge}>
            <Text style={styles.qaBadgeText}>{badge > 9 ? '9+' : badge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.qaLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export function HomeScreen() {
  const insets     = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { refresh } = useSession();
  const { t } = useTranslation();
  const [showManual, setShowManual] = React.useState(false);

  const profile       = useAppStore((s) => s.profile);
  const sensorReading = useAppStore((s) => s.sensorReading);
  const activeCrop    = useAppStore((s) => s.activeCrop);
  const session       = useAppStore((s) => s.session);
  const sessionLoading = useAppStore((s) => s.sessionLoading);
  const activeAlerts  = useAppStore((s) => s.activeAlerts);
  const criticalCount = activeAlerts.filter((a) => a.severity === 'critical').length;

  // Refresh session on mount
  useEffect(() => {
    refresh();
  }, []);

  const onRefresh = useCallback(async () => {
    await refresh();
  }, [refresh]);

  // ── Derived values ──────────────────────────────────────────────────────────
  const ph       = sensorReading?.soil_ph ?? null;
  const moisture = sensorReading?.moisture_pct ?? null;
  const temp     = sensorReading?.temp_c ?? null;

  const phWarn       = ph !== null && ph < 5.5;
  const moistureLow  = moisture !== null && moisture < 40;

  const calendar = session?.daily_calendar;
  const phase    = calendar?.current_phase;
  const todayTask = calendar?.tasks_today?.[0] ?? null;
  const topAlert  = activeAlerts[0] ?? null;
  const TASK_TITLES: Record<string, string> = {
    pest_check:        'Scout for pests',
    fertiliser:        'Apply fertiliser',
    irrigation:        'Irrigation check',
    weed_control:      'Weed control',
    soil_check:        'Soil check',
    harvest_prep:      'Prepare for harvest',
    planting:          'Planting',
    land_preparation:  'Land preparation',
  };

  // Planting days
  const daysSincePlanting = activeCrop
    ? Math.floor(
        (Date.now() - new Date(activeCrop.planting_date).getTime()) /
        (1000 * 60 * 60 * 24)
      )
    : null;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={sessionLoading}
          onRefresh={onRefresh}
          colors={[Colors.green600]}
          tintColor={Colors.green600}
        />
      }
    >
      {/* ── Hero banner ──────────────────────────────────────────────────── */}
      <View style={styles.hero}>
        <Text style={styles.greeting}>Good morning</Text>
        <Text style={styles.farmName}>
          {profile?.province ? `${profile.district} Farm` : 'My Farm'}
        </Text>
        <Text style={styles.heroSub}>
          {profile ? `${profile.farm_size_ha} ha · ${profile.budget_level} input · ${profile.district || 'Zimbabwe'}` : 'Set up your farm profile'}
        </Text>

        {/* Sensor strip */}
        <View style={styles.sensorStrip}>
          <SensorTile
            label="Soil pH"
            value={ph !== null ? ph.toFixed(1) : '—'}
            unit={phWarn ? '⚠ Low' : 'Good'}
            status={phWarn ? 'Lime needed' : 'OK'}
            warn={phWarn}
          />
          <SensorTile
            label="Moisture"
            value={moisture !== null ? `${moisture}` : '—'}
            unit="%"
            status={moistureLow ? 'Low' : moisture !== null && moisture > 80 ? 'High' : 'Good'}
            warn={moistureLow}
          />
          <SensorTile
            label="Temp"
            value={temp !== null ? `${temp.toFixed(0)}` : '—'}
            unit="°C"
            status={temp !== null && temp > 32 ? 'Hot' : 'Good'}
          />
        </View>
      </View>

      {/* Enter readings manually button */}
      <TouchableOpacity
        style={styles.manualBtn}
        onPress={() => setShowManual(true)}
        activeOpacity={0.75}
      >
        <Text style={styles.manualBtnText}>✏️  Enter soil readings manually</Text>
      </TouchableOpacity>

      {/* ── Alerts ───────────────────────────────────────────────────────── */}
      {topAlert && (
        <AlertStrip
          message={topAlert.message}
          severity={topAlert.severity}
          onPress={() => navigation.navigate('Calendar')}
        />
      )}
      {phWarn && !topAlert && (
        <AlertStrip
          message={`pH ${ph?.toFixed(1)} is below maize minimum (5.5). Apply agricultural lime before planting. Tap for details →`}
          severity="warning"
          onPress={() => navigation.navigate('Chat')}
        />
      )}

      {/* ── Quick actions ─────────────────────────────────────────────────── */}
      <View style={styles.qaGrid}>
        <QuickAction
          icon="📅"
          label="Calendar"
          bgColor={Colors.blue100}
          onPress={() => navigation.navigate('Calendar')}
        />
        <QuickAction
          icon="💰"
          label="Planning"
          bgColor={Colors.amber100}
          onPress={() => navigation.navigate('Calendar')}
        />
        <QuickAction
          icon="💬"
          label="Ask AI"
          bgColor={Colors.green050}
          onPress={() => navigation.navigate('Chat')}
        />
        <QuickAction
          icon="📊"
          label="Analytics"
          bgColor={Colors.purple100}
          badge={criticalCount}
          onPress={() => navigation.navigate('Analytics')}
        />
      </View>

      {/* ── Active crop ───────────────────────────────────────────────────── */}
      <SectionTitle label="Active crop" />
      {activeCrop ? (
        <Card onPress={() => navigation.navigate('Calendar')} style={styles.cropCard}>
          <View style={styles.cropRow}>
            <View style={styles.cropIconWrap}>
              <Text style={styles.cropIcon}>🌽</Text>
            </View>
            <View style={styles.cropMeta}>
              <Text style={styles.cropName}>{activeCrop.crop_name}</Text>
              <Text style={styles.cropSub}>
                Planted {new Date(activeCrop.planting_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                {daysSincePlanting !== null ? ` · Day ${daysSincePlanting}` : ''}
                {phase ? ` · Phase ${phase.number}` : ''}
              </Text>
              <PhaseDots
                total={6}
                current={phase?.number ?? 1}
                done={(phase?.number ?? 1) - 1}
              />
              {phase && (
                <Text style={styles.phaseName}>{phase.name}</Text>
              )}
            </View>
            <Text style={styles.chevron}>›</Text>
          </View>
        </Card>
      ) : (
        <Card>
          <EmptyState
            icon="🌱"
            title="No active crop"
            message="Go to Calendar → Crop Advice to select what to plant based on your soil."
          />
        </Card>
      )}

      {/* ── Today's priority task ─────────────────────────────────────────── */}
      <SectionTitle label="Today's priority" />
      {todayTask ? (
        <TaskCard
          title={todayTask.title ?? todayTask.type?.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) ?? 'Task'}
          description={todayTask.description ?? todayTask.message ?? ''}
          type={todayTask.type}
          dueLabel="Due today"
          onPress={() => navigation.navigate('Calendar')}
        />
      ) : sessionLoading ? (
        <Card><LoadingSpinner message="Loading tasks..." /></Card>
      ) : (
        <Card>
          <EmptyState
            icon="✅"
            title="All tasks done"
            message="Check the Calendar tab for upcoming tasks this week."
          />
        </Card>
      )}

      {/* ── AI chat prompt ────────────────────────────────────────────────── */}
      <SectionTitle label="AI assistant" />
      <Card onPress={() => navigation.navigate('Chat')} style={styles.aiCard}>
        <View style={styles.aiRow}>
          <View style={styles.aiAvatar}>
            <Text style={styles.aiEmoji}>💬</Text>
          </View>
          <View style={styles.aiText}>
            <Text style={styles.aiTitle}>Ask anything about your farm</Text>
            <Text style={styles.aiSub}>
              AI reads your soil readings, crop & season data
            </Text>
          </View>
          <Text style={[styles.chevron, { color: Colors.green400 }]}>›</Text>
        </View>
        {phWarn && (
          <View style={styles.aiSuggestion}>
            <Text style={styles.aiSuggestionText}>
              💡 Try: "How much lime do I need for my {profile?.farm_size_ha ?? 2.4} ha?"
            </Text>
          </View>
        )}
      </Card>

      {/* Bottom padding */}
      <View style={{ height: 16 }} />
    </ScrollView>

    <ManualSensorInput
      visible={showManual}
      onClose={() => setShowManual(false)}
    />
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: Spacing[6],
  },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.amber100,
    borderWidth: 1,
    borderColor: '#EF9F27',
    borderRadius: BorderRadius.sm,
    marginHorizontal: Spacing[4],
    marginTop: 10,
    padding: 10,
    gap: 10,
  },
  demoBannerLeft:    { flex: 1 },
  demoBannerTitle:   { fontSize: 13, fontWeight: '700', color: Colors.amber700 },
  demoBannerSub:     { fontSize: 11, color: Colors.amber700, marginTop: 2, lineHeight: 15 },
  demoBannerBtn:     { backgroundColor: Colors.amber500, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7 },
  demoBannerBtnText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  manualBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing[4],
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: Colors.green050,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.green100,
  },
  manualBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.green700,
  },

  // Hero
  hero: {
    backgroundColor: Colors.green700,
    paddingHorizontal: Spacing[4],
    paddingTop: 16,
    paddingBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  greeting: {
    fontSize: 13,
    color: Colors.green200,
    marginBottom: 2,
  },
  farmName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.white,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  heroSub: {
    fontSize: 12,
    color: Colors.green200,
    marginTop: 3,
  },
  sensorStrip: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  sensorTile: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.11)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: BorderRadius.sm,
    padding: 10,
  },
  sensorTileWarn: {
    backgroundColor: 'rgba(239,159,39,0.20)',
    borderColor: 'rgba(239,159,39,0.35)',
  },
  tileLabel: {
    fontSize: 9,
    color: Colors.green200,
    fontWeight: '600',
    letterSpacing: 0.04,
    textTransform: 'uppercase',
  },
  tileValue: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.white,
    lineHeight: 27,
    marginVertical: 2,
  },
  tileValueWarn: {
    color: Colors.amber400,
  },
  tileUnit: {
    fontSize: 10,
    color: Colors.green200,
  },

  // Quick actions
  qaGrid: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: Spacing[4],
    marginTop: 14,
  },
  qaBtn: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 4,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.slate100,
    ...Shadows.sm,
  },
  qaIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  qaEmoji: {
    fontSize: 18,
  },
  qaBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.red500,
    borderRadius: BorderRadius.full,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  qaBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.white,
  },
  qaLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.slate600,
    textAlign: 'center',
    letterSpacing: 0.01,
  },

  // Active crop
  cropCard: {
    borderWidth: 1.5,
    borderColor: Colors.green100,
  },
  cropRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cropIconWrap: {
    width: 46,
    height: 46,
    backgroundColor: Colors.green050,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cropIcon: {
    fontSize: 22,
  },
  cropMeta: {
    flex: 1,
  },
  cropName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.slate900,
  },
  cropSub: {
    fontSize: 11,
    color: Colors.slate400,
    marginTop: 2,
  },
  phaseName: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.green600,
    marginTop: 4,
  },
  chevron: {
    fontSize: 20,
    color: Colors.slate300,
    fontWeight: '300',
  },

  // AI card
  aiCard: {
    borderWidth: 1,
    borderColor: Colors.green100,
  },
  aiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiAvatar: {
    width: 38,
    height: 38,
    backgroundColor: Colors.green600,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  aiEmoji: {
    fontSize: 18,
  },
  aiText: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.slate900,
  },
  aiSub: {
    fontSize: 11,
    color: Colors.slate400,
    marginTop: 2,
  },
  aiSuggestion: {
    marginTop: 10,
    backgroundColor: Colors.green050,
    borderRadius: BorderRadius.sm,
    padding: 9,
  },
  aiSuggestionText: {
    fontSize: 12,
    color: Colors.green700,
    fontStyle: 'italic',
    lineHeight: 17,
  },
});
