// src/components/ManualSensorInput.tsx
// Modal for entering soil readings manually when no ESP32 sensor is paired
// Saves to SQLite → updates Zustand → triggers /session refresh
// Used from Settings screen and from the sensor pill on Dashboard

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/store';
import { insertReading } from '@/db/database';
import { useSession } from '@/hooks/useSession';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

// ── Guidance ranges for visual feedback ───────────────────────────────────────
const PH_RANGES = [
  { min: 0,   max: 5.0, label: 'Very acidic',   color: '#DC3545' },
  { min: 5.0, max: 5.5, label: 'Acidic',         color: '#EF9F27' },
  { min: 5.5, max: 6.5, label: 'Ideal for most crops', color: '#1A5C2A' },
  { min: 6.5, max: 7.5, label: 'Neutral — good', color: '#237533' },
  { min: 7.5, max: 14,  label: 'Alkaline',       color: '#EF9F27' },
];

const MOISTURE_RANGES = [
  { min: 0,  max: 30,  label: 'Too dry — irrigation needed', color: '#DC3545' },
  { min: 30, max: 40,  label: 'Low — monitor closely',       color: '#EF9F27' },
  { min: 40, max: 80,  label: 'Good — adequate moisture',    color: '#1A5C2A' },
  { min: 80, max: 100, label: 'Waterlogged — drainage needed', color: '#EF9F27' },
];

const TEMP_RANGES = [
  { min: 0,  max: 15, label: 'Cold — limits germination', color: '#2563EB' },
  { min: 15, max: 18, label: 'Cool — some crops only',    color: '#0ea5e9' },
  { min: 18, max: 30, label: 'Ideal for most crops',      color: '#1A5C2A' },
  { min: 30, max: 35, label: 'Warm — drought stress risk',color: '#EF9F27' },
  { min: 35, max: 60, label: 'Too hot — crop stress',     color: '#DC3545' },
];

function getRangeInfo(value: number, ranges: typeof PH_RANGES) {
  return ranges.find((r) => value >= r.min && value < r.max) ?? ranges[ranges.length - 1];
}

// ── Single reading input field ─────────────────────────────────────────────────
interface ReadingFieldProps {
  label:       string;
  unit:        string;
  value:       string;
  onChange:    (v: string) => void;
  min:         number;
  max:         number;
  step:        number;
  placeholder: string;
  hint:        string;
  ranges:      typeof PH_RANGES;
}

function ReadingField({
  label, unit, value, onChange,
  min, max, step, placeholder, hint, ranges,
}: ReadingFieldProps) {
  const num     = parseFloat(value);
  const isValid = !isNaN(num) && num >= min && num <= max;
  const info    = isValid ? getRangeInfo(num, ranges) : null;

  // Quick increment / decrement
  const adjust = (delta: number) => {
    const current = isNaN(num) ? (min + max) / 2 : num;
    const next    = Math.max(min, Math.min(max, parseFloat((current + delta).toFixed(1))));
    onChange(String(next));
  };

  return (
    <View style={fieldStyles.wrap}>
      <View style={fieldStyles.header}>
        <Text style={fieldStyles.label}>{label}</Text>
        <Text style={fieldStyles.unit}>{unit}</Text>
      </View>

      <View style={fieldStyles.inputRow}>
        <TouchableOpacity style={fieldStyles.adjBtn} onPress={() => adjust(-step)} activeOpacity={0.7}>
          <Text style={fieldStyles.adjText}>−</Text>
        </TouchableOpacity>

        <TextInput
          style={[fieldStyles.input, value !== '' && !isValid && fieldStyles.inputError]}
          value={value}
          onChangeText={onChange}
          keyboardType="decimal-pad"
          placeholder={placeholder}
          placeholderTextColor={Colors.slate300}
          maxLength={6}
          textAlign="center"
        />

        <TouchableOpacity style={fieldStyles.adjBtn} onPress={() => adjust(step)} activeOpacity={0.7}>
          <Text style={fieldStyles.adjText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Status bar */}
      <View style={fieldStyles.statusBar}>
        <View style={[fieldStyles.statusDot, { backgroundColor: info?.color ?? Colors.slate200 }]} />
        <Text style={[fieldStyles.statusText, { color: info?.color ?? Colors.slate400 }]}>
          {info ? info.label : value !== '' && !isValid ? `Enter ${min}–${max}` : hint}
        </Text>
      </View>

      {/* Visual scale */}
      <View style={fieldStyles.scaleTrack}>
        {isValid && (
          <View style={[
            fieldStyles.scaleFill,
            {
              width: `${((num - min) / (max - min)) * 100}%` as `${number}%`,
              backgroundColor: info?.color ?? Colors.green400,
            },
          ]} />
        )}
      </View>
    </View>
  );
}

