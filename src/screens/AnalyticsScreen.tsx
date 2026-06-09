// src/screens/AnalyticsScreen.tsx
// Farm performance tracking — 6 KPI tiles, soil history bars,
// season comparison table, spending breakdown

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { Card, SectionTitle, Badge, EmptyState } from '@/components/ui';
import { useAppStore } from '@/store';
import { getReadingHistory } from '@/db/database';
import { getSeasonHistory } from '@/services/api';
import { Colors, Spacing, BorderRadius, Shadows, Typography } from '@/constants/theme';

// ── Period selector ────────────────────────────────────────────────────────────
const PERIODS = ['This season', 'Last season', '2 seasons'] as const;
type Period = typeof PERIODS[number];

function PeriodTabs({
  active, onChange, available,
}: {
  active: Period;
  onChange: (p: Period) => void;
  available: Record<Period, boolean>;
}) {
  return (
    <View style={ptStyles.row}>
      {PERIODS.map((p) => {
        const enabled = available[p];
        return (
          <TouchableOpacity
            key={p}
            onPress={() => enabled && onChange(p)}
            style={[ptStyles.chip, active === p && ptStyles.chipActive,
              !enabled && { opacity: 0.4 }]}
            activeOpacity={enabled ? 0.7 : 1}
          >
            <Text style={[ptStyles.chipText, active === p && ptStyles.chipTextActive]}>
              {p}{!enabled && p !== 'This season' ? ' · no data' : ''}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ── Mini bar chart ─────────────────────────────────────────────────────────────
function MiniBarChart({ bars, color }: { bars: number[]; color: string }) {
  const max = Math.max(...bars, 1);
  return (
    <View style={chartStyles.row}>
      {bars.map((v, i) => (
        <View
          key={i}
          style={[
            chartStyles.bar,
            {
              height: Math.max(4, (v / max) * 36),
              backgroundColor: i === bars.length - 1 ? color : color + '66',
            },
          ]}
        />
      ))}
    </View>
  );
}

// ── KPI tile ──────────────────────────────────────────────────────────────────
interface KPITileProps {
  label:      string;
  value:      string;
  trend:      string;
  trendUp?:   boolean;
  trendDown?: boolean;
  bars:       number[];
  barColor:   string;
  subLabel:   string;
}

function KPITile({ label, value, trend, trendUp, trendDown, bars, barColor, subLabel }: KPITileProps) {
  const trendColor = trendUp ? Colors.green500 : trendDown ? Colors.red500 : Colors.slate400;
  return (
    <View style={kpiStyles.tile}>
      <Text style={kpiStyles.label}>{label}</Text>
      <Text style={[kpiStyles.value, trendUp && { color: Colors.green600 }, trendDown && { color: Colors.amber700 }]}>
        {value}
      </Text>
      <Text style={[kpiStyles.trend, { color: trendColor }]}>{trend}</Text>
      <MiniBarChart bars={bars} color={barColor} />
      <Text style={kpiStyles.subLabel}>{subLabel}</Text>
    </View>
  );
}

// ── Soil trend bar ─────────────────────────────────────────────────────────────
interface SoilBarProps {
  label:   string;
  value:   number;    // raw reading
  maxVal:  number;    // for percentage bar
  color:   string;
  unit:    string;
  trend:   '▲' | '▼' | '→';
  trendColor: string;
}

function SoilBar({ label, value, maxVal, color, unit, trend, trendColor }: SoilBarProps) {
  const pct = Math.min((value / maxVal) * 100, 100);
  return (
    <View style={soilStyles.row}>
      <Text style={soilStyles.label}>{label}</Text>
      <View style={soilStyles.track}>
        <View style={[soilStyles.fill, { width: `${pct}%` as `${number}%`, backgroundColor: color }]} />
      </View>
      <Text style={soilStyles.val}>{unit === '°' ? `${value}°C` : `${value}${unit}`}</Text>
      <Text style={[soilStyles.trend, { color: trendColor }]}>{trend}</Text>
    </View>
  );
}

// ── Season history row ─────────────────────────────────────────────────────────
interface SeasonRowProps {
  cropName:     string;
  variety:      string;
  size:         string;
  yieldKg:      number;
  profitUsd:    number;
  isPositive:   boolean;
}

function SeasonRow({ cropName, variety, size, yieldKg, profitUsd, isPositive }: SeasonRowProps) {
  return (
    <View style={histStyles.row}>
      <View style={{ flex: 1 }}>
        <Text style={histStyles.cropName}>{cropName}</Text>
        <Text style={histStyles.meta}>{variety} · {size}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={histStyles.yield}>{yieldKg.toLocaleString()} kg</Text>
        <Text style={[histStyles.profit, { color: isPositive ? Colors.green600 : Colors.red500 }]}>
          {isPositive ? '+' : ''}${profitUsd}
        </Text>
      </View>
    </View>
  );
}

// ── Spending row ───────────────────────────────────────────────────────────────
interface SpendRowProps {
  label:     string;
  amount:    number;
  total:     number;
  color:     string;
}

function SpendRow({ label, amount, total, color }: SpendRowProps) {
  const pct = total > 0 ? (amount / total) * 100 : 0;
  return (
    <View style={spendStyles.row}>
      <View style={[spendStyles.dot, { backgroundColor: color }]} />
      <Text style={spendStyles.label}>{label}</Text>
      <View style={spendStyles.track}>
        <View style={[spendStyles.fill, { width: `${pct}%` as `${number}%`, backgroundColor: color }]} />
      </View>
      <Text style={spendStyles.val}>${amount}</Text>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
interface SeasonRecord {
  id:                 string;
  crop_name:          string;
  crop_id:            string;
  planting_date:      string;
  harvest_date:       string | null;
  farm_size_ha:       number;
  budget_level:       string;
  predicted_yield_kg: number;
  actual_yield_kg:    number;
  total_cost_usd:     number;
  gross_revenue_usd:  number;
  net_profit_usd:     number;
  notes:              string;
}

export function AnalyticsScreen() {
  const db          = useSQLiteContext();
  const [period, setPeriod] = useState<Period>('This season');
  const session     = useAppStore((s) => s.session);
  const activeCrop  = useAppStore((s) => s.activeCrop);
  const sensor      = useAppStore((s) => s.sensorReading);
  const profile     = useAppStore((s) => s.profile);
  const authToken   = useAppStore((s) => s.authToken);
  const isOnline    = useAppStore((s) => s.isOnline);

  // ── Real data state ──────────────────────────────────────────────────────
  const [history, setHistory]       = useState<SeasonRecord[]>([]);   // past seasons, newest first
  const [readings, setReadings]     = useState<{ soil_ph: number; moisture_pct: number; temp_c: number; recorded_at: string }[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    // Sensor history is always local (works offline)
    try {
      const r = await getReadingHistory(db, 7);
      setReadings(r ?? []);
    } catch { setReadings([]); }

    // Season history needs the server + a logged-in farmer
    if (authToken && isOnline) {
      try {
        const h = await getSeasonHistory(authToken);
        // newest first by harvest/planting date
        const sorted = [...(h ?? [])].sort((a, b) =>
          (b.harvest_date ?? b.planting_date ?? '').localeCompare(a.harvest_date ?? a.planting_date ?? '')
        );
        setHistory(sorted);
      } catch { /* keep whatever we had */ }
    }
  }, [db, authToken, isOnline]);

  useEffect(() => { load(); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  // ── Which past seasons map to which tab ──────────────────────────────────
  const lastSeason = history[0] ?? null;        // most recent completed season
  const twoSeasons = history[1] ?? null;        // the one before that
  const available: Record<Period, boolean> = {
    'This season': true,
    'Last season': !!lastSeason,
    '2 seasons':   !!twoSeasons,
  };

  const plan     = session?.crop_plan;
  const calendar = session?.daily_calendar;

  // ── Current-season live values (from session/sensor) ─────────────────────
  const curYieldKg   = plan?.expected_yield_kg ?? 0;
  const curNetProfit = plan?.net_profit_usd    ?? 0;
  const curTotalCost = plan?.total_cost_usd    ?? 0;
  const curRoi       = plan?.roi_pct           ?? 0;
  const progressPct  = calendar?.progress_pct  ?? 0;
  const phaseNum     = calendar?.current_phase?.number ?? 0;

  // ── 7-day sensor averages (real, computed) ───────────────────────────────
  const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  const phSeries       = readings.map(r => r.soil_ph).filter(v => v != null);
  const moistureSeries = readings.map(r => r.moisture_pct).filter(v => v != null);
  const tempSeries     = readings.map(r => r.temp_c).filter(v => v != null);
  // fall back to the single latest reading if we have no 7-day history yet
  const phVal       = phSeries.length       ? avg(phSeries)       : (sensor?.soil_ph     ?? 0);
  const moistureVal = moistureSeries.length ? avg(moistureSeries) : (sensor?.moisture_pct ?? 0);
  const tempVal     = tempSeries.length     ? avg(tempSeries)     : (sensor?.temp_c       ?? 0);

  // ── Period-aware displayed values ────────────────────────────────────────
  // 'This season' uses live data; the others use the recorded SeasonRecord.
  const periodRecord = period === 'Last season' ? lastSeason : period === '2 seasons' ? twoSeasons : null;
  const yieldKg   = periodRecord ? periodRecord.actual_yield_kg : curYieldKg;
  const netProfit = periodRecord ? periodRecord.net_profit_usd  : curNetProfit;
  const totalCost = periodRecord ? periodRecord.total_cost_usd  : curTotalCost;
  const roi       = periodRecord
    ? (periodRecord.total_cost_usd > 0 ? Math.round((periodRecord.net_profit_usd / periodRecord.total_cost_usd) * 100) : 0)
    : curRoi;

  // ── Real trend vs the previous season ────────────────────────────────────
  function pctChange(now: number, prev?: number | null): { label: string; up: boolean; down: boolean } {
    if (!prev || prev <= 0 || !now) return { label: '—', up: false, down: false };
    const change = ((now / prev) - 1) * 100;
    const rounded = Math.round(change);
    if (rounded === 0) return { label: '→ same as last season', up: false, down: false };
    return {
      label: `${rounded > 0 ? '▲ +' : '▼ '}${rounded}% vs last season`,
      up:   rounded > 0,
      down: rounded < 0,
    };
  }
  const yieldTrend  = pctChange(yieldKg,   lastSeason?.actual_yield_kg);
  const profitTrend = pctChange(netProfit, lastSeason?.net_profit_usd);

  // ── KPI bar series: real past yields/profits + current as the last bar ───
  const pastYieldBars  = [...history].reverse().map(h => h.actual_yield_kg).filter(v => v > 0);
  const pastProfitBars = [...history].reverse().map(h => h.net_profit_usd);
  const yieldBars  = pastYieldBars.length  ? [...pastYieldBars,  yieldKg].slice(-6)   : [yieldKg];
  const profitBars = pastProfitBars.length ? [...pastProfitBars, netProfit].slice(-6) : [netProfit];
  const phBars     = phSeries.length ? phSeries.slice(-6) : [phVal];

  // ── Spending breakdown (live plan cost lines; empty if none) ─────────────
  const costLines = plan?.cost_lines ?? [];
  const spendColors = [
    Colors.amber500, Colors.blue500, Colors.green400,
    Colors.red500, '#4A3585',
  ];

  const fmt = (n: number) => Math.round(n).toLocaleString();

  return (
    <ScrollView
      style={styles.screen}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.green600} />}
    >
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <View style={styles.hero}>
        <Text style={styles.heroLabel}>FARM PERFORMANCE</Text>
        <Text style={styles.heroTitle}>Analytics</Text>
        <Text style={styles.heroSub}>
          {period === 'This season'
            ? `Season overview · ${profile?.farm_size_ha ?? '—'} ha · ${activeCrop?.crop_name ?? 'No active crop'}`
            : periodRecord
              ? `${periodRecord.crop_name} · ${periodRecord.farm_size_ha} ha · ${periodRecord.budget_level} input`
              : 'No data for this period'}
        </Text>
        <PeriodTabs active={period} onChange={setPeriod} available={available} />
      </View>

      {/* ── KPI grid ─────────────────────────────────────────────────────── */}
      <View style={styles.kpiGrid}>
        <KPITile
          label="Yield"
          value={`${fmt(yieldKg)} kg`}
          trend={yieldTrend.label}
          trendUp={yieldTrend.up}
          trendDown={yieldTrend.down}
          bars={yieldBars.map(v => v / 100)}
          barColor={Colors.green400}
          subLabel={period === 'This season' ? 'projected at harvest' : 'actual harvest'}
        />
        <KPITile
          label="Net profit"
          value={`$${fmt(netProfit)}`}
          trend={period === 'This season' ? `ROI ${roi}%` : profitTrend.label}
          trendUp={period === 'This season' ? netProfit > 0 : profitTrend.up}
          trendDown={period === 'This season' ? netProfit < 0 : profitTrend.down}
          bars={profitBars.map(v => v / 10)}
          barColor={Colors.green400}
          subLabel={`USD · ROI ${roi}%`}
        />
        <KPITile
          label="Avg soil pH"
          value={phVal ? phVal.toFixed(1) : '—'}
          trend={phVal && phVal < 5.5 ? '▼ Below optimal 6.2' : phVal ? '→ Healthy range' : 'No readings yet'}
          trendDown={!!phVal && phVal < 5.5}
          bars={phBars.map(v => v * 10)}
          barColor={Colors.amber500}
          subLabel={phSeries.length ? `${phSeries.length}-reading average` : 'awaiting sensor'}
        />
        <KPITile
          label="Season progress"
          value={`${progressPct}%`}
          trend={phaseNum ? `Phase ${phaseNum} of 6` : 'No active crop'}
          bars={[10, 17, 22, 27, progressPct].filter(v => v > 0)}
          barColor={Colors.green400}
          subLabel={calendar?.days_since_planting != null ? `Day ${calendar.days_since_planting}` : 'not planted'}
        />
      </View>

      {/* ── Progress bar (only meaningful for the live season) ───────────── */}
      {period === 'This season' && (
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Season progress</Text>
            <Text style={styles.progressVal}>{progressPct}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPct}%` as `${number}%` }]} />
          </View>
          <Text style={styles.progressSub}>
            {calendar
              ? `Phase ${phaseNum}: ${calendar.current_phase?.name ?? '—'} · ${calendar.days_to_harvest ?? '—'} days to harvest`
              : 'Set an active crop to track season progress'}
          </Text>
        </View>
      )}

      {/* ── Soil sensor history ───────────────────────────────────────────── */}
      <SectionTitle label="Soil sensor — 7-day history" />
      <Card>
        {readings.length === 0 && !sensor ? (
          <EmptyState
            icon="📡"
            title="No sensor readings yet"
            message="Enter readings manually or connect a sensor to see your soil trends."
          />
        ) : (
          <>
            <Text style={soilStyles.cardTitle}>Average daily readings</Text>
            <SoilBar
              label="Soil pH"
              value={Number(phVal.toFixed(1))}
              maxVal={14}
              color={phVal < 5.5 ? Colors.amber500 : Colors.green400}
              unit=""
              trend={phVal < 5.5 ? '▼' : '→'}
              trendColor={phVal < 5.5 ? Colors.red500 : Colors.green400}
            />
            <SoilBar
              label="Moisture"
              value={Math.round(moistureVal)}
              maxVal={100}
              color={Colors.green400}
              unit="%"
              trend="→"
              trendColor={Colors.slate400}
            />
            <SoilBar
              label="Temperature"
              value={Math.round(tempVal)}
              maxVal={40}
              color={Colors.blue500}
              unit="°"
              trend="▲"
              trendColor={Colors.amber700}
            />
          </>
        )}
      </Card>

      {/* ── Season history ────────────────────────────────────────────────── */}
      <SectionTitle label="Season history" />
      <Card style={{ paddingBottom: 8 }}>
        <View style={histStyles.header}>
          <Text style={histStyles.headerText}>Past seasons</Text>
        </View>

        {/* Current season (live) */}
        {activeCrop && (
          <SeasonRow
            key="season-current"
            cropName={`${activeCrop.crop_name} (current)`}
            variety={`${profile?.budget_level ?? 'low'} input`}
            size={`${activeCrop.farm_size_ha ?? profile?.farm_size_ha ?? '—'} ha`}
            yieldKg={curYieldKg}
            profitUsd={curNetProfit}
            isPositive={curNetProfit >= 0}
          />
        )}

        {/* Recorded past seasons (real) */}
        {history.map((h) => (
          <SeasonRow
            key={h.id}
            cropName={h.crop_name}
            variety={`${h.budget_level} input`}
            size={`${h.farm_size_ha} ha`}
            yieldKg={h.actual_yield_kg}
            profitUsd={Math.round(h.net_profit_usd)}
            isPositive={h.net_profit_usd >= 0}
          />
        ))}

        {/* Empty state when nothing recorded yet */}
        {history.length === 0 && !activeCrop && (
          <EmptyState
            icon="🌾"
            title="No seasons yet"
            message="Record your first harvest to start tracking yields and profit over time."
          />
        )}
        {history.length === 0 && activeCrop && (
          <Text style={histStyles.meta}>
            Record your harvest at the end of this season to unlock season-over-season comparisons.
          </Text>
        )}
      </Card>

      {/* ── Spending breakdown ─────────────────────────────────────────────── */}
      <SectionTitle label={period === 'This season' ? 'Input spending — this season' : `Input spending — ${period.toLowerCase()}`} />
      <Card>
        {period === 'This season' && costLines.length > 0 ? (
          <>
            {costLines
              .filter((line, idx, arr) => arr.findIndex(l => l.category === line.category) === idx)
              .map((line, i) => (
              <SpendRow
                key={`cost-${i}-${line.category}`}
                label={line.category}
                amount={line.amount_usd}
                total={totalCost}
                color={spendColors[i % spendColors.length]}
              />
            ))}
            <View style={spendStyles.total}>
              <Text style={spendStyles.totalLabel}>Total</Text>
              <Text style={spendStyles.totalVal}>${fmt(totalCost)}</Text>
            </View>
          </>
        ) : totalCost > 0 ? (
          // Past season: we only store the total, not a category breakdown
          <View style={spendStyles.total}>
            <Text style={spendStyles.totalLabel}>Total input cost</Text>
            <Text style={spendStyles.totalVal}>${fmt(totalCost)}</Text>
          </View>
        ) : (
          <EmptyState
            icon="🧾"
            title="No cost data"
            message={period === 'This season'
              ? 'Run a profit plan to see your input cost breakdown.'
              : 'No recorded costs for this season.'}
          />
        )}
      </Card>
    </ScrollView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  hero: {
    backgroundColor: Colors.green700,
    paddingHorizontal: Spacing[4],
    paddingTop: 16,
    paddingBottom: 20,
  },
  heroLabel: {
    fontSize: 11, fontWeight: '700', letterSpacing: 0.06,
    textTransform: 'uppercase', color: Colors.green200, marginBottom: 2,
  },
  heroTitle:  { fontSize: 24, fontWeight: '800', color: Colors.white },
  heroSub:    { fontSize: 12, color: Colors.green200, marginTop: 3 },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: Spacing[4],
    paddingTop: 14,
  },
  progressCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing[4],
    marginBottom: 12,
    padding: Spacing[4],
    ...Shadows.sm,
  },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressTitle:  { fontSize: 13, fontWeight: '700', color: Colors.slate900 },
  progressVal:    { fontSize: 16, fontWeight: '700', color: Colors.green600,  },
  progressTrack:  { height: 8, backgroundColor: Colors.slate100, borderRadius: 4, overflow: 'hidden' },
  progressFill:   {
    height: '100%', borderRadius: 4,
    backgroundColor: Colors.green400,
  },
  progressSub: { fontSize: 11, color: Colors.slate400, marginTop: 6 },
});

const ptStyles = StyleSheet.create({
  row:  { flexDirection: 'row', gap: 6, marginTop: 12 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  chipActive:     { backgroundColor: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.4)' },
  chipText:       { fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: '500' },
  chipTextActive: { color: Colors.white, fontWeight: '700' },
});

const kpiStyles = StyleSheet.create({
  tile: {
    width: '47%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: 13,
    ...Shadows.sm,
  },
  label:    { fontSize: 10, color: Colors.slate400, fontWeight: '600', letterSpacing: 0.04, textTransform: 'uppercase' },
  value:    { fontSize: 22, fontWeight: '700', color: Colors.slate900, marginTop: 4,  },
  trend:    { fontSize: 11, fontWeight: '500', marginTop: 3 },
  subLabel: { fontSize: 10, color: Colors.slate400, marginTop: 4 },
});

const chartStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 40, marginTop: 8 },
  bar: { flex: 1, borderRadius: 2, minHeight: 4 },
});

const soilStyles = StyleSheet.create({
  cardTitle: { fontSize: 13, fontWeight: '700', color: Colors.slate900, marginBottom: 10 },
  row:  { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  label: { fontSize: 11, color: Colors.slate400, width: 72 },
  track: { flex: 1, height: 7, backgroundColor: Colors.slate100, borderRadius: 4, overflow: 'hidden' },
  fill:  { height: '100%', borderRadius: 4 },
  val:   { fontSize: 12, fontWeight: '600', color: Colors.slate700, width: 42, textAlign: 'right',  },
  trend: { fontSize: 11, width: 18, textAlign: 'center', fontWeight: '700' },
});

const histStyles = StyleSheet.create({
  header: { borderBottomWidth: 1, borderBottomColor: Colors.slate050, paddingBottom: 8, marginBottom: 4 },
  headerText: { fontSize: 13, fontWeight: '700', color: Colors.slate900 },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1, borderBottomColor: Colors.slate050,
  },
  cropName: { fontSize: 13, fontWeight: '600', color: Colors.slate900 },
  meta:     { fontSize: 11, color: Colors.slate400, marginTop: 1 },
  yield:    { fontSize: 15, fontWeight: '700', color: Colors.green600,  },
  profit:   { fontSize: 11, fontWeight: '600', marginTop: 1 },
});

const spendStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 9 },
  dot:   { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  label: { fontSize: 12, color: Colors.slate700, flex: 1 },
  track: { width: 80, height: 5, backgroundColor: Colors.slate100, borderRadius: 3, overflow: 'hidden', flexShrink: 0 },
  fill:  { height: '100%', borderRadius: 3 },
  val:   { fontSize: 12, fontWeight: '600', color: Colors.slate900, width: 38, textAlign: 'right',  },
  total: { borderTopWidth: 1.5, borderTopColor: Colors.slate100, marginTop: 8, paddingTop: 8, flexDirection: 'row', justifyContent: 'space-between' },
  totalLabel: { fontSize: 13, fontWeight: '700', color: Colors.slate900 },
  totalVal:   { fontSize: 16, fontWeight: '700', color: Colors.slate900,  },
});

// Extend Colors with purple for spend chart