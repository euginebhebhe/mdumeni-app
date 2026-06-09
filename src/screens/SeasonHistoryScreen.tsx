// src/screens/SeasonHistoryScreen.tsx
// Shows all completed seasons — crop, yield predicted vs actual, profit
// Data comes from Supabase season_history table
// Accessible from Analytics screen and Settings

import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { useAppStore } from '@/store';
import { getSeasonHistory } from '@/services/api';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

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

function AccuracyBadge({ predicted, actual }: { predicted: number; actual: number }) {
  if (!predicted || !actual) return null;
  const pct = ((actual / predicted - 1) * 100);
  const color = pct >= -10 ? Colors.green600 : pct >= -25 ? Colors.amber700 : Colors.red500;
  const label = pct >= 0 ? `+${pct.toFixed(0)}%` : `${pct.toFixed(0)}%`;
  return (
    <View style={[accStyles.badge, { borderColor: color }]}>
      <Text style={[accStyles.text, { color }]}>{label} vs AI</Text>
    </View>
  );
}

function SeasonCard({ record, onRecordYield }: { record: SeasonRecord; onRecordYield?: () => void }) {
  const hasYield   = record.actual_yield_kg > 0;
  const profit     = record.net_profit_usd;
  const profitColor = profit >= 0 ? Colors.green600 : Colors.red500;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const formatDate = (iso: string | null) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <View style={cardStyles.card}>
      <View style={cardStyles.header}>
        <View style={cardStyles.cropIcon}>
          <Text style={{ fontSize: 22 }}>🌾</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={cardStyles.cropName}>{record.crop_name}</Text>
          <Text style={cardStyles.meta}>
            {formatDate(record.planting_date)} → {record.harvest_date ? formatDate(record.harvest_date) : 'Growing'} ·
            {' '}{record.farm_size_ha} ha · {record.budget_level} input
          </Text>
        </View>
        {hasYield && <AccuracyBadge predicted={record.predicted_yield_kg} actual={record.actual_yield_kg} />}
      </View>

      <View style={cardStyles.statsRow}>
        <View style={cardStyles.stat}>
          <Text style={cardStyles.statLabel}>AI predicted</Text>
          <Text style={cardStyles.statVal}>
            {record.predicted_yield_kg > 0 ? `${record.predicted_yield_kg.toLocaleString()} kg` : '—'}
          </Text>
        </View>
        <View style={[cardStyles.stat, { borderLeftWidth: 1, borderLeftColor: Colors.slate100 }]}>
          <Text style={cardStyles.statLabel}>Actual yield</Text>
          <Text style={[cardStyles.statVal, hasYield && { color: Colors.green600 }]}>
            {hasYield ? `${record.actual_yield_kg.toLocaleString()} kg` : '—'}
          </Text>
        </View>
        <View style={[cardStyles.stat, { borderLeftWidth: 1, borderLeftColor: Colors.slate100 }]}>
          <Text style={cardStyles.statLabel}>Net profit</Text>
          <Text style={[cardStyles.statVal, { color: hasYield ? profitColor : Colors.slate300 }]}>
            {hasYield ? `$${profit.toFixed(0)}` : '—'}
          </Text>
        </View>
      </View>

      {record.notes ? (
        <Text style={cardStyles.notes}>{record.notes}</Text>
      ) : null}

      {!hasYield && onRecordYield && (
        <TouchableOpacity style={cardStyles.recordBtn} onPress={onRecordYield} activeOpacity={0.8}>
          <Text style={cardStyles.recordBtnText}>+ Record actual yield</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

interface Props { onRecordYield?: () => void; }

export function SeasonHistoryScreen({ onRecordYield }: Props) {
  const authToken = useAppStore((s) => s.authToken);
  const [records,    setRecords]    = useState<SeasonRecord[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    try {
      if (authToken) {
        const data = await getSeasonHistory(authToken);
        setRecords(data ?? []);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, [authToken]);

  // Aggregate stats
  const withYield  = records.filter(r => r.actual_yield_kg > 0);
  const totalProfit = withYield.reduce((s, r) => s + r.net_profit_usd, 0);
  const avgAccuracy = withYield.length > 0 && withYield.every(r => r.predicted_yield_kg > 0)
    ? withYield.reduce((s, r) => s + (r.actual_yield_kg / r.predicted_yield_kg), 0) / withYield.length * 100
    : null;

  return (
    <View style={styles.screen}>

      <View style={styles.header}>
        <Text style={styles.title}>Season history</Text>
        <Text style={styles.sub}>
          {records.length} season{records.length !== 1 ? 's' : ''} recorded
        </Text>
      </View>

      {/* Summary row */}
      {withYield.length > 0 && (
        <View style={styles.summaryRow}>
          <View style={styles.summaryTile}>
            <Text style={styles.summaryVal}>{withYield.length}</Text>
            <Text style={styles.summaryLabel}>Seasons completed</Text>
          </View>
          <View style={styles.summaryTile}>
            <Text style={[styles.summaryVal, { color: totalProfit >= 0 ? Colors.green600 : Colors.red500 }]}>
              ${totalProfit.toFixed(0)}
            </Text>
            <Text style={styles.summaryLabel}>Total profit</Text>
          </View>
          {avgAccuracy !== null && (
            <View style={styles.summaryTile}>
              <Text style={styles.summaryVal}>{avgAccuracy.toFixed(0)}%</Text>
              <Text style={styles.summaryLabel}>AI accuracy</Text>
            </View>
          )}
        </View>
      )}

      {loading ? (
        <View style={styles.centred}>
          <ActivityIndicator size="large" color={Colors.green600} />
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      ) : records.length === 0 ? (
        <View style={styles.centred}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyTitle}>No seasons recorded yet</Text>
          <Text style={styles.emptySub}>
            When you record your harvest yield, it will appear here. After each harvest, go to Settings → Record harvest yield.
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => load(true)}
              colors={[Colors.green600]} tintColor={Colors.green600} />
          }
        >
          {records.map((r) => (
            <SeasonCard
              key={r.id}
              record={r}
              onRecordYield={!r.actual_yield_kg ? onRecordYield : undefined}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen:  { flex: 1, backgroundColor: Colors.background },
  header:  { backgroundColor: Colors.green600, padding: Spacing[4], paddingTop: 16, paddingBottom: 18 },
  title:   { fontSize: 22, fontWeight: '800', color: Colors.white, letterSpacing: -0.3 },
  sub:     { fontSize: 12, color: Colors.green200, marginTop: 3 },
  summaryRow: { flexDirection: 'row', margin: Spacing[4], marginBottom: 8, gap: 8 },
  summaryTile: {
    flex: 1, backgroundColor: Colors.white, borderRadius: BorderRadius.md,
    padding: 12, alignItems: 'center', ...Shadows.sm,
  },
  summaryVal:   { fontSize: 20, fontWeight: '700', color: Colors.slate900 },
  summaryLabel: { fontSize: 10, color: Colors.slate400, marginTop: 3, textAlign: 'center' },
  centred:      { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing[6] },
  loadingText:  { fontSize: 14, color: Colors.slate400, marginTop: 12 },
  emptyIcon:    { fontSize: 48, marginBottom: 16 },
  emptyTitle:   { fontSize: 18, fontWeight: '700', color: Colors.slate900, marginBottom: 8, textAlign: 'center' },
  emptySub:     { fontSize: 13, color: Colors.slate400, textAlign: 'center', lineHeight: 20 },
  listContent:  { padding: Spacing[4], gap: 10, paddingBottom: 24 },
});

const cardStyles = StyleSheet.create({
  card:      { backgroundColor: Colors.white, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.slate100, overflow: 'hidden', ...Shadows.sm },
  header:    { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 },
  cropIcon:  { width: 40, height: 40, backgroundColor: Colors.green050, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cropName:  { fontSize: 15, fontWeight: '700', color: Colors.slate900 },
  meta:      { fontSize: 11, color: Colors.slate400, marginTop: 2, lineHeight: 15 },
  statsRow:  { flexDirection: 'row', borderTopWidth: 1, borderTopColor: Colors.slate050 },
  stat:      { flex: 1, padding: 12, alignItems: 'center' },
  statLabel: { fontSize: 10, color: Colors.slate400, textTransform: 'uppercase', letterSpacing: 0.04 },
  statVal:   { fontSize: 16, fontWeight: '700', color: Colors.slate900, marginTop: 3 },
  notes:     { paddingHorizontal: 14, paddingBottom: 12, fontSize: 12, color: Colors.blue500, lineHeight: 17 },
  recordBtn: { margin: 12, marginTop: 4, backgroundColor: Colors.green050, borderRadius: BorderRadius.sm, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: Colors.green200 },
  recordBtnText: { fontSize: 13, fontWeight: '600', color: Colors.green600 },
});

const accStyles = StyleSheet.create({
  badge: { borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  text:  { fontSize: 11, fontWeight: '700' },
});