// ── Main modal ─────────────────────────────────────────────────────────────────
interface ManualSensorInputProps {
  visible:   boolean;
  onClose:   () => void;
}

export function ManualSensorInput({ visible, onClose }: ManualSensorInputProps) {
  const insets  = useSafeAreaInsets();
  const db      = useSQLiteContext();
  const { refresh } = useSession();

  const setSensor  = useAppStore((s) => s.setSensorReading);
  const sensor     = useAppStore((s) => s.sensorReading);

  // Pre-fill with last known values if available
  const [ph,       setPh]       = useState(sensor ? String(sensor.soil_ph)      : '');
  const [moisture, setMoisture] = useState(sensor ? String(sensor.moisture_pct) : '');
  const [temp,     setTemp]     = useState(sensor ? String(sensor.temp_c)       : '');
  const [saving,   setSaving]   = useState(false);

  const phNum  = parseFloat(ph);
  const moNum  = parseFloat(moisture);
  const tmNum  = parseFloat(temp);

  const phValid  = !isNaN(phNum)  && phNum  >= 0   && phNum  <= 14;
  const moValid  = !isNaN(moNum)  && moNum  >= 0   && moNum  <= 100;
  const tmValid  = !isNaN(tmNum)  && tmNum  >= 0   && tmNum  <= 60;
  const allValid = phValid && moValid && tmValid;

  const handleSave = async () => {
    if (!allValid) return;
    setSaving(true);
    try {
      const reading = {
        device_id:   'MANUAL',
        soil_ph:     phNum,
        moisture_pct: moNum,
        temp_c:      tmNum,
        battery_pct: 100,
        recorded_at: new Date().toISOString(),
        is_synced:   0 as const,
      };

      // Save to SQLite
      await insertReading(db, reading);

      // Update Zustand immediately — sensor tiles update now
      setSensor({ ...reading, id: Date.now() });

      // Trigger /session with new readings — all 4 engines fire
      onClose();
      await refresh();

    } catch (e) {
      console.error('Manual sensor save error:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[modalStyles.screen, { paddingBottom: insets.bottom + 16 }]}>

          {/* Handle bar */}
          <View style={modalStyles.handleBar} />

          {/* Header */}
          <View style={modalStyles.header}>
            <View>
              <Text style={modalStyles.title}>Enter soil readings</Text>
              <Text style={modalStyles.subtitle}>
                Use a handheld meter · AI updates instantly
              </Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={modalStyles.closeBtn} activeOpacity={0.7}>
              <Text style={modalStyles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Info strip */}
          <View style={modalStyles.infoStrip}>
            <Text style={modalStyles.infoIcon}>ℹ️</Text>
            <Text style={modalStyles.infoText}>
              No sensor paired yet? Enter readings from a handheld pH and moisture meter.
              The AI will give you full recommendations based on these numbers.
            </Text>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={modalStyles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Reading fields */}
            <ReadingField
              label="Soil pH"
              unit="pH scale 0–14"
              value={ph}
              onChange={setPh}
              min={0} max={14} step={0.1}
              placeholder="e.g. 6.2"
              hint="Ideal for most crops: 5.5–6.5"
              ranges={PH_RANGES}
            />

            <ReadingField
              label="Soil moisture"
              unit="% volumetric"
              value={moisture}
              onChange={setMoisture}
              min={0} max={100} step={1}
              placeholder="e.g. 62"
              hint="Adequate range: 40–80%"
              ranges={MOISTURE_RANGES}
            />

            <ReadingField
              label="Soil temperature"
              unit="°C"
              value={temp}
              onChange={setTemp}
              min={0} max={60} step={0.5}
              placeholder="e.g. 24"
              hint="Ideal range: 18–30°C"
              ranges={TEMP_RANGES}
            />

            {/* Summary preview */}
            {allValid && (
              <View style={modalStyles.previewCard}>
                <Text style={modalStyles.previewTitle}>Reading summary</Text>
                <View style={modalStyles.previewRow}>
                  <View style={[modalStyles.previewTile, { borderColor: getRangeInfo(phNum, PH_RANGES).color }]}>
                    <Text style={modalStyles.previewVal}>{phNum.toFixed(1)}</Text>
                    <Text style={modalStyles.previewLabel}>pH</Text>
                    <Text style={[modalStyles.previewStatus, { color: getRangeInfo(phNum, PH_RANGES).color }]}>
                      {getRangeInfo(phNum, PH_RANGES).label}
                    </Text>
                  </View>
                  <View style={[modalStyles.previewTile, { borderColor: getRangeInfo(moNum, MOISTURE_RANGES).color }]}>
                    <Text style={modalStyles.previewVal}>{moNum}%</Text>
                    <Text style={modalStyles.previewLabel}>Moisture</Text>
                    <Text style={[modalStyles.previewStatus, { color: getRangeInfo(moNum, MOISTURE_RANGES).color }]}>
                      {getRangeInfo(moNum, MOISTURE_RANGES).label}
                    </Text>
                  </View>
                  <View style={[modalStyles.previewTile, { borderColor: getRangeInfo(tmNum, TEMP_RANGES).color }]}>
                    <Text style={modalStyles.previewVal}>{tmNum}°C</Text>
                    <Text style={modalStyles.previewLabel}>Temp</Text>
                    <Text style={[modalStyles.previewStatus, { color: getRangeInfo(tmNum, TEMP_RANGES).color }]}>
                      {getRangeInfo(tmNum, TEMP_RANGES).label}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Save button */}
          <View style={modalStyles.footer}>
            <TouchableOpacity
              style={[modalStyles.saveBtn, !allValid && modalStyles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={!allValid || saving}
              activeOpacity={0.85}
            >
              {saving ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <Text style={modalStyles.saveBtnText}>
                  {allValid ? 'Update readings & run AI →' : 'Enter all three readings'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const fieldStyles = StyleSheet.create({
  wrap:   { marginBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  label:  { fontSize: 14, fontWeight: '700', color: Colors.slate900 },
  unit:   { fontSize: 12, color: Colors.slate400 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  adjBtn: {
    width: 40, height: 40,
    backgroundColor: Colors.slate050,
    borderWidth: 1.5,
    borderColor: Colors.slate100,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adjText: { fontSize: 22, color: Colors.slate700, fontWeight: '400', lineHeight: 26 },
  input: {
    flex: 1,
    height: 52,
    backgroundColor: Colors.slate050,
    borderWidth: 1.5,
    borderColor: Colors.slate100,
    borderRadius: BorderRadius.sm,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.slate900,
  },
  inputError: { borderColor: Colors.red500, backgroundColor: Colors.red100 },
  statusBar: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 7 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: '500' },
  scaleTrack: {
    height: 4,
    backgroundColor: Colors.slate100,
    borderRadius: 2,
    marginTop: 6,
    overflow: 'hidden',
  },
  scaleFill: { height: '100%', borderRadius: 2 },
});

const modalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing[4],
    paddingTop: 10,
  },
  handleBar: {
    width: 40, height: 4,
    backgroundColor: Colors.slate200,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title:    { fontSize: 22, fontWeight: '800', color: Colors.slate900, letterSpacing: -0.3 },
  subtitle: { fontSize: 13, color: Colors.slate400, marginTop: 3 },
  closeBtn: {
    width: 32, height: 32,
    backgroundColor: Colors.slate100,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: { fontSize: 14, color: Colors.slate600, fontWeight: '500' },
  infoStrip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.blue100,
    borderRadius: BorderRadius.sm,
    padding: 10,
    marginBottom: 20,
  },
  infoIcon: { fontSize: 14 },
  infoText: { flex: 1, fontSize: 12, color: Colors.blue500, lineHeight: 17 },
  scrollContent: { paddingBottom: 16 },
  previewCard: {
    backgroundColor: Colors.green050,
    borderWidth: 1,
    borderColor: Colors.green100,
    borderRadius: BorderRadius.md,
    padding: 14,
    marginTop: 4,
  },
  previewTitle: { fontSize: 12, fontWeight: '700', color: Colors.green700, marginBottom: 10, letterSpacing: 0.04, textTransform: 'uppercase' },
  previewRow:   { flexDirection: 'row', gap: 8 },
  previewTile:  {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.sm,
    borderWidth: 1.5,
    padding: 10,
    alignItems: 'center',
  },
  previewVal:    { fontSize: 20, fontWeight: '700', color: Colors.slate900, fontVariant: ['tabular-nums'] },
  previewLabel:  { fontSize: 11, color: Colors.slate400, marginTop: 2 },
  previewStatus: { fontSize: 10, fontWeight: '600', marginTop: 4, textAlign: 'center' },
  footer: { paddingTop: 12 },
  saveBtn: {
    backgroundColor: Colors.green600,
    borderRadius: BorderRadius.md,
    paddingVertical: 15,
    alignItems: 'center',
    ...Shadows.md,
  },
  saveBtnDisabled: { backgroundColor: Colors.slate200 },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
});
