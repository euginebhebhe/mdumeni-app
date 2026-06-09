// src/screens/MyFarmScreen.tsx
// My Farm — current season tracker, today's task, season history
// Replaces the old Analytics tab with meaningful farm-specific data

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, Modal, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/store';
import { useSession } from '@/hooks/useSession';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { CropSelectorScreen } from '@/screens/CropSelectorScreen';
import { YieldRecordScreen }  from '@/screens/YieldRecordScreen';
import { SeasonHistoryScreen } from '@/screens/SeasonHistoryScreen';

const BASE_URL = 'https://mdumeni-api.onrender.com';

async function fetchWithTimeout(url: string, options: RequestInit = {}, ms = 20_000): Promise<Response> {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(url, { ...options, signal: ctrl.signal }); }
  finally { clearTimeout(id); }
}const TASK_TITLES: Record<string, string> = {
  pest_check:       'Scout for pests',
  fertiliser:       'Apply fertiliser',
  irrigation:       'Irrigation check',
  weed_control:     'Weed control',
  soil_check:       'Soil check',
  harvest_prep:     'Prepare for harvest',
  planting:         'Planting',
  land_preparation: 'Land preparation',
  topdress:         'Topdress fertiliser',
};

function ProgressBar({ pct }: { pct: number }) {
  return (
    <View style={pb.track}>
      <View style={[pb.fill, { width: `${Math.min(pct, 100)}%` }]} />
    </View>
  );
}

