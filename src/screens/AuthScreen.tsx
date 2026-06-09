// src/screens/AuthScreen.tsx
// Farmer registration and login — phone number + 4-digit PIN
// No SMS needed — farmer remembers their PIN like a bank card
// On success: stores token + farmer_id in SQLite, enters main app

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator,Image,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useAppStore } from '@/store';
import { saveProfile, setActiveCrop as dbSetCrop } from '@/db/database';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

const API_BASE = 'https://fhvsoqphnytsbzipqjsb.supabase.co'; // replaced by Render URL at runtime

async function apiCall(path: string, body: object) {
  // Use Render server not Supabase directly — goes through FastAPI
  const BASE = (globalThis as any).MDUMENI_API_URL ?? 'https://mdumeni-api.onrender.com';
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 20_000);
  try {
    const res  = await fetch(`${BASE}${path}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
      signal:  controller.signal,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail ?? 'Request failed');
    return data;
  } finally {
    clearTimeout(id);
  }
}

// ── PIN pad ────────────────────────────────────────────────────────────────────
function PinInput({ value, onChange, label }: {
  value: string; onChange: (v: string) => void; label: string;
}) {
  const inputRef = React.useRef<TextInput>(null);

  return (
    <View style={pinStyles.wrap}>
      <Text style={pinStyles.label}>{label}</Text>
      <TouchableOpacity
        style={pinStyles.dotsRow}
        onPress={() => inputRef.current?.focus()}
        activeOpacity={1}
      >
        {[0, 1, 2, 3].map(i => (
          <View key={i} style={[pinStyles.dot, value.length > i && pinStyles.dotFilled]}>
            {value.length > i && (
              <View style={pinStyles.dotInner} />
            )}
          </View>
        ))}
      </TouchableOpacity>
      <TextInput
        ref={inputRef}
        style={pinStyles.hiddenInput}
        value={value}
        onChangeText={v => onChange(v.replace(/\D/g, '').slice(0, 4))}
        keyboardType="numeric"
        maxLength={4}
        secureTextEntry
        caretHidden
      />
    </View>
  );
}

// ── Main screen ────────────────────────────────────────────────────────────────
interface Props {
  onSuccess: (farmerId: string, token: string) => void;
}

export function AuthScreen({ onSuccess }: Props) {
  const db          = useSQLiteContext();
  const setProfile  = useAppStore((s) => s.setProfile);
  const setActive   = useAppStore((s) => s.setActiveCrop);
  const setSensor   = useAppStore((s) => s.setSensorReading);
  const setDemoMode = useAppStore((s) => s.setDemoMode);
  const storeToken  = useAppStore((s) => s.setAuthToken);

  const [name,    setName]    = useState('');
  const [mode,    setMode]    = useState<'welcome' | 'login' | 'register'>('welcome');
  const [phone,   setPhone]   = useState('');
  const [pin,     setPin]     = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [step,    setStep]    = useState<'phone' | 'pin'>('phone');

  // Registration fields
  const [region,     setRegion]     = useState(2);
  const [farmSize,   setFarmSize]   = useState('2.4');
  const [irrigation, setIrrigation] = useState(false);
  const [budget,     setBudget]     = useState('low');
  const [province,   setProvince]   = useState('');
  const [district,   setDistrict]   = useState('');

  const phoneValid = phone.replace(/\D/g, '').length >= 9;

  const handleLogin = async () => {
    if (!phoneValid || pin.length < 4) return;
    setLoading(true);
    try {
      const data = await apiCall('/auth/login', { phone_number: phone, pin });

      // Store token
      storeToken(data.token, data.farmer_id);
      setDemoMode(false);

      // Hydrate store from server response
      if (data.farmer) {
        const profile = {
          agro_region:    data.farmer.agro_region    as 1|2|3|4|5,
          farm_size_ha:   data.farmer.farm_size_ha,
          has_irrigation: data.farmer.has_irrigation,
          budget_level:   data.farmer.budget_level   as 'low'|'medium'|'high',
          language:       data.farmer.language        as 'english'|'shona'|'ndebele',
          province:       data.farmer.province ?? '',
          district:       data.farmer.district ?? '',
          updated_at:     new Date().toISOString(),
        };
        await saveProfile(db, profile);
        setProfile(profile);
      }

      if (data.active_crop) {
        await dbSetCrop(db, {
          crop_id:       data.active_crop.crop_id,
          crop_name:     data.active_crop.crop_name,
          planting_date: data.active_crop.planting_date,
          farm_size_ha:  data.active_crop.farm_size_ha ?? 2.4,
          budget_level:  data.active_crop.budget_level ?? 'low',
          is_active:     1,
        });
        setActive(data.active_crop);
      }

      if (data.latest_reading) {
        setSensor({
          id:          data.latest_reading.id,
          device_id:   data.latest_reading.device_id,
          soil_ph:     data.latest_reading.soil_ph,
          moisture_pct: data.latest_reading.moisture_pct,
          temp_c:      data.latest_reading.temp_c,
          battery_pct: data.latest_reading.battery_pct ?? 100,
          recorded_at: data.latest_reading.recorded_at,
          is_synced:   1,
        });
      }

      onSuccess(data.farmer_id, data.token);
    } catch (e: any) {
      Alert.alert('Login failed', e.message ?? 'Check your phone number and PIN');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!phoneValid || pin.length < 4) return;
    if (pin !== confirm) {
      Alert.alert('PINs do not match', 'Enter the same PIN twice to confirm.');
      return;
    }
    setLoading(true);
    try {
      const data = await apiCall('/auth/register', {
        phone_number:   phone,
        pin,
        agro_region:    region,
        farm_size_ha:   parseFloat(farmSize) || 2.4,
        has_irrigation: irrigation,
        budget_level:   budget,
        province,
        district,
        name,
      });

      storeToken(data.token, data.farmer_id);
      setDemoMode(false);

      const profile = {
        agro_region:    region as 1|2|3|4|5,
        farm_size_ha:   parseFloat(farmSize) || 2.4,
        has_irrigation: irrigation,
        budget_level:   budget as 'low'|'medium'|'high',
        language:       'english' as const,
        province, district,
        updated_at: new Date().toISOString(),
      };
      await saveProfile(db, profile);
      setProfile(profile);

      onSuccess(data.farmer_id, data.token);
    } catch (e: any) {
      Alert.alert('Registration failed', e.message ?? 'Try again');
    } finally {
      setLoading(false);
    }
  };

  // ── Welcome screen ────────────────────────────────────────────────────────
  if (mode === 'welcome') {
    return (
      <View style={styles.screen}>
        <View style={styles.hero}>
          <View style={styles.logoBox}>
            <Image
              source={require('../../assets/icon.png')}
              style={{
                width: 82,
                height: 87,
              }}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.logoText}>MDU<Text style={{ color: Colors.amber500 }}>MENI</Text></Text>
          <Text style={styles.logoSub}>Your digital farming guide</Text>
        </View>

        <View style={styles.welcomeBody}>
          <Text style={styles.welcomeTitle}>Save your farm data</Text>
          <Text style={styles.welcomeDesc}>
            Create an account so your crop history, soil readings, and AI recommendations
            are saved — even if you change phones.
          </Text>
          <Text style={styles.welcomeDesc}>
            No email needed. Just your phone number and a 4-digit PIN.
          </Text>
        </View>

        <View style={styles.welcomeFooter}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => setMode('register')} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>Create account →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => setMode('login')} activeOpacity={0.8}>
            <Text style={styles.secondaryBtnText}>I already have an account</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSuccess('demo', '')} style={{ marginTop: 16 }} activeOpacity={0.7}>
            <Text style={styles.skipText}>Skip — use demo mode</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Login ─────────────────────────────────────────────────────────────────
  if (mode === 'login') {
    return (
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.formHeader}>
          <TouchableOpacity onPress={() => setMode('welcome')} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.formTitle}>Login</Text>
        </View>
        <ScrollView contentContainerStyle={styles.formBody}>
          <Text style={styles.fieldLabel}>Phone number</Text>
          <TextInput
            style={styles.input} value={phone} onChangeText={setPhone}
            keyboardType="phone-pad" placeholder="e.g. 0771234567"
            placeholderTextColor={Colors.slate300}
          />
          <PinInput value={pin} onChange={setPin} label="Your 4-digit PIN" />

          <TouchableOpacity
            style={[styles.primaryBtn, (!phoneValid || pin.length < 4 || loading) && styles.btnDisabled]}
            onPress={handleLogin} disabled={!phoneValid || pin.length < 4 || loading}
            activeOpacity={0.85}>
            {loading
              ? <ActivityIndicator color={Colors.white} />
              : <Text style={styles.primaryBtnText}>Login →</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setMode('register')} style={{ marginTop: 16, alignItems: 'center' }}>
            <Text style={styles.skipText}>No account yet? Register</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // ── Register ──────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.formHeader}>
        <TouchableOpacity onPress={() => setMode('welcome')} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.formTitle}>Create account</Text>
      </View>
      <ScrollView contentContainerStyle={styles.formBody} keyboardShouldPersistTaps="handled">

        <Text style={styles.sectionLabel}>Full name</Text>
        <TextInput
          style={styles.input} value={name} onChangeText={setName}
          placeholder="e.g. John Doe"
          placeholderTextColor={Colors.slate300} />
        <Text style={styles.sectionLabel}>Phone number</Text>
        <TextInput
          style={styles.input} value={phone} onChangeText={setPhone}
          keyboardType="phone-pad" placeholder="e.g. 0771234567"
          placeholderTextColor={Colors.slate300}
        />

        <PinInput value={pin} onChange={setPin} label="Choose a 4-digit PIN" />
        <PinInput value={confirm} onChange={setConfirm} label="Confirm your PIN" />
        {pin.length === 4 && confirm.length === 4 && pin !== confirm && (
          <Text style={{ color: Colors.red500, fontSize: 12, marginBottom: 10 }}>PINs do not match</Text>
        )}

        <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Province & District (optional)</Text>
        <TextInput style={styles.input} value={province} onChangeText={setProvince}
          placeholder="Province e.g. Mashonaland East" placeholderTextColor={Colors.slate300} />
        <TextInput style={styles.input} value={district} onChangeText={setDistrict}
          placeholder="District e.g. Marondera" placeholderTextColor={Colors.slate300} />

        <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Agro-region (1–5)</Text>
        <View style={styles.regionRow}>
          {[1,2,3,4,5].map(r => (
            <TouchableOpacity key={r} style={[styles.regionBtn, region === r && styles.regionBtnActive]}
              onPress={() => setRegion(r)}>
              <Text style={[styles.regionBtnText, region === r && styles.regionBtnTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Farm size (ha)</Text>
        <TextInput style={styles.input} value={farmSize} onChangeText={setFarmSize}
          keyboardType="decimal-pad" placeholder="e.g. 2.4" placeholderTextColor={Colors.slate300} />

        <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Budget level</Text>
        <View style={styles.regionRow}>
          {['low','medium','high'].map(b => (
            <TouchableOpacity key={b} style={[styles.regionBtn, { flex: 1 }, budget === b && styles.regionBtnActive]}
              onPress={() => setBudget(b)}>
              <Text style={[styles.regionBtnText, budget === b && styles.regionBtnTextActive]}>
                {b.charAt(0).toUpperCase() + b.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.primaryBtn, { marginTop: 24 },
            (!phoneValid || pin.length < 4 || pin !== confirm || loading) && styles.btnDisabled]}
          onPress={handleRegister}
          disabled={!phoneValid || pin.length < 4 || pin !== confirm || loading}
          activeOpacity={0.85}>
          {loading
            ? <ActivityIndicator color={Colors.white} />
            : <Text style={styles.primaryBtnText}>Create account →</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMode('login')} style={{ marginTop: 16, alignItems: 'center' }}>
          <Text style={styles.skipText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: Colors.green050 },
  hero:        { alignItems: 'center', paddingTop: 60, paddingBottom: 30 },
  logoBox:     { width: 80, height: 80, backgroundColor: Colors.white, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 14, ...Shadows.md, borderWidth: 2, borderColor: Colors.amber400 },
  logoText:    { fontSize: 40, fontWeight: '800', color: Colors.green700, letterSpacing: -1 },
  logoSub:     { fontSize: 16, color: Colors.slate400, marginTop: 4 },
  welcomeBody: { paddingHorizontal: Spacing[6], flex: 1 },
  welcomeTitle: { fontSize: 22, fontWeight: '700', color: Colors.slate900, marginBottom: 12 },
  welcomeDesc:  { fontSize: 14, color: Colors.slate300, lineHeight: 22, marginBottom: 10 },
  welcomeFooter: { padding: Spacing[4], paddingBottom: 40 },
  formHeader:  { flexDirection: 'row', alignItems: 'center', gap: 10, padding: Spacing[4], paddingTop: 50, borderBottomWidth: 1, borderBottomColor: Colors.slate100 },
  backBtn:     { padding: 4 },
  backBtnText: { fontSize: 15, color: Colors.blue500 },
  formTitle:   { fontSize: 20, fontWeight: '700', color: Colors.slate900 },
  formBody:    { padding: Spacing[4], paddingBottom: 40 },
  fieldLabel:  { fontSize: 13, fontWeight: '600', color: Colors.slate700, marginBottom: 6 },
  sectionLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.04, textTransform: 'uppercase', color: Colors.slate400, marginBottom: 8 },
  input:       { borderWidth: 1.5, borderColor: Colors.slate200, borderRadius: BorderRadius.sm, padding: 13, fontSize: 16, color: Colors.slate900, marginBottom: 12 },
  primaryBtn:  { backgroundColor: Colors.green600, borderRadius: BorderRadius.md, paddingVertical: 15, alignItems: 'center', ...Shadows.sm },
  secondaryBtn: { backgroundColor: Colors.white, borderRadius: BorderRadius.md, paddingVertical: 14, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.green600, marginTop: 10 },
  primaryBtnText:  { fontSize: 16, fontWeight: '700', color: Colors.white },
  secondaryBtnText: { fontSize: 15, fontWeight: '600', color: Colors.green600 },
  btnDisabled: { backgroundColor: Colors.slate200 },
  skipText:    { fontSize: 14, color: Colors.slate400, textAlign: 'center' },
  regionRow:   { flexDirection: 'row', gap: 8 },
  regionBtn:   { flex: 1, paddingVertical: 10, borderRadius: BorderRadius.sm, borderWidth: 1.5, borderColor: Colors.slate200, alignItems: 'center' },
  regionBtnActive: { backgroundColor: Colors.green600, borderColor: Colors.green600 },
  regionBtnText:   { fontSize: 14, fontWeight: '600', color: Colors.slate600 },
  regionBtnTextActive: { color: Colors.white },
});

const pinStyles = StyleSheet.create({
  wrap:     { marginBottom: 20 },
  label:    { fontSize: 13, fontWeight: '600', color: Colors.slate700, marginBottom: 12 },
  dotsRow:  { flexDirection: 'row', gap: 16, justifyContent: 'center',
              paddingVertical: 16, borderWidth: 1.5, borderColor: Colors.slate200,
              borderRadius: 12, backgroundColor: Colors.slate050 },
  dot:      { width: 20, height: 20, borderRadius: 10,
              borderWidth: 2, borderColor: Colors.slate300,
              alignItems: 'center', justifyContent: 'center' },
  dotFilled: { backgroundColor: Colors.green600, borderColor: Colors.green600 },
  dotInner:  { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  hiddenInput: { position: 'absolute', opacity: 0, height: 1, width: 1 },
});

export default AuthScreen;