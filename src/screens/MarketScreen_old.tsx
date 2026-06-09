// src/screens/MarketScreen.tsx
// Live market prices — crop sell prices and input buy prices
// Data from /market/prices/crops/best and /market/prices/inputs/cheapest

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, ActivityIndicator, TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

type Tab = 'crops' | 'inputs' | 'machinery';

const CATEGORY_LABELS: Record<string, string> = {
  fertiliser: 'Fertilisers',
  seed:       'Seeds',
  chemical:   'Chemicals',
  machinery:  'Machinery',
  equipment:  'Equipment',
};

const TREND_COLORS = {
  up:   '#3B6D11',
  down: '#A32D2D',
  flat: Colors.slate400,
};

const TREND_ARROWS = { up: '↑', down: '↓', flat: '—' };

function PriceChangeTag({ pct }: { pct: number | null }) {
  if (pct === null) return <Text style={{ fontSize: 11, color: Colors.slate300 }}>—</Text>;
  const color = pct > 0 ? TREND_COLORS.up : pct < 0 ? TREND_COLORS.down : TREND_COLORS.flat;
  const arrow = pct > 0 ? '↑' : pct < 0 ? '↓' : '—';
  return (
    <Text style={{ fontSize: 11, fontWeight: '600', color }}>
      {arrow} {Math.abs(pct).toFixed(1)}%
    </Text>
  );
}

function CropPriceRow({ item, onPress }: { item: any; onPress: () => void }) {
  const market = item.markets ?? {};
  return (
    <TouchableOpacity style={styles.priceRow} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.priceRowLeft}>
        <Text style={styles.cropName}>{item.crop_name}</Text>
        <Text style={styles.marketName}>
          Best: {market.name ?? item.market_name ?? '—'} · {market.province ?? ''}
        </Text>
      </View>
      <View style={styles.priceRowRight}>
        <Text style={styles.priceValue}>${item.price_usd_kg?.toFixed(3)}/kg</Text>
        <PriceChangeTag pct={null} />
      </View>
    </TouchableOpacity>
  );
}

function InputPriceRow({ item }: { item: any }) {
  const options = item.options ?? [];
  const cheapest = options[0];
  const savings = options.length > 1
    ? options[options.length - 1].price_usd - cheapest.price_usd
    : null;
  return (
    <View style={styles.priceRow}>
      <View style={styles.priceRowLeft}>
        <Text style={styles.cropName}>{item.product_name}</Text>
        <Text style={styles.marketName}>
          {cheapest?.supplier?.name ?? '—'} · {cheapest?.supplier?.district ?? ''}
          {options.length > 1 ? ` · ${options.length} suppliers` : ''}
        </Text>
        {savings && savings > 0.5 && (
          <Text style={{ fontSize: 10, color: TREND_COLORS.up, marginTop: 2 }}>
            Save ${savings.toFixed(2)} vs most expensive
          </Text>
        )}
      </View>
      <View style={styles.priceRowRight}>
        <Text style={styles.priceValue}>
          ${cheapest?.price_usd?.toFixed(2)}
        </Text>
        <Text style={{ fontSize: 10, color: Colors.slate400 }}>
          /{item.unit_size ?? item.unit}
        </Text>
      </View>
    </View>
  );
}