export function MyFarmScreen() {
  const insets     = useSafeAreaInsets();
  const activeCrop = useAppStore((s) => s.activeCrop);
  const profile    = useAppStore((s) => s.profile);
  const session    = useAppStore((s) => s.session);
  const authToken  = useAppStore((s) => s.authToken);
  const isOnline   = useAppStore((s) => s.isOnline);
  const { refresh, Loading } = useSession();

  const [showCropSelector, setShowCropSelector]   = useState(false);
  const [showYieldRecord,  setShowYieldRecord]     = useState(false);
  const [showHistory,      setShowHistory]         = useState(false);
  const [sellPrice,        setSellPrice]           = useState<number | null>(null);

  const calendar  = session?.daily_calendar;
  const todayTask = calendar?.tasks_today?.[0] ?? null;
  const phase     = calendar?.current_phase;
  const plan      = session?.crop_plan;

  // Load current sell price for active crop
  useEffect(() => {
    if (!activeCrop || !isOnline) return;
    fetchWithTimeout(`${BASE_URL}/market/prices/crops/best`)
      .then(r => r.json())
      .then(data => {
        const match = (data.prices ?? []).find((p: any) => p.crop_id === activeCrop.crop_id);
        if (match) setSellPrice(match.price_usd_kg);
      })
      .catch(() => {});
  }, [activeCrop, isOnline]);

  const onRefresh = useCallback(() => refresh(), [refresh]);

  const daysSince = activeCrop
    ? Math.max(0, Math.floor((Date.now() - new Date(activeCrop.planting_date).getTime()) / 86400000))
    : null;

  const totalDays: number = (calendar as any)?.total_days ?? (calendar as any)?.totalDays ?? 120;
  const progressPct  = daysSince ? Math.min((daysSince / totalDays) * 100, 100) : 0;
  const daysToHarvest = calendar?.days_to_harvest ?? null;

  const estimatedYieldKg  = plan?.expected_yield_kg ?? (activeCrop ? activeCrop.farm_size_ha * 2500 : null);
  const estimatedRevenue  = estimatedYieldKg && sellPrice ? (estimatedYieldKg * sellPrice) : null;
  const estimatedProfit   = estimatedRevenue && plan?.total_cost_usd
    ? estimatedRevenue - plan.total_cost_usd : null;

  return (
    <View style={[s.screen, { paddingTop: insets.top }]}>

      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.headerLabel}>Your farm</Text>
          <Text style={s.headerTitle}>My Farm</Text>
          <Text style={s.headerSub}>
            {profile?.farm_size_ha ?? '—'} ha · Region {profile?.agro_region ?? '—'} ·
            {' '}{profile?.district ?? 'Zimbabwe'}
          </Text>
        </View>
      </View>

      <ScrollView style={s.body} showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: Spacing[4], gap: 12, paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={Loading} onRefresh={onRefresh}
            colors={[Colors.green600]} tintColor={Colors.green600} />
        }>

        {/* Current season card */}
        {activeCrop ? (
          <View style={s.card}>
            <View style={s.cardHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.secLabel}>Current season</Text>
                <Text style={s.cropName}>{activeCrop.crop_name}</Text>
                <Text style={s.cropMeta}>
                  Planted {new Date(activeCrop.planting_date).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })} · Day {daysSince} of {totalDays}
                </Text>
              </View>
              <View style={s.phaseTag}>
                <Text style={s.phaseTagText}>
                  {phase ? `Phase ${phase.number}` : 'Growing'}
                </Text>
              </View>
            </View>

            <ProgressBar pct={progressPct} />
            <View style={s.progressLabels}>
              <Text style={s.progressLabel}>Planted</Text>
              <Text style={s.progressPct}>{progressPct.toFixed(0)}% complete</Text>
              <Text style={s.progressLabel}>
                {daysToHarvest ? `${daysToHarvest} days to harvest` : 'Harvest'}
              </Text>
            </View>

            {phase && (
              <View style={s.phaseRow}>
                <Text style={s.phaseLabel}>📍 {phase.name}</Text>
              </View>
            )}

            {/* Financial summary with live price */}
            <View style={s.metricsGrid}>
              <View style={s.metricTile}>
                <Text style={s.metricLabel}>Est. yield</Text>
                <Text style={s.metricVal}>
                  {estimatedYieldKg ? `${(estimatedYieldKg/1000).toFixed(1)} t` : '—'}
                </Text>
                <Text style={s.metricSub}>{activeCrop.farm_size_ha} ha</Text>
              </View>
              <View style={s.metricTile}>
                <Text style={s.metricLabel}>Sell price</Text>
                <Text style={s.metricVal}>
                  {sellPrice ? `$${sellPrice.toFixed(3)}/kg` : '—'}
                </Text>
                <Text style={s.metricSub}>Today · Live</Text>
              </View>
              <View style={s.metricTile}>
                <Text style={s.metricLabel}>Est. revenue</Text>
                <Text style={s.metricVal}>
                  {estimatedRevenue ? `$${estimatedRevenue.toFixed(0)}` : '—'}
                </Text>
                <Text style={s.metricSub}>At current price</Text>
              </View>
              <View style={s.metricTile}>
                <Text style={s.metricLabel}>Est. profit</Text>
                <Text style={[s.metricVal, estimatedProfit && estimatedProfit > 0
                  ? { color: '#1A5C2A' } : {}]}>
                  {estimatedProfit ? `$${estimatedProfit.toFixed(0)}` : '—'}
                </Text>
                <Text style={s.metricSub}>After costs</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={s.noCropCard}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>🌱</Text>
            <Text style={s.noCropTitle}>No active crop</Text>
            <Text style={s.noCropSub}>
              Set your current crop to track your season, get daily tasks, and see live profit estimates.
            </Text>
            <TouchableOpacity style={s.setCropBtn} onPress={() => setShowCropSelector(true)}>
              <Text style={s.setCropBtnText}>Set active crop →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Today's task */}
        {todayTask && (
          <View style={s.card}>
            <Text style={s.secLabel}>Today&apos;s task</Text>
            <View style={s.taskRow}>
              <View style={s.taskIcon}>
                <Text style={{ fontSize: 18 }}>
                  {todayTask.type?.includes('pest') ? '🐛' :
                   todayTask.type?.includes('fertiliser') || todayTask.type?.includes('topdress') ? '🌿' :
                   todayTask.type?.includes('irrig') ? '💧' :
                   todayTask.type?.includes('weed') ? '✂️' : '📋'}
                </Text>
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={s.taskTitle}>
                  {TASK_TITLES[todayTask.type] ?? todayTask.type?.replace(/_/g, ' ')}
                </Text>
                <Text style={s.taskDesc}>{todayTask.message ?? todayTask.description}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Quick actions */}
        <View style={s.actionsRow}>
          <TouchableOpacity style={s.actionBtn} onPress={() => setShowCropSelector(true)} activeOpacity={0.8}>
            <Text style={s.actionIcon}>🌾</Text>
            <Text style={s.actionLabel}>Change crop</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.actionBtn} onPress={() => setShowYieldRecord(true)} activeOpacity={0.8}>
            <Text style={s.actionIcon}>⚖️</Text>
            <Text style={s.actionLabel}>Record yield</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.actionBtn} onPress={() => setShowHistory(true)} activeOpacity={0.8}>
            <Text style={s.actionIcon}>📊</Text>
            <Text style={s.actionLabel}>History</Text>
          </TouchableOpacity>
        </View>

        {/* Farm profile */}
        <View style={s.card}>
          <Text style={s.secLabel}>Farm profile</Text>
          {[
            ['Province',      profile?.province      ?? '—'],
            ['District',      profile?.district      ?? '—'],
            ['Farm size',     profile ? `${profile.farm_size_ha} ha` : '—'],
            ['Agro-region',   profile ? `Region ${profile.agro_region}` : '—'],
            ['Irrigation',    profile?.has_irrigation ? 'Available' : 'Rain-fed only'],
            ['Budget level',  profile ? `${profile.budget_level.charAt(0).toUpperCase() + profile.budget_level.slice(1)} input` : '—'],
          ].map(([label, val]) => (
            <View key={label} style={s.profileRow}>
              <Text style={s.profileLabel}>{label}</Text>
              <Text style={s.profileVal}>{val}</Text>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* Modals */}
      <Modal visible={showCropSelector} animationType="slide" presentationStyle="pageSheet"
        onRequestClose={() => setShowCropSelector(false)}>
        <View style={{ flex: 1, paddingTop: 20 }}>
          <View style={s.modalClose}>
            <TouchableOpacity onPress={() => setShowCropSelector(false)} style={{ padding: 8 }}>
              <Text style={s.modalCloseText}>✕ Close</Text>
            </TouchableOpacity>
          </View>
          <CropSelectorScreen onDone={() => { setShowCropSelector(false); refresh(); }} />
        </View>
      </Modal>

      <Modal visible={showYieldRecord} animationType="slide" presentationStyle="pageSheet"
        onRequestClose={() => setShowYieldRecord(false)}>
        <View style={{ flex: 1, paddingTop: 20 }}>
          <View style={s.modalClose}>
            <TouchableOpacity onPress={() => setShowYieldRecord(false)} style={{ padding: 8 }}>
              <Text style={s.modalCloseText}>✕ Close</Text>
            </TouchableOpacity>
          </View>
          <YieldRecordScreen onDone={() => setShowYieldRecord(false)} />
        </View>
      </Modal>

      <Modal visible={showHistory} animationType="slide" presentationStyle="pageSheet"
        onRequestClose={() => setShowHistory(false)}>
        <View style={{ flex: 1, paddingTop: 20 }}>
          <View style={s.modalClose}>
            <TouchableOpacity onPress={() => setShowHistory(false)} style={{ padding: 8 }}>
              <Text style={s.modalCloseText}>✕ Close</Text>
            </TouchableOpacity>
          </View>
          <SeasonHistoryScreen
            onRecordYield={() => { setShowHistory(false); setShowYieldRecord(true); }} />
        </View>
      </Modal>

    </View>
  );
}

