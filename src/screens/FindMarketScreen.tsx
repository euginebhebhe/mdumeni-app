// src/screens/FindMarketScreen.tsx
// Shows nearest markets and suppliers sorted by distance from farmer's district
// Used from Plan screen 'Where to sell' and More tab

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/store';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

const BASE_URL = 'https://mdumeni-api.onrender.com';

const MARKET_TYPE_LABELS: Record<string, string> = {
  open_market:  'Open market',
  gmb_depot:    'GMB depot',
  export_buyer: 'Export buyer',
  agro_dealer:  'Agro-dealer',
  cooperative:  'Cooperative',
};

const PAYMENT_ICONS: Record<string, string> = {
  cash:          '💵',
  ecocash:       '📱',
  bank_transfer: '🏦',
  cheque:        '📋',
};

type ViewMode = 'buyers' | 'suppliers';

function MarketCard({ item, type }: { item: any; type: ViewMode }) {
  const isBuyer = type === 'buyers';
  const district = isBuyer ? item.district : item.district;
  const province = isBuyer ? item.province : item.province;
  const payments = item.payment_methods ?? [];

  return (
    <View style={s.card}>
      <View style={s.cardHeader}>
        <View style={[s.cardIcon, { backgroundColor: isBuyer ? '#EAF3DE' : '#E6F1FB' }]}>
          <Text style={{ fontSize: 18 }}>{isBuyer ? '📍' : '🏪'}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={s.cardName}>{item.name}</Text>
          {item.branch && (
            <Text style={s.cardBranch}>{item.branch}</Text>
          )}
          <Text style={s.cardLocation}>{district} · {province}</Text>
        </View>
        {item.type && (
          <View style={s.typeBadge}>
            <Text style={s.typeBadgeText}>{MARKET_TYPE_LABELS[item.type] ?? item.type}</Text>
          </View>
        )}
      </View>

      {item.phone && (
        <View style={s.infoRow}>
          <Text style={s.infoIcon}>📞</Text>
          <Text style={s.infoText}>{item.phone}</Text>
        </View>
      )}

      {isBuyer && item.min_quantity_kg > 0 && (
        <View style={s.infoRow}>
          <Text style={s.infoIcon}>⚖️</Text>
          <Text style={s.infoText}>Min: {item.min_quantity_kg.toLocaleString()} kg</Text>
        </View>
      )}

      {isBuyer && payments.length > 0 && (
        <View style={s.paymentRow}>
          {payments.map((p: string) => (
            <View key={p} style={s.paymentChip}>
              <Text style={s.paymentIcon}>{PAYMENT_ICONS[p] ?? '💳'}</Text>
              <Text style={s.paymentText}>{p.replace('_', ' ')}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

interface Props { onBack?: () => void; }

export function FindMarketScreen({ onBack }: Props) {
  const insets   = useSafeAreaInsets();
  const profile  = useAppStore((s) => s.profile);
  const isOnline = useAppStore((s) => s.isOnline);

  const [mode,      setMode]      = useState<ViewMode>('buyers');
  const [markets,   setMarkets]   = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [marketType, setMarketType] = useState<string>('all');

  const province = profile?.province ?? '';
  const district = profile?.district ?? '';

  useEffect(() => {
    if (!isOnline) { setLoading(false); return; }
    loadAll();
  }, [isOnline]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [mRes, sRes] = await Promise.all([
        fetch(`${BASE_URL}/market/markets${province ? `?province=${encodeURIComponent(province)}` : ''}`).then(r => r.json()),
        fetch(`${BASE_URL}/market/suppliers${province ? `?province=${encodeURIComponent(province)}` : ''}`).then(r => r.json()),
      ]);
      setMarkets(mRes.markets ?? []);
      setSuppliers(sRes.suppliers ?? []);
    } catch {}
    setLoading(false);
  };

  const MARKET_TYPES = ['all', 'open_market', 'gmb_depot', 'export_buyer'];
  const SUPPLIER_TYPES = ['all', 'agro_dealer', 'seed_company', 'fertiliser', 'equipment'];

  const filteredMarkets = marketType === 'all'
    ? markets
    : markets.filter(m => m.type === marketType);

  const filteredSuppliers = marketType === 'all'
    ? suppliers
    : suppliers.filter(s => s.type === marketType);

  const displayItems = mode === 'buyers' ? filteredMarkets : filteredSuppliers;

  return (
    <View style={[s.screen, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <Text style={s.headerLabel}>
          {district || province ? `Near ${district || province}` : 'All Zimbabwe'}
        </Text>
        <Text style={s.headerTitle}>Find market</Text>
        <Text style={s.headerSub}>
          Markets, buyers and agro-dealers
        </Text>
      </View>

      {/* Mode tabs */}
      <View style={s.tabs}>
        <TouchableOpacity style={[s.tab, mode === 'buyers' && s.tabActive]}
          onPress={() => { setMode('buyers'); setMarketType('all'); }}>
          <Text style={[s.tabText, mode === 'buyers' && s.tabTextActive]}>
            Where to sell
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.tab, mode === 'suppliers' && s.tabActive]}
          onPress={() => { setMode('suppliers'); setMarketType('all'); }}>
          <Text style={[s.tabText, mode === 'suppliers' && s.tabTextActive]}>
            Where to buy
          </Text>
        </TouchableOpacity>
      </View>

      {/* Type filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, borderBottomWidth: 0.5, borderBottomColor: Colors.slate100 }}
        contentContainerStyle={{ paddingHorizontal: 14, paddingVertical: 8, gap: 6 }}>
        {(mode === 'buyers' ? MARKET_TYPES : SUPPLIER_TYPES).map(t => (
          <TouchableOpacity key={t}
            style={[s.filterChip, marketType === t && s.filterChipActive]}
            onPress={() => setMarketType(t)}>
            <Text style={[s.filterText, marketType === t && s.filterTextActive]}>
              {t === 'all' ? 'All' : MARKET_TYPE_LABELS[t] ?? t}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#1A5C2A" />
        </View>
      ) : !isOnline ? (
        <View style={s.offlineCard}>
          <Text style={{ fontSize: 32, marginBottom: 12 }}>📡</Text>
          <Text style={{ fontSize: 15, fontWeight: '600', color: Colors.slate700 }}>Offline</Text>
          <Text style={{ fontSize: 13, color: Colors.slate400, textAlign: 'center', marginTop: 6 }}>
            Connect to find markets and suppliers near you.
          </Text>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }}
          contentContainerStyle={{ padding: 14, gap: 10, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}>
          {displayItems.length === 0 ? (
            <View style={s.emptyCard}>
              <Text style={{ fontSize: 32, marginBottom: 10 }}>🗺️</Text>
              <Text style={{ fontSize: 15, fontWeight: '600', color: Colors.slate700 }}>
                No {mode === 'buyers' ? 'markets' : 'suppliers'} found
              </Text>
              <Text style={{ fontSize: 13, color: Colors.slate400, marginTop: 6 }}>
                Try removing the filter above
              </Text>
            </View>
          ) : (
            displayItems.map((item, i) => (
              <MarketCard key={i} item={item} type={mode} />
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  screen:     { flex: 1, backgroundColor: Colors.background },
  header:     { backgroundColor: '#1A5C2A', padding: Spacing[4], paddingTop: 16, paddingBottom: 18 },
  headerLabel:{ fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 0.05 },
  headerTitle:{ fontSize: 24, fontWeight: '700', color: '#fff', marginTop: 2 },
  headerSub:  { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  tabs:       { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: Colors.slate100 },
  tab:        { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive:  { borderBottomWidth: 2, borderBottomColor: '#1A5C2A' },
  tabText:    { fontSize: 13, color: Colors.slate400, fontWeight: '500' },
  tabTextActive: { color: '#1A5C2A', fontWeight: '700' },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 0.5, borderColor: Colors.slate200, backgroundColor: Colors.white },
  filterChipActive: { backgroundColor: '#1A5C2A', borderColor: '#1A5C2A' },
  filterText: { fontSize: 12, color: Colors.slate600 },
  filterTextActive: { color: '#fff', fontWeight: '600' },
  card:       { backgroundColor: Colors.white, borderRadius: BorderRadius.md, borderWidth: 0.5, borderColor: Colors.slate100, padding: 14, ...Shadows.sm },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  cardIcon:   { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cardName:   { fontSize: 15, fontWeight: '600', color: Colors.slate900 },
  cardBranch: { fontSize: 12, color: Colors.slate400, marginTop: 1 },
  cardLocation:{ fontSize: 12, color: Colors.slate400, marginTop: 2 },
  typeBadge:  { backgroundColor: Colors.slate050, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  typeBadgeText: { fontSize: 10, color: Colors.slate600, fontWeight: '500' },
  infoRow:    { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  infoIcon:   { fontSize: 14 },
  infoText:   { fontSize: 13, color: Colors.slate600 },
  paymentRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginTop: 4 },
  paymentChip:{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.slate050, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  paymentIcon:{ fontSize: 12 },
  paymentText:{ fontSize: 11, color: Colors.slate600, textTransform: 'capitalize' },
  offlineCard:{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyCard:  { padding: 40, alignItems: 'center' },
});
