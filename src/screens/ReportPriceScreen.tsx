// src/screens/ReportPriceScreen.tsx
// Farmer submits a price they saw at their local market
// Feeds the crowd-source price network and improves data for all farmers
// Accessible from Market screen and More tab

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/store';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

const BASE_URL = 'https://mdumeni-api.onrender.com';

const CROPS = [
  { id: 'CROP_002', name: 'Sugar beans' },
  { id: 'CROP_001', name: 'Maize' },
  { id: 'CROP_003', name: 'Groundnuts' },
  { id: 'CROP_006', name: 'Sorghum' },
  { id: 'CROP_009', name: 'Soybeans' },
  { id: 'CROP_019', name: 'Tomatoes' },
  { id: 'CROP_020', name: 'Onions' },
  { id: 'CROP_010', name: 'Sunflower' },
  { id: 'CROP_016', name: 'Sesame' },
  { id: 'CROP_008', name: 'Cowpeas' },
];

const PRODUCTS = [
  { id: 'INP_COMP_D_50',  name: 'Compound D 50kg' },
  { id: 'INP_AN_345_50',  name: 'AN 34.5% 50kg' },
  { id: 'INP_SEED_ZM521', name: 'Maize Seed ZM521 10kg' },
  { id: 'INP_SEED_SC403', name: 'Maize Seed SC403 10kg' },
  { id: 'INP_SEED_SB_1KG',name: 'Sugar Bean Seed 1kg' },
  { id: 'INP_AGRILIME_50',name: 'Agricultural Lime 50kg' },
  { id: 'INP_ATRAZINE_1L',name: 'Atrazine 1L' },
  { id: 'INP_CHLORPYR_1L',name: 'Chlorpyrifos 1L' },
];

interface Props { onDone?: () => void; }

