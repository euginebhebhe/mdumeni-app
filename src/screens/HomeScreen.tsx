// src/screens/HomeScreen.tsx
// Dashboard — first screen farmers see every day
// Shows: sensor readings, active crop, today's task, quick actions, AI prompt

import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Modal
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
import { useSQLiteContext } from 'expo-sqlite';
import { getCropSummary, getProfitCalc } from '@/services/priceCache';
import { useTranslation } from '@/hooks/useTranslation';
import { Colors, Spacing, BorderRadius, Shadows, Typography } from '@/constants/theme';
import type { RootTabParamList } from '@/types';
import { CalendarScreen } from '@/screens/CalendarScreen';
import { ChatScreen }     from '@/screens/ChatScreen';


type Nav = BottomTabNavigationProp<RootTabParamList>;

const BASE_URL = 'https://mdumeni-api.onrender.com';

// ── Market ticker ─────────────────────────────────────────────────────────────
function MarketTicker({ prices }: { prices: any[] }) {
  if (!prices.length) return null;
  return (
    <View style={styles.tickerWrap}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tickerContent}>
        {prices.map((item: any) => (
          <View key={item.crop_id} style={styles.tickerChip}>
            <Text style={styles.tickerName}>{item.crop_name}</Text>
            <Text style={styles.tickerPrice}>${item.price_usd_kg?.toFixed(3)}</Text>
            {item.change_pct !== null && item.change_pct !== undefined ? (
              <Text style={item.change_pct >= 0 ? styles.tickerUp : styles.tickerDn}>
                {item.change_pct >= 0 ? '↑' : '↓'}{Math.abs(item.change_pct).toFixed(1)}%
              </Text>
            ) : null}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// ── Best opportunity card ─────────────────────────────────────────────────────
function BestOpportunity({ data, onPress }: { data: any; onPress: () => void }) {
  if (!data) return null;
  return (
    <TouchableOpacity style={styles.oppCard} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.oppHeader}>
        <View style={styles.oppIcon}><Text style={{ fontSize: 20 }}>💰</Text></View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.oppTitle}>Best opportunity today</Text>
          <Text style={styles.oppCrop}>{data.crop_name} · {data.farm_size_ha} ha</Text>
        </View>
        <View style={styles.oppBadge}>
          <Text style={styles.oppBadgeText}>Live</Text>
        </View>
      </View>
      <View style={styles.oppMetrics}>
        <View style={styles.oppMetric}>
          <Text style={styles.oppMetricLabel}>Input cost</Text>
          <Text style={styles.oppMetricVal}>${data.total_cost?.toFixed(0)}</Text>
        </View>
        <View style={styles.oppMetric}>
          <Text style={styles.oppMetricLabel}>Revenue est.</Text>
          <Text style={styles.oppMetricVal}>${data.gross_revenue?.toFixed(0)}</Text>
        </View>
        <View style={styles.oppMetric}>
          <Text style={styles.oppMetricLabel}>Net profit</Text>
          <Text style={[styles.oppMetricVal, { color: '#1A5C2A', fontWeight: '700' }]}>
            ${data.net_profit?.toFixed(0)}
          </Text>
        </View>
      </View>
      <Text style={styles.oppCta}>Tap to see full plan →</Text>
    </TouchableOpacity>
  );
}



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
  const db = useSQLiteContext();
  const [marketPrices, setMarketPrices] = useState<any[]>([]);
  const [bestOpportunity, setBestOpportunity] = useState<any>(null);
  const [showManual, setShowManual] = useState(false);

  const profile       = useAppStore((s) => s.profile);
  const sensorReading = useAppStore((s) => s.sensorReading);
  const activeCrop    = useAppStore((s) => s.activeCrop);
  const session       = useAppStore((s) => s.session);
  const sessionLoading = useAppStore((s) => s.sessionLoading);
  const isOnline      = useAppStore((s) => s.isOnline);
  const activeAlerts  = useAppStore((s) => s.activeAlerts);
  const criticalCount = activeAlerts.filter((a) => a.severity === 'critical').length;
  const [showCalendar, setShowCalendar] = useState(false);
  const [showChat,     setShowChat]     = useState(false);

  // Refresh session on mount
  useEffect(() => {
    refresh();
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    try {
      const body = {
        crop_id:        activeCrop?.crop_id       ?? 'CROP_002',
        crop_name:      activeCrop?.crop_name      ?? 'Sugar beans',
        farm_size_ha:   profile?.farm_size_ha      ?? 2.4,
        budget_level:   profile?.budget_level      ?? 'low',
        agro_region:    profile?.agro_region       ?? 2,
        has_irrigation: profile?.has_irrigation    ?? false,
        planting_month: new Date().getMonth() + 1,
      };
      const [summaryResult, profitResult] = await Promise.all([
        getCropSummary(db, isOnline),
        getProfitCalc(db, isOnline, body, 'home_opportunity'),
      ]);
      if (summaryResult.data) setMarketPrices(summaryResult.data.summary ?? []);
      if (profitResult.data?.net_profit > 0) setBestOpportunity(profitResult.data);
    } catch { /* offline — skip */ }
  };

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
            {profile
              ? `${profile.farm_size_ha} ha · ${profile.budget_level} input · ${
                  profile.district || 'Zimbabwe'
                }`
              : 'Set up your farm profile'}
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
              status={
                moistureLow
                  ? 'Low'
                  : moisture !== null && moisture > 80
                  ? 'High'
                  : 'Good'
              }
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
          <Text style={styles.manualBtnText}>
            ✏️ Enter soil readings manually
          </Text>
        </TouchableOpacity>

        {/* ── Alerts ───────────────────────────────────────────────────────── */}
        {topAlert && (
          <AlertStrip
            message={topAlert.message}
            severity={topAlert.severity}
            onPress={() => setShowCalendar(true)}
          />
        )}

        {phWarn && !topAlert && (
          <AlertStrip
            message={`pH ${ph?.toFixed(
              1
            )} is below maize minimum (5.5). Apply agricultural lime before planting. Tap for details →`}
            severity="warning"
            onPress={() => setShowChat(true)}
          />
        )}

        {/* ── Quick actions ─────────────────────────────────────────────────── */}
        <View style={styles.qaGrid}>
          <QuickAction
            icon="📅"
            label="Calendar"
            bgColor={Colors.blue100}
            onPress={() => setShowCalendar(true)}
          />

          <QuickAction
            icon="💰"
            label="Planning"
            bgColor={Colors.amber100}
            onPress={() => navigation.navigate('Plan')}
          />

          <QuickAction
            icon="💬"
            label="Ask AI"
            bgColor={Colors.green050}
            onPress={() => setShowChat(true)}
          />

          <QuickAction
            icon="📊"
            label="Analytics"
            bgColor={Colors.purple100}
            badge={criticalCount}
            onPress={() => navigation.navigate('MyFarm')}
          />
        </View>

        {/* ── Active crop ───────────────────────────────────────────────────── */}
        <SectionTitle label="Active crop" />

        {activeCrop ? (
          <Card
            onPress={() => setShowCalendar(true)}
            style={styles.cropCard}
          >
            <View style={styles.cropRow}>
              <View style={styles.cropIconWrap}>
                <Text style={styles.cropIcon}>🌽</Text>
              </View>

              <View style={styles.cropMeta}>
                <Text style={styles.cropName}>
                  {activeCrop.crop_name}
                </Text>

                <Text style={styles.cropSub}>
                  Planted{' '}
                  {new Date(
                    activeCrop.planting_date
                  ).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                  })}
                  {daysSincePlanting !== null
                    ? ` · Day ${daysSincePlanting}`
                    : ''}
                  {phase ? ` · Phase ${phase.number}` : ''}
                </Text>

                <PhaseDots
                  total={6}
                  current={phase?.number ?? 1}
                  done={(phase?.number ?? 1) - 1}
                />

                {phase && (
                  <Text style={styles.phaseName}>
                    {phase.name}
                  </Text>
                )}
              </View>

              <Text style={styles.chevron}>›</Text>
            </View>
          </Card>
        ) : (
          <TouchableOpacity onPress={() => setShowCalendar(true)}>
            <Card>
              <EmptyState
                icon="🌱"
                title="No active crop"
                message="Tap here to set your active crop and see daily tasks."
              />
            </Card>
          </TouchableOpacity>
        )}

        {/* ── Today's priority task ─────────────────────────────────────────── */}
        <SectionTitle label="Today's priority" />

        {todayTask ? (
          <TaskCard
            title={todayTask.title ?? todayTask.type?.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) ?? 'Task'}
            description={todayTask.description ?? todayTask.message ?? ''}
            type={todayTask.type}
            dueLabel="Due today"
            onPress={() => setShowCalendar(true)}
          />
        ) : sessionLoading ? (
          <Card>
            <LoadingSpinner message="Loading tasks..." />
          </Card>
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

        <Card
          onPress={() => setShowChat(true)}
          style={styles.aiCard}
        >
          <View style={styles.aiRow}>
            <View style={styles.aiAvatar}>
              <Text style={styles.aiEmoji}>💬</Text>
            </View>

            <View style={styles.aiText}>
              <Text style={styles.aiTitle}>
                Ask anything about your farm
              </Text>

              <Text style={styles.aiSub}>
                AI reads your soil readings, crop & season data
              </Text>
            </View>

            <Text
              style={[
                styles.chevron,
                { color: Colors.green400 },
              ]}
            >
              ›
            </Text>
          </View>

          {phWarn && (
            <View style={styles.aiSuggestion}>
              <Text style={styles.aiSuggestionText}>
                💡 Try: &quot;How much lime do I need for my{' '}
                {profile?.farm_size_ha ?? 2.4} ha?&quot;
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

      <Modal visible={showCalendar} animationType="slide"
        presentationStyle="pageSheet" onRequestClose={() => setShowCalendar(false)}>
        <View style={{ flex: 1, paddingTop: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end',
            paddingHorizontal: 16, marginBottom: 8 }}>
            <TouchableOpacity onPress={() => setShowCalendar(false)} style={{ padding: 8 }}>
              <Text style={{ fontSize: 16, color: Colors.slate600 }}>✕ Close</Text>
            </TouchableOpacity>
          </View>
          <CalendarScreen />
        </View>
      </Modal>

      <Modal visible={showChat} animationType="slide"
        presentationStyle="pageSheet" onRequestClose={() => setShowChat(false)}>
        <View style={{ flex: 1, paddingTop: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end',
            paddingHorizontal: 16, marginBottom: 8 }}>
            <TouchableOpacity onPress={() => setShowChat(false)} style={{ padding: 8 }}>
              <Text style={{ fontSize: 16, color: Colors.slate600 }}>✕ Close</Text>
            </TouchableOpacity>
          </View>
          <ChatScreen />
        </View>
      </Modal>

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
  tickerWrap:    { backgroundColor: '#145024', paddingVertical: 2 },
  tickerContent: { paddingHorizontal: 14, paddingVertical: 10, gap: 10 },
  tickerChip:    { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, alignItems: 'center', minWidth: 80 },
  tickerName:    { fontSize: 9, color: 'rgba(255,255,255,0.7)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.05 },
  tickerPrice:   { fontSize: 15, fontWeight: '700', color: '#fff', marginTop: 2 },
  tickerUp:      { fontSize: 10, color: '#9FE1CB', marginTop: 1 },
  tickerDn:      { fontSize: 10, color: '#F0997B', marginTop: 1 },
  oppCard:       { backgroundColor: '#fff', borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: '#97C459', padding: 14, ...Shadows.sm },
  oppHeader:     { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  oppIcon:       { width: 38, height: 38, backgroundColor: '#EAF3DE', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  oppTitle:      { fontSize: 11, fontWeight: '700', color: Colors.slate400, textTransform: 'uppercase', letterSpacing: 0.05 },
  oppCrop:       { fontSize: 14, fontWeight: '700', color: Colors.slate900, marginTop: 1 },
  oppBadge:      { backgroundColor: '#EAF3DE', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  oppBadgeText:  { fontSize: 10, fontWeight: '700', color: '#27500A' },
  oppMetrics:    { flexDirection: 'row', gap: 8, marginBottom: 10 },
  oppMetric:     { flex: 1, backgroundColor: Colors.slate050, borderRadius: 8, padding: 10 },
  oppMetricLabel:{ fontSize: 10, color: Colors.slate400, fontWeight: '500' },
  oppMetricVal:  { fontSize: 16, fontWeight: '600', color: Colors.slate900, marginTop: 2 },
  oppCta:        { fontSize: 12, color: '#1A5C2A', fontWeight: '600', textAlign: 'right' },
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