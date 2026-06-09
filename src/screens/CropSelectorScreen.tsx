// src/screens/CropSelectorScreen.tsx
// Farmer sets their active crop and planting date
// This drives the Calendar phase, days-since-planting, and all AI outputs

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, Platform,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useAppStore } from '@/store';
import { setActiveCrop } from '@/db/database';
import { useSession } from '@/hooks/useSession';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

// All 30 crops with their IDs — must match crop_dataset
const CROPS = [
  { id: 'CROP_001', name: 'Maize',         icon: '🌽', type: 'cereal' },
  { id: 'CROP_002', name: 'Sugar beans',   icon: '🫘', type: 'legume' },
  { id: 'CROP_003', name: 'Groundnuts',    icon: '🥜', type: 'legume' },
  { id: 'CROP_004', name: 'Sweet potato',  icon: '🍠', type: 'root' },
  { id: 'CROP_005', name: 'Cassava',       icon: '🌿', type: 'root' },
  { id: 'CROP_006', name: 'Sorghum',       icon: '🌾', type: 'cereal' },
  { id: 'CROP_007', name: 'Pearl millet',  icon: '🌾', type: 'cereal' },
  { id: 'CROP_008', name: 'Cowpeas',       icon: '🫘', type: 'legume' },
  { id: 'CROP_009', name: 'Soybeans',      icon: '🌱', type: 'legume' },
  { id: 'CROP_010', name: 'Sunflower',     icon: '🌻', type: 'oilseed' },
  { id: 'CROP_011', name: 'Cotton',        icon: '🌿', type: 'fibre' },
  { id: 'CROP_012', name: 'Tobacco',       icon: '🌿', type: 'cash' },
  { id: 'CROP_013', name: 'Sugar cane',    icon: '🎋', type: 'cash' },
  { id: 'CROP_014', name: 'Wheat',         icon: '🌾', type: 'cereal' },
  { id: 'CROP_015', name: 'Barley',        icon: '🌾', type: 'cereal' },
  { id: 'CROP_016', name: 'Sesame',        icon: '🌿', type: 'oilseed' },
  { id: 'CROP_017', name: 'Rape',          icon: '🌼', type: 'vegetable' },
  { id: 'CROP_018', name: 'Cabbages',      icon: '🥬', type: 'vegetable' },
  { id: 'CROP_019', name: 'Tomatoes',      icon: '🍅', type: 'vegetable' },
  { id: 'CROP_020', name: 'Onions',        icon: '🧅', type: 'vegetable' },
  { id: 'CROP_021', name: 'Potatoes',      icon: '🥔', type: 'vegetable' },
  { id: 'CROP_022', name: 'Pumpkin',       icon: '🎃', type: 'vegetable' },
  { id: 'CROP_023', name: 'Butternut',     icon: '🎃', type: 'vegetable' },
  { id: 'CROP_024', name: 'Garlic',        icon: '🧄', type: 'vegetable' },
  { id: 'CROP_025', name: 'Coffee',        icon: '☕', type: 'cash' },
  { id: 'CROP_026', name: 'Tea',           icon: '🍵', type: 'cash' },
  { id: 'CROP_027', name: 'Macadamia',     icon: '🌰', type: 'tree' },
  { id: 'CROP_028', name: 'Avocado',       icon: '🥑', type: 'tree' },
  { id: 'CROP_029', name: 'Mango',         icon: '🥭', type: 'tree' },
  { id: 'CROP_030', name: 'Banana',        icon: '🍌', type: 'tree' },
];

const TYPES = ['all', 'cereal', 'legume', 'vegetable', 'root', 'oilseed', 'cash', 'tree', 'fibre'];

interface Props {
  onDone?: () => void;
}