export function ReportPriceScreen({ onDone }: Props) {
  const insets   = useSafeAreaInsets();
  const farmerId = useAppStore((s) => s.farmerId);
  const isOnline = useAppStore((s) => s.isOnline);

  const [reportType, setReportType] = useState<'crop_sell' | 'input_buy'>('crop_sell');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [markets,    setMarkets]    = useState<any[]>([]);
  const [suppliers,  setSuppliers]  = useState<any[]>([]);
  const [marketId,   setMarketId]   = useState<string | null>(null);
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [price,      setPrice]      = useState('');
  const [notes,      setNotes]      = useState('');
  const [saving,     setSaving]     = useState(false);

  useEffect(() => {
    if (!isOnline) return;
    fetch(`${BASE_URL}/market/markets`).then(r => r.json())
      .then(d => setMarkets(d.markets ?? [])).catch(() => {});
    fetch(`${BASE_URL}/market/suppliers`).then(r => r.json())
      .then(d => setSuppliers(d.suppliers ?? [])).catch(() => {});
  }, [isOnline]);

  const items    = reportType === 'crop_sell' ? CROPS : PRODUCTS;
  const canSave  = selectedId && price && parseFloat(price) > 0 &&
                   (reportType === 'crop_sell' ? marketId : supplierId);

  const handleSave = async () => {
    if (!canSave || !farmerId) {
      Alert.alert('Login required', 'Please log in to report prices.');
      return;
    }
    setSaving(true);
    try {
      const body: any = {
        farmer_id:   farmerId,
        report_type: reportType,
        price_usd:   parseFloat(price),
        unit:        reportType === 'crop_sell' ? 'kg' : 'each',
        notes,
      };
      if (reportType === 'crop_sell') {
        body.crop_id  = selectedId;
        body.market_id = marketId;
      } else {
        body.product_id  = selectedId;
        body.supplier_id = supplierId;
      }

      const res = await fetch(`${BASE_URL}/market/prices/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed');

      Alert.alert(
        '✅ Price reported',
        'Thank you! Your report helps all farmers in Zimbabwe get accurate prices.',
        [{ text: 'Done', onPress: onDone }]
      );
    } catch {
      Alert.alert('Error', 'Could not submit. Check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={[s.screen, { paddingTop: insets.top }]}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled">

        <View style={s.header}>
          <Text style={s.headerLabel}>Community prices</Text>
          <Text style={s.headerTitle}>Report a price</Text>
          <Text style={s.headerSub}>
            What did you see at your local market today?
            Your report updates prices for all farmers.
          </Text>
        </View>

        {/* Report type */}
        <View style={s.section}>
          <Text style={s.secTitle}>What are you reporting?</Text>
          <View style={s.typeRow}>
            <TouchableOpacity
              style={[s.typeBtn, reportType === 'crop_sell' && s.typeBtnActive]}
              onPress={() => { setReportType('crop_sell'); setSelectedId(null); }}
              activeOpacity={0.75}>
              <Text style={s.typeIcon}>🌾</Text>
              <Text style={[s.typeLabel, reportType === 'crop_sell' && { color: '#1A5C2A', fontWeight: '700' }]}>
                Crop sell price
              </Text>
              <Text style={s.typeDesc}>Price a buyer offered you</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.typeBtn, reportType === 'input_buy' && s.typeBtnActive]}
              onPress={() => { setReportType('input_buy'); setSelectedId(null); }}
              activeOpacity={0.75}>
              <Text style={s.typeIcon}>🏪</Text>
              <Text style={[s.typeLabel, reportType === 'input_buy' && { color: '#1A5C2A', fontWeight: '700' }]}>
                Input buy price
              </Text>
              <Text style={s.typeDesc}>Price at an agro-dealer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Item selector */}
        <View style={s.section}>
          <Text style={s.secTitle}>
            {reportType === 'crop_sell' ? 'Which crop?' : 'Which product?'}
          </Text>
          <View style={s.grid}>
            {items.map(item => (
              <TouchableOpacity key={item.id}
                style={[s.itemChip, selectedId === item.id && s.itemChipActive]}
                onPress={() => setSelectedId(item.id)} activeOpacity={0.7}>
                <Text style={[s.itemText, selectedId === item.id && { color: '#fff', fontWeight: '700' }]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Market or Supplier */}
        {reportType === 'crop_sell' && markets.length > 0 && (
          <View style={s.section}>
            <Text style={s.secTitle}>Which market?</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}>
              {markets.slice(0, 12).map(m => (
                <TouchableOpacity key={m.id}
                  style={[s.locationChip, marketId === m.id && s.locationChipActive]}
                  onPress={() => setMarketId(m.id)} activeOpacity={0.7}>
                  <Text style={[s.locationText, marketId === m.id && { color: '#fff' }]}>
                    {m.name}
                  </Text>
                  <Text style={[s.locationSub, marketId === m.id && { color: 'rgba(255,255,255,0.7)' }]}>
                    {m.district}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {reportType === 'input_buy' && suppliers.length > 0 && (
          <View style={s.section}>
            <Text style={s.secTitle}>Which supplier?</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}>
              {suppliers.slice(0, 12).map(sup => (
                <TouchableOpacity key={sup.id}
                  style={[s.locationChip, supplierId === sup.id && s.locationChipActive]}
                  onPress={() => setSupplierId(sup.id)} activeOpacity={0.7}>
                  <Text style={[s.locationText, supplierId === sup.id && { color: '#fff' }]}>
                    {sup.name}
                  </Text>
                  <Text style={[s.locationSub, supplierId === sup.id && { color: 'rgba(255,255,255,0.7)' }]}>
                    {sup.branch ?? sup.district}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Price input */}
        <View style={s.section}>
          <Text style={s.secTitle}>
            {reportType === 'crop_sell' ? 'Price per kg (USD)' : 'Price (USD)'}
          </Text>
          <View style={s.priceInputRow}>
            <Text style={s.priceCurrency}>$</Text>
            <TextInput
              style={s.priceInput}
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={Colors.slate300}
              maxLength={8}
            />
            <Text style={s.priceUnit}>
              {reportType === 'crop_sell' ? '/kg' : 'per unit'}
            </Text>
          </View>
        </View>

        {/* Notes */}
        <View style={s.section}>
          <Text style={s.secTitle}>Notes (optional)</Text>
          <TextInput
            style={[s.notesInput]}
            value={notes}
            onChangeText={setNotes}
            placeholder="e.g. Grade A only · Cash payment · Minimum 500kg"
            placeholderTextColor={Colors.slate300}
            multiline
            numberOfLines={2}
          />
        </View>

        {/* Submit */}
        <View style={s.section}>
          <TouchableOpacity
            style={[s.submitBtn, !canSave && s.submitBtnDisabled]}
            onPress={handleSave}
            disabled={!canSave || saving}
            activeOpacity={0.85}>
            {saving
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.submitText}>Submit price report →</Text>}
          </TouchableOpacity>
          <Text style={s.disclaimer}>
            Your report is anonymous. Only your district is shown to other farmers.
          </Text>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  screen:     { flex: 1, backgroundColor: Colors.background },
  header:     { backgroundColor: '#1A5C2A', padding: Spacing[4], paddingTop: 16, paddingBottom: 20 },
  headerLabel:{ fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 0.05 },
  headerTitle:{ fontSize: 24, fontWeight: '700', color: '#fff', marginTop: 2 },
  headerSub:  { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 6, lineHeight: 19 },
  section:    { padding: Spacing[4], paddingBottom: 0 },
  secTitle:   { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.05, color: Colors.slate400, marginBottom: 10 },
  typeRow:    { flexDirection: 'row', gap: 10 },
  typeBtn:    { flex: 1, backgroundColor: Colors.white, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.slate100, padding: 14, alignItems: 'center', gap: 4 },
  typeBtnActive: { borderColor: '#97C459', backgroundColor: '#EAF3DE' },
  typeIcon:   { fontSize: 22 },
  typeLabel:  { fontSize: 13, fontWeight: '500', color: Colors.slate700, textAlign: 'center' },
  typeDesc:   { fontSize: 11, color: Colors.slate400, textAlign: 'center' },
  grid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  itemChip:   { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.slate100, backgroundColor: Colors.white },
  itemChipActive: { backgroundColor: '#1A5C2A', borderColor: '#1A5C2A' },
  itemText:   { fontSize: 13, color: Colors.slate700 },
  locationChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.slate100, backgroundColor: Colors.white, minWidth: 110 },
  locationChipActive: { backgroundColor: '#1A5C2A', borderColor: '#1A5C2A' },
  locationText: { fontSize: 13, fontWeight: '600', color: Colors.slate800 },
  locationSub:  { fontSize: 11, color: Colors.slate400, marginTop: 2 },
  priceInputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.slate200, borderRadius: BorderRadius.md, paddingHorizontal: 14 },
  priceCurrency: { fontSize: 22, fontWeight: '700', color: Colors.slate400, marginRight: 4 },
  priceInput:    { flex: 1, fontSize: 32, fontWeight: '700', color: Colors.slate900, paddingVertical: 12 },
  priceUnit:     { fontSize: 14, color: Colors.slate400, marginLeft: 4 },
  notesInput:    { backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.slate200, borderRadius: BorderRadius.md, padding: 12, fontSize: 14, color: Colors.slate900, minHeight: 64, textAlignVertical: 'top' },
  submitBtn:     { backgroundColor: '#1A5C2A', borderRadius: BorderRadius.md, paddingVertical: 15, alignItems: 'center', ...Shadows.sm, marginTop: 16 },
  submitBtnDisabled: { backgroundColor: Colors.slate200 },
  submitText:    { fontSize: 15, fontWeight: '700', color: '#fff' },
  disclaimer:    { fontSize: 11, color: Colors.slate400, textAlign: 'center', marginTop: 10, lineHeight: 16 },
});
