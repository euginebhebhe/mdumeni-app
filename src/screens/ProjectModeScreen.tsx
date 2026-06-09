// src/screens/ProjectModeScreen.tsx
// Switches between Demo mode (pre-seeded data) and Real Project (farmer's own data)
// Demo mode shows a badge everywhere and uses fixed demo readings
// Real mode goes through onboarding to collect actual farm data

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useAppStore } from '@/store';
import { useProjectMode } from '@/hooks/useProjectMode';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

interface Props { onStartReal?: () => void; onDone?: () => void; }

export function ProjectModeScreen({ onStartReal, onDone }: Props) {
  const { isDemoMode, switchToDemo, switchToReal } = useProjectMode();
  const [loading, setLoading] = useState(false);

  const handleStartReal = async () => {
    Alert.alert(
      'Start real project',
      'This will clear the demo data and take you through setup for your real farm. Your demo session can be restored any time.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start real project',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            switchToReal();
            setLoading(false);
            onStartReal?.();
          },
        },
      ]
    );
  };

  const handleRestoreDemo = async () => {
    setLoading(true);
    await switchToDemo();
    setLoading(false);
    onDone?.();
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 40 }}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Project mode</Text>
        <Text style={styles.sub}>Choose how you want to use MDUMENI</Text>
      </View>

      {/* Current mode indicator */}
      <View style={styles.currentMode}>
        <View style={[styles.modeDot, { backgroundColor: isDemoMode ? Colors.amber500 : Colors.green600 }]} />
        <Text style={styles.currentLabel}>
          Currently: <Text style={{ fontWeight: '700', color: isDemoMode ? Colors.amber700 : Colors.green600 }}>
            {isDemoMode ? 'Demo mode' : 'Real project'}
          </Text>
        </Text>
      </View>

      {/* Demo card */}
      <View style={[styles.modeCard, isDemoMode && styles.modeCardActive]}>
        <View style={styles.modeCardHeader}>
          <View style={[styles.modeIcon, { backgroundColor: Colors.amber100 }]}>
            <Text style={{ fontSize: 24 }}>🧪</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.modeTitle}>Demo mode</Text>
            <Text style={styles.modeSub}>Pre-loaded farm · pH 5.1 · 2.4 ha · Region II · Maize Day 35</Text>
          </View>
          {isDemoMode && <View style={styles.activeBadge}><Text style={styles.activeBadgeText}>ACTIVE</Text></View>}
        </View>
        <View style={styles.modeFeatures}>
          {[
            'All AI engines running on demo data',
            'Calendar pre-set to Day 35 of Maize season',
            'Demo sensor readings (pH 5.1, moisture 62%)',
            'Perfect for demonstrations and exhibitions',
            'Clearly labelled — no confusion with real data',
          ].map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureDot}>•</Text>
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>
        {!isDemoMode && (
          <TouchableOpacity style={styles.demoBtn} onPress={handleRestoreDemo}
            disabled={loading} activeOpacity={0.85}>
            <Text style={styles.demoBtnText}>{loading ? 'Switching...' : 'Switch to demo mode'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Real project card */}
      <View style={[styles.modeCard, !isDemoMode && styles.modeCardActive]}>
        <View style={styles.modeCardHeader}>
          <View style={[styles.modeIcon, { backgroundColor: Colors.green050 }]}>
            <Text style={{ fontSize: 24 }}>🌱</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.modeTitle}>Real project</Text>
            <Text style={styles.modeSub}>Your actual farm · Real soil readings · Real crops</Text>
          </View>
          {!isDemoMode && <View style={[styles.activeBadge, { backgroundColor: Colors.green600 }]}><Text style={styles.activeBadgeText}>ACTIVE</Text></View>}
        </View>
        <View style={styles.modeFeatures}>
          {[
            'Set up your real farm: province, region, hectares',
            'Enter or receive actual soil sensor readings',
            'Track real crops with real planting dates',
            'AI recommendations for your actual conditions',
            'Data persists between sessions',
          ].map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureDot}>•</Text>
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>
        {isDemoMode && (
          <TouchableOpacity style={styles.realBtn} onPress={handleStartReal}
            disabled={loading} activeOpacity={0.85}>
            <Text style={styles.realBtnText}>
              {loading ? 'Switching...' : 'Start my real project →'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Info */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          You can switch between Demo and Real project at any time from Settings. Your real farm data is stored separately and is never overwritten by demo mode.
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.green600, padding: Spacing[4], paddingTop: 16, paddingBottom: 18 },
  title:  { fontSize: 22, fontWeight: '800', color: Colors.white, letterSpacing: -0.3 },
  sub:    { fontSize: 13, color: Colors.green200, marginTop: 3 },
  currentMode: { flexDirection: 'row', alignItems: 'center', gap: 8, margin: Spacing[4], padding: 12, backgroundColor: Colors.white, borderRadius: BorderRadius.sm, borderWidth: 1, borderColor: Colors.slate100 },
  modeDot:     { width: 10, height: 10, borderRadius: 5 },
  currentLabel: { fontSize: 14, color: Colors.slate600 },
  modeCard:    { marginHorizontal: Spacing[4], marginBottom: 12, backgroundColor: Colors.white, borderRadius: BorderRadius.lg, borderWidth: 1.5, borderColor: Colors.slate100, padding: Spacing[4], ...Shadows.sm },
  modeCardActive: { borderColor: Colors.green400 },
  modeCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  modeIcon:    { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  modeTitle:   { fontSize: 16, fontWeight: '700', color: Colors.slate900 },
  modeSub:     { fontSize: 11, color: Colors.slate400, marginTop: 2, lineHeight: 15 },
  activeBadge: { backgroundColor: Colors.amber500, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  activeBadgeText: { fontSize: 10, fontWeight: '700', color: Colors.white },
  modeFeatures: { gap: 6, marginBottom: 14 },
  featureRow:   { flexDirection: 'row', gap: 8 },
  featureDot:   { color: Colors.green600, fontWeight: '700', lineHeight: 18 },
  featureText:  { fontSize: 13, color: Colors.slate600, flex: 1, lineHeight: 18 },
  demoBtn:      { backgroundColor: Colors.amber500, borderRadius: BorderRadius.md, paddingVertical: 12, alignItems: 'center' },
  demoBtnText:  { fontSize: 14, fontWeight: '700', color: Colors.white },
  realBtn:      { backgroundColor: Colors.green600, borderRadius: BorderRadius.md, paddingVertical: 12, alignItems: 'center', ...Shadows.sm },
  realBtnText:  { fontSize: 14, fontWeight: '700', color: Colors.white },
  infoBox:      { margin: Spacing[4], padding: 12, backgroundColor: Colors.slate050, borderRadius: BorderRadius.sm, borderWidth: 1, borderColor: Colors.slate100 },
  infoText:     { fontSize: 12, color: Colors.blue500, lineHeight: 18 },
});
