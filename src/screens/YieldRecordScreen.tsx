// src/screens/YieldRecordScreen.tsx
// Farmer records actual harvest weight after harvest
// Compares AI prediction vs actual yield
// Saves to Supabase season_history for research analysis

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Alert, KeyboardAvoidingView, Platform,
  ActivityIndicator,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useAppStore } from '@/store';
import { recordYield } from '@/services/api';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

interface Props { onDone?: () => void; }

export function YieldRecordScreen({ onDone }: Props) {
  const activeCrop = useAppStore((s) => s.activeCrop);
  const profile    = useAppStore((s) => s.profile);
  const session    = useAppStore((s) => s.session);
  const farmerId   = useAppStore((s) => s.farmerId);

  const predictedKg = session?.crop_plan?.expected_yield_kg ?? 0;
  const pricePerKg  = session?.crop_plan?.market_price_usd_kg ?? 0.28;

  const [actualKg,      setActualKg]      = useState('');
  const [totalCost,     setTotalCost]     = useState(
    String(session?.crop_plan?.total_cost_usd?.toFixed(0) ?? '')
  );
  const [salePrice,     setSalePrice]     = useState(String(pricePerKg));
  const [notes,         setNotes]         = useState('');
  const [harvestDate,   setHarvestDate]   = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [saving, setSaving] = useState(false);

  const kg       = parseFloat(actualKg) || 0;
  const cost     = parseFloat(totalCost) || 0;
  const price    = parseFloat(salePrice) || pricePerKg;
  const revenue  = kg * price;
  const profit   = revenue - cost;
  const roi      = cost > 0 ? ((profit / cost) * 100).toFixed(0) : '0';
  const vsAI     = predictedKg > 0
    ? ((kg / predictedKg - 1) * 100).toFixed(1)
    : null;

  const canSave  = kg > 0 && activeCrop && farmerId;

  const handleSave = async () => {
    if (!canSave || !activeCrop) return;
    setSaving(true);
    try {
      await recordYield({
        farmer_id:          farmerId!,
        crop_id:            activeCrop.crop_id,
        crop_name:          activeCrop.crop_name,
        planting_date:      activeCrop.planting_date,
        harvest_date:       harvestDate,
        farm_size_ha:       activeCrop.farm_size_ha,
        budget_level:       activeCrop.budget_level,
        predicted_yield_kg: predictedKg,
        actual_yield_kg:    kg,
        total_cost_usd:     cost,
        gross_revenue_usd:  revenue,
        net_profit_usd:     profit,
        notes,
      });

      Alert.alert(
        '✅ Yield recorded',
        `${kg.toLocaleString()} kg saved to your season history.\n\nThank you — this data helps improve MDUMENI for all farmers.`,
        [{ text: 'Done', onPress: onDone }]
      );
    } catch (e: any) {
      Alert.alert('Could not save', e.message ?? 'Check your internet connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Record harvest</Text>
          <Text style={styles.sub}>
            {activeCrop?.crop_name ?? 'Active crop'} · {activeCrop?.farm_size_ha ?? '—'} ha ·
            Planted {activeCrop?.planting_date ?? '—'}
          </Text>
        </View>

        {/* AI prediction context */}
        {predictedKg > 0 && (
          <View style={styles.predictionCard}>
            <Text style={styles.predictionLabel}>AI predicted yield</Text>
            <Text style={styles.predictionVal}>{predictedKg.toLocaleString()} kg</Text>
            <Text style={styles.predictionSub}>
              {(predictedKg / (activeCrop?.farm_size_ha ?? 1)).toFixed(0)} kg/ha ·
              At ${pricePerKg}/kg = ${(predictedKg * pricePerKg).toFixed(0)} gross
            </Text>
          </View>
        )}

        {/* Actual yield input */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Actual yield (kg)</Text>
          <Text style={styles.sectionSub}>Total kg harvested from your entire {activeCrop?.farm_size_ha ?? '—'} ha</Text>
          <TextInput
            style={[styles.bigInput, kg > 0 && { borderColor: Colors.green400 }]}
            value={actualKg}
            onChangeText={setActualKg}
            keyboardType="numeric"
            placeholder="e.g. 4800"
            placeholderTextColor={Colors.slate300}
          />
          {kg > 0 && (
            <Text style={styles.perHa}>
              = {(kg / (activeCrop?.farm_size_ha ?? 1)).toFixed(0)} kg/ha
              {vsAI && (
                <Text style={{ color: parseFloat(vsAI) >= 0 ? Colors.green600 : Colors.red500 }}>
                  {'  '}{parseFloat(vsAI) >= 0 ? '+' : ''}{vsAI}% vs AI prediction
                </Text>
              )}
            </Text>
          )}
        </View>

        {/* Financials */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Total input cost (USD)</Text>
          <TextInput
            style={styles.input} value={totalCost} onChangeText={setTotalCost}
            keyboardType="numeric" placeholder="e.g. 757"
            placeholderTextColor={Colors.slate300}
          />

          <Text style={[styles.sectionLabel, { marginTop: 14 }]}>Sale price per kg (USD)</Text>
          <TextInput
            style={styles.input} value={salePrice} onChangeText={setSalePrice}
            keyboardType="numeric" placeholder={String(pricePerKg)}
            placeholderTextColor={Colors.slate300}
          />
        </View>

        {/* Calculated summary */}
        {kg > 0 && cost > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Season summary</Text>
            {[
              ['Gross revenue', `$${revenue.toFixed(2)}`],
              ['Total costs',   `-$${cost.toFixed(2)}`],
              ['Net profit',    `$${profit.toFixed(2)}`],
              ['ROI',           `${roi}%`],
            ].map(([label, val]) => (
              <View key={label} style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{label}</Text>
                <Text style={[
                  styles.summaryVal,
                  label === 'Net profit' && { color: profit >= 0 ? Colors.green600 : Colors.red500 },
                ]}>{val}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Harvest date */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Harvest date</Text>
          <TextInput
            style={styles.input} value={harvestDate} onChangeText={setHarvestDate}
            placeholder="YYYY-MM-DD" placeholderTextColor={Colors.slate300}
          />
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Notes (optional)</Text>
          <TextInput
            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
            value={notes} onChangeText={setNotes}
            multiline placeholder="e.g. Drought reduced yield in February. Storage: hermetic bags."
            placeholderTextColor={Colors.slate300}
          />
        </View>

        {/* Save */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
            onPress={handleSave} disabled={!canSave || saving} activeOpacity={0.85}>
            {saving
              ? <ActivityIndicator color={Colors.white} />
              : <Text style={styles.saveBtnText}>Record harvest →</Text>}
          </TouchableOpacity>
          <Text style={styles.footerNote}>
            Your yield data is saved securely and helps improve AI recommendations for all farmers.
          </Text>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen:  { flex: 1, backgroundColor: Colors.background },
  header:  { backgroundColor: Colors.green600, padding: Spacing[4], paddingTop: 16, paddingBottom: 18 },
  title:   { fontSize: 22, fontWeight: '800', color: Colors.white, letterSpacing: -0.3 },
  sub:     { fontSize: 12, color: Colors.green200, marginTop: 3 },
  predictionCard: {
    margin: Spacing[4], marginBottom: 4,
    backgroundColor: Colors.green050, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.green100, padding: 14,
  },
  predictionLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.04, color: Colors.green600, marginBottom: 4 },
  predictionVal:   { fontSize: 28, fontWeight: '700', color: Colors.green700 },
  predictionSub:   { fontSize: 12, color: Colors.green600, marginTop: 3 },
  section:  { padding: Spacing[4], paddingBottom: 0 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: Colors.slate900, marginBottom: 4 },
  sectionSub:   { fontSize: 12, color: Colors.slate400, marginBottom: 10 },
  bigInput: {
    borderWidth: 2, borderColor: Colors.slate200, borderRadius: BorderRadius.sm,
    padding: 14, fontSize: 32, fontWeight: '700', color: Colors.slate900,
    textAlign: 'center', marginBottom: 6,
  },
  perHa:  { fontSize: 13, color: Colors.blue500, textAlign: 'center', marginBottom: 8 },
  input:  { borderWidth: 1.5, borderColor: Colors.slate200, borderRadius: BorderRadius.sm, padding: 12, fontSize: 16, color: Colors.slate900, marginBottom: 8 },
  summaryCard: {
    margin: Spacing[4], marginBottom: 4,
    backgroundColor: Colors.white, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.slate100, padding: 14, ...Shadows.sm,
  },
  summaryTitle: { fontSize: 13, fontWeight: '700', color: Colors.slate900, marginBottom: 10 },
  summaryRow:   { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: Colors.slate050 },
  summaryLabel: { fontSize: 13, color: Colors.slate600 },
  summaryVal:   { fontSize: 14, fontWeight: '700', color: Colors.slate900 },
  footer:   { padding: Spacing[4], paddingTop: 20 },
  saveBtn:  { backgroundColor: Colors.green600, borderRadius: BorderRadius.md, paddingVertical: 15, alignItems: 'center', ...Shadows.sm },
  saveBtnDisabled: { backgroundColor: Colors.slate200 },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
  footerNote:  { fontSize: 11, color: Colors.slate400, textAlign: 'center', marginTop: 10, lineHeight: 16 },
});
