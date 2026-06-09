// src/screens/PlanScreen.tsx
// The profit calculator — hero feature of the new MDUMENI
// Pulls today live prices, calculates full cost breakdown and profit

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSQLiteContext } from 'expo-sqlite';
import { getProfitCalc } from '@/services/priceCache';
import { useAppStore } from '@/store';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

const BASE_URL = 'https://mdumeni-api.onrender.com';

async function fetchWithTimeout(url: string, options: RequestInit = {}, ms = 20_000): Promise<Response> {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(url, { ...options, signal: ctrl.signal }); }
  finally { clearTimeout(id); }
}

const CROPS = [
  { id: 'CROP_002', name: 'Sugar beans', icon: '🫘' },
  { id: 'CROP_001', name: 'Maize',        icon: '🌽' },
  { id: 'CROP_003', name: 'Groundnuts',   icon: '🥜' },
  { id: 'CROP_006', name: 'Sorghum',      icon: '🌾' },
  { id: 'CROP_009', name: 'Soybeans',     icon: '🌱' },
  { id: 'CROP_019', name: 'Tomatoes',     icon: '🍅' },
  { id: 'CROP_010', name: 'Sunflower',    icon: '🌻' },
  { id: 'CROP_020', name: 'Onions',       icon: '🧅' },
];

const BUDGETS = [
  { key: 'low',    label: 'Low',    desc: 'OPV seeds · Basic fertiliser · Under $300/ha' },
  { key: 'medium', label: 'Medium', desc: 'Hybrid seeds · Full fertiliser · $300–600/ha' },
  { key: 'high',   label: 'High',   desc: 'Premium hybrid · Full programme · $600+/ha' },
];