const pb = StyleSheet.create({
  track: { height: 6, backgroundColor: Colors.slate100, borderRadius: 3, overflow: 'hidden', marginVertical: 8 },
  fill:  { height: '100%', backgroundColor: '#1A5C2A', borderRadius: 3 },
});

const s = StyleSheet.create({
  screen:     { flex: 1, backgroundColor: Colors.background },
  header:     { backgroundColor: '#1A5C2A', padding: Spacing[4], paddingTop: 12, paddingBottom: 18 },
  headerLabel:{ fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 0.05 },
  headerTitle:{ fontSize: 24, fontWeight: '700', color: '#fff', marginTop: 2 },
  headerSub:  { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  body:       { flex: 1 },
  card:       { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, borderWidth: 0.5, borderColor: Colors.slate100, padding: 16, ...Shadows.sm },
  secLabel:   { fontSize: 10, fontWeight: '700', color: Colors.slate400, textTransform: 'uppercase', letterSpacing: 0.06, marginBottom: 8 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  cropName:   { fontSize: 20, fontWeight: '700', color: Colors.slate900 },
  cropMeta:   { fontSize: 12, color: Colors.slate400, marginTop: 3 },
  phaseTag:   { backgroundColor: '#EAF3DE', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  phaseTagText:{ fontSize: 12, fontWeight: '700', color: '#27500A' },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
  progressLabel:  { fontSize: 10, color: Colors.slate400 },
  progressPct:    { fontSize: 11, fontWeight: '600', color: '#1A5C2A' },
  phaseRow:   { backgroundColor: Colors.slate050, borderRadius: 8, padding: 10, marginTop: 10 },
  phaseLabel: { fontSize: 13, color: Colors.slate700, fontWeight: '500' },
  metricsGrid:{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  metricTile: { flex: 1, minWidth: '45%', backgroundColor: Colors.slate050, borderRadius: BorderRadius.md, padding: 10 },
  metricLabel:{ fontSize: 10, color: Colors.slate400, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.04 },
  metricVal:  { fontSize: 17, fontWeight: '700', color: Colors.slate900, marginTop: 3 },
  metricSub:  { fontSize: 11, color: Colors.slate400, marginTop: 2 },
  noCropCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, borderWidth: 0.5, borderColor: Colors.slate100, padding: 32, alignItems: 'center', ...Shadows.sm },
  noCropTitle:{ fontSize: 18, fontWeight: '700', color: Colors.slate900, marginBottom: 8 },
  noCropSub:  { fontSize: 13, color: Colors.slate400, textAlign: 'center', lineHeight: 19, marginBottom: 16 },
  setCropBtn: { backgroundColor: '#1A5C2A', borderRadius: BorderRadius.md, paddingHorizontal: 24, paddingVertical: 12 },
  setCropBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  taskRow:    { flexDirection: 'row', alignItems: 'flex-start' },
  taskIcon:   { width: 38, height: 38, backgroundColor: '#FAEEDA', borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  taskTitle:  { fontSize: 14, fontWeight: '600', color: Colors.slate900 },
  taskDesc:   { fontSize: 12, color: Colors.slate600, marginTop: 4, lineHeight: 18 },
  actionsRow: { flexDirection: 'row', gap: 8 },
  actionBtn:  { flex: 1, backgroundColor: Colors.white, borderRadius: BorderRadius.md, borderWidth: 0.5, borderColor: Colors.slate100, padding: 14, alignItems: 'center', gap: 6, ...Shadows.sm },
  actionIcon: { fontSize: 22 },
  actionLabel:{ fontSize: 11, fontWeight: '600', color: Colors.slate700 },
  profileRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9, borderBottomWidth: 0.5, borderBottomColor: Colors.slate050 },
  profileLabel:{ fontSize: 13, color: Colors.slate400 },
  profileVal: { fontSize: 13, fontWeight: '600', color: Colors.slate900 },
  modalClose: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, marginBottom: 8 },
  modalCloseText: { fontSize: 16, color: Colors.slate400 },
});