// src/screens/RealModeSetupScreen.tsx
// Switches from demo to real project mode
// Pre-filled with Eugine's details — editable before registering

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useAppStore } from '@/store';
import { saveProfile } from '@/db/database';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

const BASE_URL = 'https://mdumeni-api.onrender.com';

interface Props { onDone?: () => void; }

export function RealModeSetupScreen({ onDone }: Props) {
  const db         = useSQLiteContext();
  const setProfile = useAppStore((s) => s.setProfile);
  const setDemoMode = useAppStore((s) => s.setDemoMode);
  const storeToken  = useAppStore((s) => s.setAuthToken);

  // Pre-filled with your real details — farmer can edit before registering
  const [phone,      setPhone]      = useState('0784617009');
  const [pin,        setPin]        = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [name,       setName]       = useState('Eugine Bhebhe');
  const [province,   setProvince]   = useState('Mashonaland East');
  const [district,   setDistrict]   = useState('Marondera');
  const [farmSize,   setFarmSize]   = useState('2.4');
  const [region,     setRegion]     = useState(2);
  const [budget,     setBudget]     = useState('low');
  const [irrigation, setIrrigation] = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [mode,       setMode]       = useState<'choice' | 'register' | 'login'>('choice');

  const handleRegister = async () => {
    if (pin.length < 4) { Alert.alert('Enter a 4-digit PIN'); return; }
    if (pin !== confirmPin) { Alert.alert('PINs do not match'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number:   phone,
          pin,
          agro_region:    region,
          farm_size_ha:   parseFloat(farmSize) || 2.4,
          has_irrigation: irrigation,
          budget_level:   budget,
          province,
          district,
          language:       'english',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Already registered — try login instead
        if (res.status === 409) {
          Alert.alert(
            'Already registered',
            'This phone number is already registered. Switch to login.',
            [{ text: 'Login', onPress: () => setMode('login') }, { text: 'Cancel' }]
          );
          return;
        }
        throw new Error(data.detail ?? 'Registration failed');
      }
      await finishSetup(data);
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (pin.length < 4) { Alert.alert('Enter your 4-digit PIN'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phone, pin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? 'Login failed');
      await finishSetup(data);
    } catch (e: any) {
      Alert.alert('Login failed', e.message ?? 'Check your phone number and PIN.');
    } finally {
      setLoading(false);
    }
  };

  const finishSetup = async (data: any) => {
    storeToken(data.token, data.farmer_id);
    setDemoMode(false);
    const profile = {
      agro_region:    data.farmer?.agro_region    ?? region as 1|2|3|4|5,
      farm_size_ha:   data.farmer?.farm_size_ha   ?? parseFloat(farmSize),
      has_irrigation: data.farmer?.has_irrigation ?? irrigation,
      budget_level:   (data.farmer?.budget_level  ?? budget) as 'low'|'medium'|'high',
      language:       'english' as const,
      province:       data.farmer?.province ?? province,
      district:       data.farmer?.district ?? district,
      updated_at:     new Date().toISOString(),
    };
    await saveProfile(db, profile);
    setProfile(profile);
    Alert.alert(
      '✅ Real project activated',
      'Your farm data will now be saved to the MDUMENI server.',
      [{ text: 'Continue', onPress: onDone }]
    );
  };

  // ── Choice screen ─────────────────────────────────────────────────────────
  if (mode === 'choice') {
    return (
      <View style={s.screen}>
        <View style={s.header}>
          <Text style={s.headerTitle}>Switch to real mode</Text>
          <Text style={s.headerSub}>
            Your data will be saved to the MDUMENI server and synced across devices.
          </Text>
        </View>
        <View style={{ padding: Spacing[4], gap: 12 }}>
          <TouchableOpacity style={s.choiceBtn} onPress={() => setMode('register')} activeOpacity={0.85}>
            <Text style={s.choiceBtnIcon}>🌱</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.choiceBtnTitle}>Create new account</Text>
              <Text style={s.choiceBtnSub}>First time using MDUMENI with real data</Text>
            </View>
            <Text style={s.chevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.choiceBtn} onPress={() => setMode('login')} activeOpacity={0.85}>
            <Text style={s.choiceBtnIcon}>🔑</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.choiceBtnTitle}>Login to existing account</Text>
              <Text style={s.choiceBtnSub}>Already registered on another device</Text>
            </View>
            <Text style={s.chevron}>›</Text>
          </TouchableOpacity>
          <View style={s.warningBox}>
            <Text style={s.warningText}>
              ⚠️ Demo data (sample crops, sensor readings) will be cleared when you switch.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // ── Register / Login form ─────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView style={s.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => setMode('choice')} style={{ marginBottom: 8 }}>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>← Back</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>
          {mode === 'register' ? 'Create account' : 'Login'}
        </Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: Spacing[4], gap: 12, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled">

        <Text style={s.fieldLabel}>Phone number</Text>
        <TextInput style={s.input} value={phone} onChangeText={setPhone}
          keyboardType="phone-pad" placeholder="e.g. 0771234567"
          placeholderTextColor={Colors.slate300} />

        {mode === 'register' && (
          <>
            <Text style={s.fieldLabel}>Full name</Text>
            <TextInput style={s.input} value={name} onChangeText={setName}
              placeholder="Your name" placeholderTextColor={Colors.slate300} />

            <Text style={s.fieldLabel}>Province</Text>
            <TextInput style={s.input} value={province} onChangeText={setProvince}
              placeholder="e.g. Mashonaland East" placeholderTextColor={Colors.slate300} />

            <Text style={s.fieldLabel}>District</Text>
            <TextInput style={s.input} value={district} onChangeText={setDistrict}
              placeholder="e.g. Marondera" placeholderTextColor={Colors.slate300} />

            <Text style={s.fieldLabel}>Farm size (hectares)</Text>
            <TextInput style={s.input} value={farmSize} onChangeText={setFarmSize}
              keyboardType="decimal-pad" placeholder="e.g. 2.4"
              placeholderTextColor={Colors.slate300} />

            <Text style={s.fieldLabel}>Agro-ecological region</Text>
            <View style={s.regionRow}>
              {[1,2,3,4,5].map(r => (
                <TouchableOpacity key={r}
                  style={[s.regionBtn, region === r && s.regionBtnActive]}
                  onPress={() => setRegion(r)}>
                  <Text style={[s.regionBtnText, region === r && { color: '#fff' }]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={s.fieldLabel}>Input budget</Text>
            <View style={s.regionRow}>
              {['low','medium','high'].map(b => (
                <TouchableOpacity key={b} style={[s.regionBtn, { flex:1 }, budget === b && s.regionBtnActive]}
                  onPress={() => setBudget(b)}>
                  <Text style={[s.regionBtnText, budget === b && { color: '#fff' }]}>
                    {b.charAt(0).toUpperCase() + b.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <Text style={s.fieldLabel}>
          {mode === 'register' ? 'Choose a 4-digit PIN' : 'Your PIN'}
        </Text>
        <TextInput style={s.input} value={pin} onChangeText={v => setPin(v.replace(/\D/g,'').slice(0,4))}
          keyboardType="numeric" maxLength={4} secureTextEntry
          placeholder="••••" placeholderTextColor={Colors.slate300} />

        {mode === 'register' && (
          <>
            <Text style={s.fieldLabel}>Confirm PIN</Text>
            <TextInput style={s.input} value={confirmPin}
              onChangeText={v => setConfirmPin(v.replace(/\D/g,'').slice(0,4))}
              keyboardType="numeric" maxLength={4} secureTextEntry
              placeholder="••••" placeholderTextColor={Colors.slate300} />
            {pin.length === 4 && confirmPin.length === 4 && pin !== confirmPin && (
              <Text style={{ color: '#A32D2D', fontSize: 12 }}>PINs do not match</Text>
            )}
          </>
        )}

        <TouchableOpacity
          style={[s.submitBtn, loading && { opacity: 0.6 }]}
          onPress={mode === 'register' ? handleRegister : handleLogin}
          disabled={loading} activeOpacity={0.85}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={s.submitBtnText}>
                {mode === 'register' ? 'Create account & activate →' : 'Login & activate →'}
              </Text>
          }
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setMode(mode === 'register' ? 'login' : 'register')}
          style={{ alignItems: 'center', marginTop: 8 }}>
          <Text style={{ fontSize: 13, color: Colors.slate400 }}>
            {mode === 'register' ? 'Already have an account? Login' : 'No account? Register'}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  screen:     { flex: 1, backgroundColor: Colors.background },
  header:     { backgroundColor: '#1A5C2A', padding: Spacing[4], paddingTop: 16, paddingBottom: 20 },
  headerTitle:{ fontSize: 22, fontWeight: '700', color: '#fff' },
  headerSub:  { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 6, lineHeight: 19 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: Colors.slate600, textTransform: 'uppercase', letterSpacing: 0.04 },
  input:      { borderWidth: 1.5, borderColor: Colors.slate200, borderRadius: BorderRadius.md, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: Colors.slate900, backgroundColor: Colors.white },
  regionRow:  { flexDirection: 'row', gap: 8 },
  regionBtn:  { flex: 1, paddingVertical: 10, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.slate200, alignItems: 'center', backgroundColor: Colors.white },
  regionBtnActive: { backgroundColor: '#1A5C2A', borderColor: '#1A5C2A' },
  regionBtnText:   { fontSize: 13, fontWeight: '600', color: Colors.slate600 },
  submitBtn:  { backgroundColor: '#1A5C2A', borderRadius: BorderRadius.md, paddingVertical: 15, alignItems: 'center', ...Shadows.sm, marginTop: 8 },
  submitBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  choiceBtn:  { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.white, borderRadius: BorderRadius.lg, borderWidth: 0.5, borderColor: Colors.slate100, padding: 16, ...Shadows.sm },
  choiceBtnIcon:  { fontSize: 28 },
  choiceBtnTitle: { fontSize: 15, fontWeight: '600', color: Colors.slate900 },
  choiceBtnSub:   { fontSize: 12, color: Colors.slate400, marginTop: 2 },
  chevron:    { fontSize: 22, color: Colors.slate300 },
  warningBox: { backgroundColor: '#FAEEDA', borderRadius: BorderRadius.md, borderWidth: 0.5, borderColor: '#EF9F27', padding: 12 },
  warningText:{ fontSize: 12, color: '#633806', lineHeight: 18 },
});