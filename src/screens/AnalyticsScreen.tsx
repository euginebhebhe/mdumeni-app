// src/screens/AnalyticsScreen.tsx
// Farm performance tracking — 6 KPI tiles, soil history bars,
// season comparison table, spending breakdown

import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
} from 'react-native';
import { Card, SectionTitle, Badge, EmptyState } from '@/components/ui';
import { useAppStore } from '@/store';
import { Colors, Spacing, BorderRadius, Shadows, Typography } from '@/constants/theme';

// ── Period selector ────────────────────────────────────────────────────────────
const PERIODS = ['This season', 'Last season', '2 seasons'] as const;
type Period = typeof PERIODS[number];

function PeriodTabs({ active, onChange }: { active: Period; onChange: (p: Period) => void }) {
  return (
    <View style={ptStyles.row}>
      {PERIODS.map((p) => (
        <TouchableOpacity
          key={p}
          onPress={() => onChange(p)}
          style={[ptStyles.chip, active === p && ptStyles.chipActive]}
          activeOpacity={0.7}
        >
          <Text style={[ptStyles.chipText, active === p && ptStyles.chipTextActive]}>
            {p}
          </Text>
        </TouchableOpacity>
      ))}
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
export function AnalyticsScreen() {
  const [period, setPeriod] = useState<Period>('This season');
  const session     = useAppStore((s) => s.session);
  const activeCrop  = useAppStore((s) => s.activeCrop);
  const sensor      = useAppStore((s) => s.sensorReading);
  const profile     = useAppStore((s) => s.profile);

  const plan     = session?.crop_plan;
  const calendar = session?.daily_calendar;

  // Derived values from plan or defaults
  const yieldKg       = plan?.expected_yield_kg    ?? 6000;
  const netProfit     = plan?.net_profit_usd        ?? 254;
  const totalCost     = plan?.total_cost_usd        ?? 757;
  const roi           = plan?.roi_pct               ?? 32;
  const phVal         = sensor?.soil_ph             ?? 5.1;
  const moistureVal   = sensor?.moisture_pct        ?? 62;
  const tempVal       = sensor?.temp_c              ?? 24;
  const progressPct   = calendar?.progress_pct      ?? 29;
  const phaseNum      = calendar?.current_phase.number ?? 3;

  const costLines = plan?.cost_lines ?? [
    { category: 'Fertiliser',  amount_usd: 312, description: '' },
    { category: 'Labour',      amount_usd: 216, description: '' },
    { category: 'Seed',        amount_usd: 86,  description: '' },
    { category: 'Chemicals',   amount_usd: 86,  description: '' },
    { category: 'Contingency', amount_usd: 57,  description: '' },
  ];

  const spendColors = [
    Colors.amber500, Colors.blue500, Colors.green400,
    Colors.red500, "#4A3585",
  ];

  return (
    <ScrollView
      style={styles.screen}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <View style={styles.hero}>
        <Text style={styles.heroLabel}>FARM PERFORMANCE</Text>
        <Text style={styles.heroTitle}>Analytics</Text>
        <Text style={styles.heroSub}>
          Season overview · {profile?.farm_size_ha ?? 2.4} ha · {activeCrop?.crop_name ?? 'No active crop'}
        </Text>
        <PeriodTabs active={period} onChange={setPeriod} />
      </View>

      {/* ── KPI grid ─────────────────────────────────────────────────────── */}
      <View style={styles.kpiGrid}>
        <KPITile
          label="Yield forecast"
          value={`${yieldKg.toLocaleString()} kg`}
          trend="▲ +18% vs last season"
          trendUp
          bars={[3800, 4200, 3900, 4800, 5500, yieldKg / 100]}
          barColor={Colors.green400}
          subLabel="projected at harvest"
        />
        <KPITile
          label="Net profit est."
          value={`$${netProfit}`}
          trend={`ROI ${roi}%`}
          trendUp
          bars={[90, 130, 110, 180, 220, netProfit / 10]}
          barColor={Colors.green400}
          subLabel="USD projected"
        />
        <KPITile
          label="Avg soil pH"
          value={phVal.toFixed(1)}
          trend="▼ Below optimal 6.2"
          trendDown
          bars={[6.4, 6.2, 5.9, 5.6, 5.3, phVal * 10]}
          barColor={Colors.amber500}
          subLabel="7-day average"
        />
        <KPITile
          label="Season progress"
          value={`${progressPct}%`}
          trend={`Phase ${phaseNum} of 6`}
          bars={[10, 17, 22, 27, progressPct]}
          barColor={Colors.green400}
          subLabel={`Day ${calendar?.days_since_planting ?? 35} of 120`}
        />
      </View>

      {/* ── Progress bar ─────────────────────────────────────────────────── */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Season progress</Text>
          <Text style={styles.progressVal}>{progressPct}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPct}%` as `${number}%` }]} />
        </View>
        <Text style={styles.progressSub}>
          Phase {phaseNum}: {calendar?.current_phase.name ?? 'Vegetative growth'} · {calendar?.days_to_harvest ?? 85} days to harvest
        </Text>
      </View>

      {/* ── Soil sensor history ───────────────────────────────────────────── */}
      <SectionTitle label="Soil sensor — 7-day history" />
      <Card>
        <Text style={soilStyles.cardTitle}>Average daily readings</Text>
        <SoilBar
          label="Soil pH"
          value={phVal}
          maxVal={14}
          color={phVal < 5.5 ? Colors.amber500 : Colors.green400}
          unit=""
          trend={phVal < 5.5 ? '▼' : '→'}
          trendColor={phVal < 5.5 ? Colors.red500 : Colors.green400}
        />
        <SoilBar
          label="Moisture"
          value={moistureVal}
          maxVal={100}
          color={Colors.green400}
          unit="%"
          trend="→"
          trendColor={Colors.slate400}
        />
        <SoilBar
          label="Temperature"
          value={tempVal}
          maxVal={40}
          color={Colors.blue500}
          unit="°"
          trend="▲"
          trendColor={Colors.amber700}
        />
      </Card>

      {/* ── Season history ────────────────────────────────────────────────── */}
      <SectionTitle label="Season history" />
      <Card style={{ paddingBottom: 8 }}>
        <View style={histStyles.header}>
          <Text style={histStyles.headerText}>Past seasons</Text>
        </View>
        <SeasonRow
          cropName={activeCrop?.crop_name ?? 'Maize'}
          variety="ZM521 · Low input"
          size={`${activeCrop?.farm_size_ha ?? 2.4} ha`}
          yieldKg={yieldKg}
          profitUsd={netProfit}
          isPositive={netProfit >= 0}
        />
        <SeasonRow
          cropName="Maize 2024/25"
          variety="ZM521 · Low input"
          size="2.4 ha"
          yieldKg={5080}
          profitUsd={198}
          isPositive
        />
        <SeasonRow
          cropName="Groundnuts 2024"
          variety="Falcon · Low input"
          size="2.4 ha"
          yieldKg={4320}
          profitUsd={312}
          isPositive
        />
        <SeasonRow
          cropName="Maize 2023/24"
          variety="ZM521 · Low input"
          size="2.4 ha"
          yieldKg={3240}
          profitUsd={87}
          isPositive
        />
      </Card>

      {/* ── Spending breakdown ─────────────────────────────────────────────── */}
      <SectionTitle label="Input spending — this season" />
      <Card>
        {costLines.map((line, i) => (
          <SpendRow
            key={line.category}
            label={line.category}
            amount={line.amount_usd}
            total={totalCost}
            color={spendColors[i % spendColors.length]}
          />
        ))}
        <View style={spendStyles.total}>
          <Text style={spendStyles.totalLabel}>Total</Text>
          <Text style={spendStyles.totalVal}>${totalCost}</Text>
        </View>
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