export function MarketScreen() {
  const insets = useSafeAreaInsets();
  const [tab,           setTab]           = useState<Tab>('crops');
  const [inputCategory, setInputCategory] = useState('fertiliser');
  const [cropPrices,    setCropPrices]    = useState<any[]>([]);
  const [inputPrices,   setInputPrices]   = useState<any[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [refreshing,    setRefreshing]    = useState(false);
  const [priceDate,     setPriceDate]     = useState('');
  const [search,        setSearch]        = useState('');
  const [summary,       setSummary]      = useState<any[]>([]);
const [cacheAge,      setCacheAge]     = useState<string | null>(null);

  const loadCategory = async (cat: string) => {
    setInputCategory(cat);
    try {
      const res = await fetch(
        `https://mdumeni-api.onrender.com/market/prices/inputs?category=${cat}`
      ).then(r => r.json());
      setInputPrices(res.inputs ?? []);
    } catch (e) {
      console.log('Category load error:', e);
    }
  };

  const loadData = useCallback(async (refresh = false) => {
  if (refresh) setRefreshing(true);
  else setLoading(true);
  try {
    const [cropRes, inputRes, summaryRes] = await Promise.all([
      fetch('https://mdumeni-api.onrender.com/market/prices/crops/best').then(r => r.json()),
      fetch('https://mdumeni-api.onrender.com/market/prices/inputs?category=fertiliser').then(r => r.json()),
      fetch('https://mdumeni-api.onrender.com/market/summary').then(r => r.json()),
    ]);
    setCropPrices(cropRes.prices ?? []);
    setInputPrices(inputRes.inputs ?? []);
    setPriceDate(summaryRes.date ?? '');
  } catch (e) {
    console.log('Market load error:', e);
    setCacheAge('offline — pull down to refresh');
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
}, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filteredCrops = search
    ? cropPrices.filter(c => c.crop_name.toLowerCase().includes(search.toLowerCase()))
    : cropPrices;

  const filteredInputs = search
    ? inputPrices.filter(i => i.product_name.toLowerCase().includes(search.toLowerCase()))
    : inputPrices;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>Live prices</Text>
          <Text style={styles.headerTitle}>Market</Text>
        </View>
        <View style={styles.dateTag}>
          <Text style={styles.dateTagText}>
            {priceDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Text style={{ fontSize: 15, color: Colors.slate400 }}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search crop or product..."
            placeholderTextColor={Colors.slate300}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={{ fontSize: 14, color: Colors.slate400 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        {(['crops', 'inputs', 'machinery'] as Tab[]).map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tabItem, tab === t && styles.tabItemActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'crops' ? 'Crops' : t === 'inputs' ? 'Inputs' : 'Machinery'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={Colors.green600} />
          <Text style={{ fontSize: 13, color: Colors.slate400, marginTop: 12 }}>Loading live prices...</Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => loadData(true)}
              colors={[Colors.green600]} tintColor={Colors.green600} />
          }
        >
          {/* ── CROPS TAB ─────────────────────────────────────────────────── */}
          {tab === 'crops' && (
            <View>
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>
                  Best sell price per crop today · {filteredCrops.length} crops
                </Text>
                <View style={styles.card}>
                  {filteredCrops.length === 0 ? (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                      <Text style={{ color: Colors.slate400, fontSize: 14 }}>No crop prices found</Text>
                    </View>
                  ) : (
                    filteredCrops.map((item, i) => (
                      <CropPriceRow
                        key={`${item.crop_id}-${i}`}
                        item={item}
                        onPress={() => {}}
                      />
                    ))
                  )}
                </View>
              </View>

              <View style={styles.section}>
                <View style={styles.infoCard}>
                  <Text style={styles.infoTitle}>How prices are collected</Text>
                  <Text style={styles.infoText}>
                    Prices are sourced daily from GMB depots, Mbare Musika, export buyers, and farmer reports.
                    Tap "Report a price" in More → Help to submit prices from your local market.
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* ── INPUTS TAB ────────────────────────────────────────────────── */}
          {tab === 'inputs' && (
            <View>
              {/* Category filter */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll} contentContainerStyle={styles.categoryContent}>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <TouchableOpacity
                    key={key}
                    style={[styles.categoryChip, inputCategory === key && styles.categoryChipActive]}
                    onPress={() => setInputCategory(key)}
                  >
                    <Text style={[styles.categoryChipText, inputCategory === key && styles.categoryChipTextActive]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.section}>
                <Text style={styles.sectionLabel}>
                  Cheapest {CATEGORY_LABELS[inputCategory]?.toLowerCase()} today
                </Text>
                <View style={styles.card}>
                  {filteredInputs.length === 0 ? (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                      <Text style={{ color: Colors.slate400, fontSize: 14 }}>No prices found for this category</Text>
                    </View>
                  ) : (
                    filteredInputs.map((item, i) => (
                      <InputPriceRow key={`${item.product_id}-${i}`} item={item} />
                    ))
                  )}
                </View>
              </View>
            </View>
          )}

          {/* ── MACHINERY TAB ─────────────────────────────────────────────── */}
          {tab === 'machinery' && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Machinery hire rates today</Text>
              <View style={styles.card}>
                {[
                  { name: 'Tractor ploughing + discing', price: '$55.00', unit: '/ha', note: 'Marondera · Best rate' },
                  { name: 'Tractor planting',            price: '$20.00', unit: '/ha', note: 'Marondera · Best rate' },
                  { name: 'Boom sprayer hire',           price: '$15.00', unit: '/ha', note: 'Marondera · Best rate' },
                  { name: 'Maize sheller',               price: '$0.80',  unit: '/90kg bag', note: 'Marondera' },
                  { name: 'Irrigation pump (day)',        price: '$25.00', unit: '/day', note: 'Harare' },
                ].map((item, i) => (
                  <View key={i} style={styles.priceRow}>
                    <View style={styles.priceRowLeft}>
                      <Text style={styles.cropName}>{item.name}</Text>
                      <Text style={styles.marketName}>{item.note}</Text>
                    </View>
                    <View style={styles.priceRowRight}>
                      <Text style={styles.priceValue}>{item.price}</Text>
                      <Text style={{ fontSize: 10, color: Colors.slate400 }}>{item.unit}</Text>
                    </View>
                  </View>
                ))}
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.infoText}>
                  Machinery rates vary by location and availability. Contact your local AGRITEX office or farmers cooperative to book in advance.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: Colors.background },
  header:      { backgroundColor: Colors.green700, paddingHorizontal: Spacing[4], paddingBottom: 14, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: 10 },
  headerLabel: { fontSize: 11, color: 'rgba(255,255,255,.65)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.05 },
  headerTitle: { fontSize: 24, fontWeight: '500', color: Colors.white, marginTop: 1 },
  dateTag:     { backgroundColor: 'rgba(255,255,255,.18)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  dateTagText: { fontSize: 11, color: Colors.white, fontWeight: '500' },
  searchWrap:  { backgroundColor: Colors.green700, paddingHorizontal: Spacing[4], paddingBottom: 14 },
  searchBar:   { backgroundColor: 'rgba(255,255,255,.15)', borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 9 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.white },
  tabBar:      { flexDirection: 'row', backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.slate100 },
  tabItem:     { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabItemActive: { borderBottomWidth: 2, borderBottomColor: Colors.green600 },
  tabText:     { fontSize: 13, color: Colors.slate400, fontWeight: '500' },
  tabTextActive: { color: Colors.green600, fontWeight: '600' },
  section:     { padding: Spacing[4], paddingBottom: 0 },
  sectionLabel: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.05, color: Colors.slate400, marginBottom: 8 },
  card:        { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.slate100, overflow: 'hidden', ...Shadows.sm },
  priceRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 0.5, borderBottomColor: Colors.slate050 },
  priceRowLeft:  { flex: 1, paddingRight: 10 },
  priceRowRight: { alignItems: 'flex-end', flexShrink: 0 },
  cropName:    { fontSize: 13, fontWeight: '600', color: Colors.slate900 },
  marketName:  { fontSize: 11, color: Colors.slate400, marginTop: 2 },
  priceValue:  { fontSize: 15, fontWeight: '600', color: Colors.slate900 },
  categoryScroll:  { flexGrow: 0, backgroundColor: Colors.white, borderBottomWidth: 0.5, borderBottomColor: Colors.slate100 },
  categoryContent: { paddingHorizontal: 14, paddingVertical: 10, gap: 6 },
  categoryChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 16, borderWidth: 1.5, borderColor: Colors.slate100, backgroundColor: Colors.slate050 },
  categoryChipActive: { backgroundColor: Colors.green600, borderColor: Colors.green600 },
  categoryChipText:   { fontSize: 12, fontWeight: '500', color: Colors.slate600 },
  categoryChipTextActive: { color: Colors.white, fontWeight: '700' },
  infoCard: { backgroundColor: Colors.green050, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.green100, padding: 12, marginTop: 10 },
  infoTitle: { fontSize: 12, fontWeight: '600', color: Colors.green700, marginBottom: 4 },
  infoText:  { fontSize: 12, color: Colors.green600, lineHeight: 18 },
});