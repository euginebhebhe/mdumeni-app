// src/screens/ProfileEditScreen.tsx
// Edit farm profile — all fields that drive AI recommendations
// Changes save to SQLite immediately and trigger a session refresh

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Switch, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useAppStore } from '@/store';
import { saveProfile } from '@/db/database';
import { useSession } from '@/hooks/useSession';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import type { BudgetLevel } from '@/types';

const PROVINCES: Record<string, string[]> = {
  'Harare':              ['Harare', 'Chitungwiza', 'Epworth', 'Ruwa', 'Mbare', 'Glen Norah', 'Glen View', 'Budiriro', 'Highfield', 'Hatfield'],
  'Bulawayo':            ['Bulawayo', 'Esigodini', 'Khami', 'Lobengula', 'Mabutweni', 'Mpopoma', 'Pelandaba', 'Nkulumane','Cowdray Park','Makokoba','West Somerton'],
  'Manicaland':          ['Mutare', 'Chipinge', 'Chimanimani', 'Mutasa', 'Nyanga', 'Makoni', 'Buhera'],
  'Mashonaland Central': ['Bindura', 'Mazowe', 'Centenary', 'Guruve', 'Mount Darwin', 'Rushinga', 'Shamva'],
  'Mashonaland East':    ['Marondera', 'Goromonzi', 'Hwedza', 'Mudzi', 'Murehwa', 'Mutoko', 'Seke', 'UMP'],
  'Mashonaland West':    ['Chinhoyi', 'Chegutu', 'Hurungwe', 'Kadoma', 'Kariba', 'Makonde', 'Zvimba'],
  'Masvingo':            ['Masvingo', 'Bikita', 'Chiredzi', 'Chivi', 'Gutu', 'Mwenezi', 'Zaka'],
  'Matabeleland North':  ['Binga', 'Bubi', 'Hwange', 'Lupane', 'Nkayi', 'Tsholotsho', 'Umguza'],
  'Matabeleland South':  ['Bulilima', 'Gwanda', 'Insiza', 'Mangwe', 'Matobo', 'Umzingwane'],
  'Midlands':            ['Gweru', 'Chirumanzu', 'Gokwe North', 'Gokwe South', 'Kwekwe', 'Mberengwa', 'Shurugwi', 'Zvishavane'],
};

const REGIONS = [
  { num: 1, label: 'Region I — Highveld (1000mm+)' },
  { num: 2, label: 'Region II — Intensive Cropping (750–1000mm)' },
  { num: 3, label: 'Region III — Semi-Intensive (650–800mm)' },
  { num: 4, label: 'Region IV — Semi-Arid (450–650mm)' },
  { num: 5, label: 'Region V — Arid (under 450mm)' },
];

const BUDGETS: { key: BudgetLevel; label: string; desc: string }[] = [
  { key: 'low',    label: 'Low input',    desc: 'OPV seeds, organic fertiliser. Under $300/ha.' },
  { key: 'medium', label: 'Medium input', desc: 'Hybrid seeds, compound fertiliser. $300–600/ha.' },
  { key: 'high',   label: 'High input',   desc: 'Premium hybrid, full fertiliser. Over $600/ha.' },
];

interface Props { onDone?: () => void; }