export function CropSelectorScreen({ onDone }: Props) {
  const db              = useSQLiteContext();
  const profile         = useAppStore((s) => s.profile);
  const setActiveCropStore = useAppStore((s) => s.setActiveCrop);
  const { refresh }     = useSession();

  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter]         = useState('all');
  const [plantingDateStr, setPlantingDateStr] = useState(''); // DD/MM/YYYY
  const [saving, setSaving]                 = useState(false);

  const filteredCrops = CROPS.filter(c => typeFilter === 'all' || c.type === typeFilter);

  // Validate date input and convert to Date object
  const parsePlantingDate = (): Date | null => {
    const [dd, mm, yyyy] = plantingDateStr.split('/').map(s => parseInt(s, 10));
    if (!dd || !mm || !yyyy) return null;
    const date = new Date(yyyy, mm - 1, dd);
    if (isNaN(date.getTime())) return null; // Invalid date
    if (date > new Date()) return null; // Future date not allowed
    return date;
  }

  const handleDateInput = (text: string) => {
    // Remove all non-digits
    const digits = text.replace(/\D/g, '');
    // Auto-insert slashes
    let formatted = digits;
    if (digits.length > 2) formatted = digits.slice(0,2) + '/' + digits.slice(2);
    if (digits.length > 4) formatted = digits.slice(0,2) + '/' + digits.slice(2,4) + '/' + digits.slice(4,8);
    setPlantingDateStr(formatted);
  };

  const setToday = () => {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2,'0');
    const mm = String(d.getMonth()+1).padStart(2,'0');
    const yyyy = d.getFullYear();
    setPlantingDateStr(`${dd}/${mm}/${yyyy}`);
  };

  const canSave = selectedCropId !== null && parsePlantingDate() !== null;

  const handleSave = async () => {
    const crop  = CROPS.find(c => c.id === selectedCropId);
    const date  = parsePlantingDate();
    if (!crop || !date) return;

    setSaving(true);
    try {
      const isoDate = date.toISOString().split('T')[0];
      await setActiveCrop(db, {
        crop_id:       crop.id,
        crop_name:     crop.name,
        planting_date: isoDate,
        farm_size_ha:  profile?.farm_size_ha ?? 2.4,
        budget_level:  profile?.budget_level ?? 'low',
        is_active:     1,
      });
      setActiveCropStore({
        crop_id:       crop.id,
        crop_name:     crop.name,
        planting_date: isoDate,
        farm_size_ha:  profile?.farm_size_ha ?? 2.4,
        budget_level:  profile?.budget_level ?? 'low',
        is_active:     1,
      });
      await refresh();
      onDone?.();
    } catch (e) {
      Alert.alert('Error', 'Could not save crop. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.screen}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Select your crop</Text>
        <Text style={styles.sub}>Choose the crop you are currently growing</Text>
      </View>

      {/* Type filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
        {TYPES.map(t => (
          <TouchableOpacity key={t}
            style={[styles.filterChip, typeFilter === t && styles.filterChipActive]}
            onPress={() => setTypeFilter(t)} activeOpacity={0.7}>
            <Text style={[styles.filterText, typeFilter === t && styles.filterTextActive]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Crop grid */}
      <ScrollView style={styles.cropList} showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.cropGrid}>
        {filteredCrops.map(crop => {
          const selected = selectedCropId === crop.id;
          return (
            <TouchableOpacity key={crop.id}
              style={[styles.cropCard, selected && styles.cropCardSelected]}
              onPress={() => setSelectedCropId(crop.id)} activeOpacity={0.75}>
              <Text style={styles.cropIcon}>{crop.icon}</Text>
              <Text style={[styles.cropName, selected && styles.cropNameSelected]}>
                {crop.name}
              </Text>
              {selected && <View style={styles.checkDot}><Text style={{ color: '#fff', fontSize: 10 }}>✓</Text></View>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <TextInput
          style={[styles.dateInput, { flex: 1 }, parsePlantingDate() !== null && styles.dateInputValid]}
          value={plantingDateStr}
          onChangeText={handleDateInput}
          keyboardType="numeric"
          placeholder="DD/MM/YYYY"
          placeholderTextColor={Colors.slate300}
          maxLength={10}
        />
        <TouchableOpacity
          style={{ backgroundColor: Colors.green600, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 }}
          onPress={setToday}
        >
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 13 }}>Today</Text>
        </TouchableOpacity>
      </View>
      {plantingDateStr.length === 10 && parsePlantingDate() === null && (
        <Text style={styles.dateError}>Please enter a valid date (not in the future)</Text>
      )}
      {parsePlantingDate() !== null && (
        <Text style={styles.daysNote}>
          {`This crop was planted ${Math.floor((new Date().getTime() - parsePlantingDate()!.getTime()) / (1000 * 60 * 60 * 24))} days ago`}
        </Text>
      )}
      
      {/* Save button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
          onPress={handleSave} disabled={!canSave || saving} activeOpacity={0.85}>
          <Text style={styles.saveBtnText}>
            {saving ? 'Saving...' : canSave ? `Set ${CROPS.find(c => c.id === selectedCropId)?.name} as active crop →` : 'Select crop and enter planting date'}
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.green600, padding: Spacing[4], paddingTop: 16, paddingBottom: 18 },
  title:  { fontSize: 22, fontWeight: '800', color: Colors.white, letterSpacing: -0.3 },
  sub:    { fontSize: 13, color: Colors.green200, marginTop: 3 },
  filterScroll:  { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: Colors.slate100 },
  filterContent: { paddingHorizontal: 14, paddingVertical: 10, gap: 6 },
  filterChip:    { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1.5, borderColor: Colors.slate100, backgroundColor: Colors.slate050 },
  filterChipActive: { backgroundColor: Colors.green600, borderColor: Colors.green600 },
  filterText:    { fontSize: 12, fontWeight: '500', color: Colors.slate600 },
  filterTextActive: { color: Colors.white, fontWeight: '700' },
  cropList: { flex: 1 },
  cropGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 10, gap: 8 },
  cropCard: {
    width: '30%', aspectRatio: 1,
    backgroundColor: Colors.white, borderRadius: BorderRadius.md,
    borderWidth: 1.5, borderColor: Colors.slate100,
    alignItems: 'center', justifyContent: 'center', gap: 4,
    ...Shadows.sm,
  },
  cropCardSelected: { borderColor: Colors.green600, backgroundColor: Colors.green050 },
  cropIcon:   { fontSize: 28 },
  cropName:   { fontSize: 11, fontWeight: '600', color: Colors.slate700, textAlign: 'center', paddingHorizontal: 4 },
  cropNameSelected: { color: Colors.green700 },
  checkDot:   { position: 'absolute', top: 5, right: 5, width: 16, height: 16, borderRadius: 8, backgroundColor: Colors.green600, alignItems: 'center', justifyContent: 'center' },
  dateSection: { backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.slate100, padding: Spacing[4] },
  dateLabel:  { fontSize: 14, fontWeight: '700', color: Colors.slate900, marginBottom: 3 },
  dateSub:    { fontSize: 12, color: Colors.slate400, marginBottom: 10 },
  dateInput:  { borderWidth: 1.5, borderColor: Colors.slate200, borderRadius: BorderRadius.sm, padding: 12, fontSize: 16, fontWeight: '600', color: Colors.slate900 },
  dateInputValid: { borderColor: Colors.green400 },
  dateError:  { fontSize: 12, color: Colors.red500, marginTop: 5 },
  daysNote:   { fontSize: 12, color: Colors.green600, fontWeight: '600', marginTop: 5 },
  footer:    { backgroundColor: Colors.white, padding: Spacing[4], paddingBottom: Spacing[6], borderTopWidth: 1, borderTopColor: Colors.slate100 },
  saveBtn:   { backgroundColor: Colors.green600, borderRadius: BorderRadius.md, paddingVertical: 15, alignItems: 'center', ...Shadows.sm },
  saveBtnDisabled: { backgroundColor: Colors.slate200 },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
});