async function calcProfit(body: object) {
  const res = await fetchWithTimeout(`${BASE_URL}/market/profit/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function LineItem({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={p.lineRow}>
      <Text style={p.lineLabel}>{label}</Text>
      <Text style={[p.lineVal, color ? { color } : {}]}>{value}</Text>
    </View>
  );
}

export function PlanScreen() {
  const insets   = useSafeAreaInsets();
  const profile  = useAppStore((s) => s.profile);
  const isOnline = useAppStore((s) => s.isOnline);

  const db = useSQLiteContext();
  const [cropId,  setCropId]  = useState('CROP_002');
  const [budget,  setBudget]  = useState('low');
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<any>(null);
  const [error,   setError]   = useState<string | null>(null);
  const [cacheAge, setCacheAge] = useState<string | null>(null);

  const selectedCrop = CROPS.find(c => c.id === cropId) ?? CROPS[0];
  const farmSize     = profile?.farm_size_ha ?? 2.4;
  const region       = profile?.agro_region  ?? 2;

  const calculate = useCallback(async () => {
    setLoading(true);
    setError(null);
    const body = {
      crop_id:        cropId,
      crop_name:      selectedCrop.name,
      farm_size_ha:   farmSize,
      budget_level:   budget,
      agro_region:    region,
      has_irrigation: profile?.has_irrigation ?? false,
      planting_month: new Date().getMonth() + 1,
    };
    try {
      const cacheKey = `${cropId}_${budget}_${region}_${farmSize}`;
      const result = await getProfitCalc(db, isOnline, body, cacheKey);
      if (result.data) {
        setResult(result.data);
        setCacheAge(result.source !== 'live' ? result.cacheAge ?? null : null);
      } else if (!isOnline) {
        setError('No cached data — connect to calculate profit.');
      } else {
        setError('Could not load prices. Check your connection.');
      }
    } catch {
      setError('Could not calculate. Check your connection.');
    } finally {
      setLoading(false);
    }
  }, [cropId, budget, farmSize, region, isOnline, db]);

  useEffect(() => { calculate(); }, [cropId, budget, isOnline]);

  return (
    <View style={[p.screen, { paddingTop: insets.top }]}>
      <View style={p.header}>
        <Text style={p.headerLabel}>Profit calculator</Text>
        <Text style={p.headerTitle}>Plan</Text>
        <Text style={p.headerSub}>
          Using today&apos;s live prices · {farmSize} ha · Region {region}
        </Text>
      </View>

      {cacheAge && (
        <View style={{ backgroundColor: '#FAEEDA', paddingHorizontal: 16, paddingVertical: 8,
          flexDirection: 'row', gap: 6, alignItems: 'center' }}>
          <Text style={{ fontSize: 11, color: '#854F0B' }}>📦</Text>
          <Text style={{ fontSize: 11, color: '#854F0B', fontWeight: '500' }}>
            Using cached prices from {cacheAge} — connect to get today&apos;s prices
          </Text>
        </View>
      )}

      <ScrollView style={p.body} showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}>

        <View style={p.section}>
          <Text style={p.secTitle}>Select crop</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}>
            {CROPS.map(c => (
              <TouchableOpacity key={c.id}
                style={[p.cropChip, cropId === c.id && p.cropChipActive]}
                onPress={() => setCropId(c.id)} activeOpacity={0.7}>
                <Text style={{ fontSize: 18 }}>{c.icon}</Text>
                <Text style={[p.cropChipText, cropId === c.id && { color: '#fff', fontWeight: '700' }]}>
                  {c.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={p.section}>
          <Text style={p.secTitle}>Input budget</Text>
          {BUDGETS.map(b => (
            <TouchableOpacity key={b.key}
              style={[p.budgetRow, budget === b.key && p.budgetRowActive]}
              onPress={() => setBudget(b.key)} activeOpacity={0.75}>
              <View style={[p.budgetDot, budget === b.key && p.budgetDotActive]} />
              <View style={{ flex: 1 }}>
                <Text style={[p.budgetLabel, budget === b.key && { color: '#1A5C2A', fontWeight: '700' }]}>
                  {b.label} input
                </Text>
                <Text style={p.budgetDesc}>{b.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {loading && (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#1A5C2A" />
            <Text style={{ color: Colors.slate400, marginTop: 12, fontSize: 13 }}>
              Calculating with today&apos;s prices...
            </Text>
          </View>
        )}

        {error && (
          <View style={p.errorCard}>
            <Text style={p.errorText}>{error}</Text>
          </View>
        )}

        {!loading && result && (
          <>
            <View style={p.section}>
              <View style={[p.profitCard, { borderColor: result.net_profit > 0 ? '#97C459' : '#F09595' }]}>
                <Text style={p.profitLabel}>Estimated net profit</Text>
                <Text style={[p.profitBig, { color: result.net_profit > 0 ? '#1A5C2A' : '#A32D2D' }]}>
                  {result.net_profit >= 0 ? '+' : ''}${result.net_profit?.toFixed(0)}
                </Text>
                <Text style={p.profitSub}>
                  {result.farm_size_ha} ha · {result.crop_name} · {budget} input · ROI {result.roi_pct?.toFixed(0)}%
                </Text>
                <View style={p.verdictRow}>
                  <Text style={p.verdictText}>{result.verdict}</Text>
                </View>
              </View>
            </View>

            <View style={p.section}>
              <View style={p.metricsGrid}>
                <View style={p.metricTile}>
                  <Text style={p.metricLabel}>Est. yield</Text>
                  <Text style={p.metricVal}>{result.total_yield_kg?.toLocaleString()} kg</Text>
                  <Text style={p.metricSub}>{result.yield_t_ha} t/ha</Text>
                </View>
                <View style={p.metricTile}>
                  <Text style={p.metricLabel}>Best price</Text>
                  <Text style={p.metricVal}>${result.best_sell_price_kg?.toFixed(3)}/kg</Text>
                  <Text style={p.metricSub}>{result.best_market}</Text>
                </View>
                <View style={p.metricTile}>
                  <Text style={p.metricLabel}>Break-even</Text>
                  <Text style={p.metricVal}>{result.break_even_kg?.toLocaleString()} kg</Text>
                  <Text style={p.metricSub}>Minimum to cover</Text>
                </View>
                <View style={p.metricTile}>
                  <Text style={p.metricLabel}>Gross revenue</Text>
                  <Text style={p.metricVal}>${result.gross_revenue?.toFixed(0)}</Text>
                  <Text style={p.metricSub}>Before costs</Text>
                </View>
              </View>
            </View>

            <View style={p.section}>
              <Text style={p.secTitle}>Cost breakdown · today&apos;s prices</Text>
              <View style={p.card}>
                {(result.input_lines ?? []).map((line: any, i: number) => (
                  <LineItem key={i} label={line.product} value={`$${line.total?.toFixed(2)}`} />
                ))}
                <LineItem label="Labour" value={`$${(result.labour_per_ha * result.farm_size_ha)?.toFixed(0)}`} />
                <LineItem label="Land preparation" value={`$${(result.land_prep_per_ha * result.farm_size_ha)?.toFixed(0)}`} />
                <LineItem label="Contingency (8%)" value={`$${result.contingency_8pct?.toFixed(0)}`} />
                <View style={p.divider} />
                <LineItem label="Total input cost" value={`-$${result.total_cost?.toFixed(0)}`} color="#A32D2D" />
                <LineItem label="Gross revenue"    value={`+$${result.gross_revenue?.toFixed(0)}`} color="#1A5C2A" />
                <View style={p.divider} />
                <LineItem label="Net profit"
                  value={`$${result.net_profit?.toFixed(0)}`}
                  color={result.net_profit >= 0 ? '#1A5C2A' : '#A32D2D'} />
              </View>
            </View>

            <View style={p.section}>
              <Text style={p.secTitle}>Best place to sell at harvest</Text>
              <View style={p.card}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: '#EAF3DE', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 18 }}>📍</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.slate900 }}>{result.best_market}</Text>
                    <Text style={{ fontSize: 12, color: Colors.slate400, marginTop: 2 }}>
                      ${result.best_sell_price_kg?.toFixed(3)}/kg · Best price today
                    </Text>
                  </View>
                  <View style={{ backgroundColor: '#EAF3DE', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#27500A' }}>Top price</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={p.section}>
              <TouchableOpacity style={p.saveBtn}>
                <Text style={p.saveBtnText}>Save this plan</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {!isOnline && !result && (
          <View style={p.offlineCard}>
            <Text style={{ fontSize: 36, marginBottom: 12 }}>📡</Text>
            <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.slate700 }}>Connect to calculate</Text>
            <Text style={{ fontSize: 13, color: Colors.slate400, textAlign: 'center', marginTop: 6, lineHeight: 18 }}>
              The profit calculator needs today&apos;s live prices.
            </Text>
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const p = StyleSheet.create({
  screen:     { flex: 1, backgroundColor: Colors.background },
  header:     { backgroundColor: '#1A5C2A', paddingHorizontal: 18, paddingTop: 12, paddingBottom: 18 },
  headerLabel:{ fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 0.05 },
  headerTitle:{ fontSize: 24, fontWeight: '700', color: '#fff', marginTop: 2 },
  headerSub:  { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  body:       { flex: 1 },
  section:    { padding: Spacing[4], paddingBottom: 0 },
  secTitle:   { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.05, color: Colors.slate400, marginBottom: 10 },
  cropChip:   { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.slate100, backgroundColor: Colors.white },
  cropChipActive: { backgroundColor: '#1A5C2A', borderColor: '#1A5C2A' },
  cropChipText: { fontSize: 13, fontWeight: '500', color: Colors.slate700 },
  budgetRow:  { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.slate100, backgroundColor: Colors.white, marginBottom: 6 },
  budgetRowActive: { borderColor: '#97C459', backgroundColor: '#EAF3DE' },
  budgetDot:  { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: Colors.slate300, flexShrink: 0 },
  budgetDotActive: { backgroundColor: '#1A5C2A', borderColor: '#1A5C2A' },
  budgetLabel:{ fontSize: 14, color: Colors.slate900 },
  budgetDesc: { fontSize: 11, color: Colors.slate400, marginTop: 2 },
  profitCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, borderWidth: 2, padding: 18, ...Shadows.sm },
  profitLabel:{ fontSize: 12, fontWeight: '600', color: Colors.slate400, textTransform: 'uppercase', letterSpacing: 0.05 },
  profitBig:  { fontSize: 42, fontWeight: '700', marginTop: 4, letterSpacing: -1 },
  profitSub:  { fontSize: 12, color: Colors.slate400, marginTop: 4 },
  verdictRow: { marginTop: 10, backgroundColor: Colors.slate050, borderRadius: 8, padding: 10 },
  verdictText:{ fontSize: 13, color: Colors.slate700, lineHeight: 18 },
  metricsGrid:{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metricTile: { flex: 1, minWidth: '45%', backgroundColor: Colors.slate050, borderRadius: BorderRadius.md, padding: 12 },
  metricLabel:{ fontSize: 10, color: Colors.slate400, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.04 },
  metricVal:  { fontSize: 18, fontWeight: '700', color: Colors.slate900, marginTop: 3 },
  metricSub:  { fontSize: 11, color: Colors.slate400, marginTop: 2 },
  card:       { backgroundColor: Colors.white, borderRadius: BorderRadius.md, borderWidth: 0.5, borderColor: Colors.slate100, padding: 14, ...Shadows.sm },
  lineRow:    { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: 0.5, borderBottomColor: Colors.slate050 },
  lineLabel:  { fontSize: 13, color: Colors.slate600 },
  lineVal:    { fontSize: 13, fontWeight: '600', color: Colors.slate900 },
  divider:    { height: 0.5, backgroundColor: Colors.slate200, marginVertical: 6 },
  saveBtn:    { backgroundColor: '#1A5C2A', borderRadius: BorderRadius.md, paddingVertical: 15, alignItems: 'center', ...Shadows.sm, marginTop: 12, marginBottom: 20 },
  saveBtnText:{ fontSize: 15, fontWeight: '700', color: '#fff' },
  errorCard:  { margin: 14, padding: 14, backgroundColor: '#FCEBEB', borderRadius: BorderRadius.md },
  errorText:  { fontSize: 13, color: '#A32D2D' },
  offlineCard:{ margin: 14, padding: 32, backgroundColor: Colors.white, borderRadius: BorderRadius.md, alignItems: 'center', borderWidth: 0.5, borderColor: Colors.slate100 },
});

export default PlanScreen;