export function ProfileEditScreen({ onDone }: Props) {
  const db           = useSQLiteContext();
  const profile      = useAppStore((s) => s.profile);
  const updateProfile = useAppStore((s) => s.updateProfile);
  const { refresh }  = useSession();

  const [province,   setProvince]   = useState(profile?.province ?? '');
  const [district,   setDistrict]   = useState(profile?.district ?? '');
  const [region,     setRegion]     = useState<number>(profile?.agro_region ?? 2);
  const [farmSize,   setFarmSize]   = useState(String(profile?.farm_size_ha ?? ''));
  const [irrigation, setIrrigation] = useState(profile?.has_irrigation ?? false);
  const [budget,     setBudget]     = useState<BudgetLevel>(profile?.budget_level ?? 'low');
  const [saving,     setSaving]     = useState(false);
  const [step,       setStep]       = useState<'location' | 'farm'>('location');

  const farmSizeValid = !isNaN(parseFloat(farmSize)) && parseFloat(farmSize) > 0;
  const canSave = province && district && region && farmSizeValid;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      const updated = {
        agro_region:    region as 1|2|3|4|5,
        farm_size_ha:   parseFloat(farmSize),
        has_irrigation: irrigation,
        budget_level:   budget,
        language:       (profile?.language ?? 'english') as any,
        province, district,
        updated_at: new Date().toISOString(),
      };
      await saveProfile(db, updated);
      updateProfile(updated);
      await refresh();
      onDone?.();
    } catch {
      Alert.alert('Error', 'Could not save profile. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const provinces = Object.keys(PROVINCES);
  const districts = province ? PROVINCES[province] ?? [] : [];

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}>

        <View style={styles.header}>
          <Text style={styles.title}>Edit farm profile</Text>
          <Text style={styles.sub}>Changes update all AI recommendations instantly</Text>
        </View>

        {/* Step tabs */}
        <View style={styles.tabs}>
          {(['location', 'farm'] as const).map(t => (
            <TouchableOpacity key={t} style={[styles.tab, step === t && styles.tabActive]} onPress={() => setStep(t)}>
              <Text style={[styles.tabText, step === t && styles.tabTextActive]}>
                {t === 'location' ? '📍 Location' : '🌾 Farm details'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {step === 'location' && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Province</Text>
            <View style={styles.optionList}>
              {provinces.map(p => (
                <TouchableOpacity key={p} style={[styles.optRow, province === p && styles.optRowActive]}
                  onPress={() => { setProvince(p); setDistrict(''); }} activeOpacity={0.7}>
                  <Text style={[styles.optText, province === p && styles.optTextActive]}>{p}</Text>
                  {province === p && <Text style={{ color: Colors.green600 }}>✓</Text>}
                </TouchableOpacity>
              ))}
            </View>

            {province !== '' && (
              <>
                <Text style={[styles.sectionLabel, { marginTop: 16 }]}>District</Text>
                <View style={styles.optionList}>
                  {districts.map(d => (
                    <TouchableOpacity key={d} style={[styles.optRow, district === d && styles.optRowActive]}
                      onPress={() => setDistrict(d)} activeOpacity={0.7}>
                      <Text style={[styles.optText, district === d && styles.optTextActive]}>{d}</Text>
                      {district === d && <Text style={{ color: Colors.green600 }}>✓</Text>}
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Agro-ecological region</Text>
            {REGIONS.map(r => (
              <TouchableOpacity key={r.num} style={[styles.optRow, region === r.num && styles.optRowActive]}
                onPress={() => setRegion(r.num)} activeOpacity={0.7}>
                <Text style={[styles.optText, region === r.num && styles.optTextActive]}>{r.label}</Text>
                {region === r.num && <Text style={{ color: Colors.green600 }}>✓</Text>}
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={[styles.nextBtn, (!province || !district) && styles.nextBtnDisabled]}
              onPress={() => setStep('farm')} disabled={!province || !district} activeOpacity={0.85}>
              <Text style={styles.nextBtnText}>Next — Farm details →</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 'farm' && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Farm size (hectares)</Text>
            <TextInput
              style={styles.sizeInput} value={farmSize} onChangeText={setFarmSize}
              keyboardType="decimal-pad" placeholder="e.g. 2.4"
              placeholderTextColor={Colors.slate300} maxLength={6}
            />

            <View style={styles.irrigRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.irrigTitle}>Irrigation available</Text>
                <Text style={styles.irrigSub}>{irrigation ? 'Irrigation crops recommended' : 'Rain-fed crops only'}</Text>
              </View>
              <Switch value={irrigation} onValueChange={setIrrigation}
                trackColor={{ false: Colors.slate200, true: Colors.green600 }}
                thumbColor={Colors.white} />
            </View>

            <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Input budget level</Text>
            {BUDGETS.map(b => (
              <TouchableOpacity key={b.key} style={[styles.optRow, budget === b.key && styles.optRowActive]}
                onPress={() => setBudget(b.key)} activeOpacity={0.7}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.optText, budget === b.key && styles.optTextActive]}>{b.label}</Text>
                  <Text style={styles.optDesc}>{b.desc}</Text>
                </View>
                {budget === b.key && <Text style={{ color: Colors.green600 }}>✓</Text>}
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={[styles.saveBtn, (!canSave || saving) && styles.nextBtnDisabled]}
              onPress={handleSave} disabled={!canSave || saving} activeOpacity={0.85}>
              <Text style={styles.nextBtnText}>
                {saving ? 'Saving...' : 'Save profile →'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen:  { flex: 1, backgroundColor: Colors.background },
  header:  { backgroundColor: Colors.green600, padding: Spacing[4], paddingTop: 16, paddingBottom: 18 },
  title:   { fontSize: 22, fontWeight: '800', color: Colors.white, letterSpacing: -0.3 },
  sub:     { fontSize: 13, color: Colors.green200, marginTop: 3 },
  tabs:    { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Colors.slate100 },
  tab:     { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: Colors.green600 },
  tabText: { fontSize: 13, color: Colors.slate400, fontWeight: '500' },
  tabTextActive: { color: Colors.green600, fontWeight: '700' },
  section: { padding: Spacing[4] },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.05, textTransform: 'uppercase', color: Colors.slate400, marginBottom: 8 },
  optionList: {},
  optRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 14, backgroundColor: Colors.white, borderRadius: BorderRadius.sm, marginBottom: 6, borderWidth: 1.5, borderColor: Colors.slate100 },
  optRowActive: { borderColor: Colors.green400, backgroundColor: Colors.green050 },
  optText: { fontSize: 14, color: Colors.slate700 },
  optTextActive: { color: Colors.green700, fontWeight: '600' },
  optDesc: { fontSize: 11, color: Colors.slate400, marginTop: 1 },
  sizeInput: { borderWidth: 1.5, borderColor: Colors.slate200, borderRadius: BorderRadius.sm, padding: 12, fontSize: 22, fontWeight: '700', color: Colors.slate900, marginBottom: 14, textAlign: 'center' },
  irrigRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: BorderRadius.sm, padding: 14, borderWidth: 1.5, borderColor: Colors.slate100, marginBottom: 6 },
  irrigTitle: { fontSize: 14, fontWeight: '600', color: Colors.slate900 },
  irrigSub:   { fontSize: 12, color: Colors.slate400, marginTop: 2 },
  nextBtn:    { marginTop: 20, backgroundColor: Colors.green600, borderRadius: BorderRadius.md, paddingVertical: 14, alignItems: 'center', ...Shadows.sm },
  nextBtnDisabled: { backgroundColor: Colors.slate200 },
  nextBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
  saveBtn:    { marginTop: 20, backgroundColor: Colors.green600, borderRadius: BorderRadius.md, paddingVertical: 14, alignItems: 'center', ...Shadows.sm },
});
