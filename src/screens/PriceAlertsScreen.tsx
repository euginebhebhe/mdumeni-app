// src/screens/PriceAlertsScreen.tsx
// Farmer creates and manages price alerts
// Notified when crop price crosses their threshold

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, Switch, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/store';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

const BASE_URL = 'https://mdumeni-api.onrender.com';

const CROPS = [
  { id: 'CROP_002', name: 'Sugar beans', icon: '🫘' },
  { id: 'CROP_001', name: 'Maize',        icon: '🌽' },
  { id: 'CROP_003', name: 'Groundnuts',   icon: '🥜' },
  { id: 'CROP_006', name: 'Sorghum',      icon: '🌾' },
  { id: 'CROP_009', name: 'Soybeans',     icon: '🌱' },
  { id: 'CROP_019', name: 'Tomatoes',     icon: '🍅' },
  { id: 'CROP_010', name: 'Sunflower',    icon: '🌻' },
];

interface Props { onDone?: () => void; }

export function PriceAlertsScreen({ onDone }: Props) {
  const insets    = useSafeAreaInsets();
  const farmerId  = useAppStore((s) => s.farmerId);
  const isOnline  = useAppStore((s) => s.isOnline);

  const [alerts,    setAlerts]    = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [creating,  setCreating]  = useState(false);
  const [showForm,  setShowForm]  = useState(false);

  // Form state
  const [cropId,    setCropId]    = useState('CROP_002');
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [threshold, setThreshold] = useState('');
  const [saving,    setSaving]    = useState(false);

  useEffect(() => {
    if (farmerId && isOnline) loadAlerts();
    else setLoading(false);
  }, [farmerId, isOnline]);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${BASE_URL}/market/alerts/${farmerId}`);
      const data = await res.json();
      setAlerts(data.alerts ?? []);
    } catch (err) {
      // Silently handle fetch error
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!farmerId) { Alert.alert('Login required', 'Please log in to create alerts.'); return; }
    if (!threshold || parseFloat(threshold) <= 0) { Alert.alert('Enter a valid price threshold'); return; }
    setSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/market/alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmer_id:     farmerId,
          alert_type:    'crop_sell',
          crop_id:       cropId,
          condition,
          threshold_usd: parseFloat(threshold),
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setShowForm(false);
      setThreshold('');
      await loadAlerts();
      Alert.alert('✅ Alert created', 'You will be notified when the price condition is met.');
    } catch {
      Alert.alert('Error', 'Could not create alert. Try again.');
    }
    setSaving(false);
  };

  const handleDelete = async (alertId: string, cropName: string) => {
    Alert.alert(
      'Delete alert',
      `Remove price alert for ${cropName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await fetch(`${BASE_URL}/market/alerts/${alertId}`, { method: 'DELETE' });
            await loadAlerts();
          } catch (err) {
            // Silently handle delete error
          }
        }},
      ]
    );
  };

  const selectedCrop = CROPS.find(c => c.id === cropId) ?? CROPS[0];

  return (
    <View style={[al.screen, { paddingTop: insets.top }]}>
      <View style={al.header}>
        <Text style={al.headerLabel}>Notifications</Text>
        <Text style={al.headerTitle}>Price alerts</Text>
        <Text style={al.headerSub}>
          Get notified when a crop price crosses your threshold
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 14, gap: 10, paddingBottom: 32 }}>

        {/* Create new alert button */}
        <TouchableOpacity style={al.createBtn} onPress={() => setShowForm(!showForm)} activeOpacity={0.85}>
          <Text style={al.createBtnText}>{showForm ? '— Cancel' : '+ New price alert'}</Text>
        </TouchableOpacity>

        {/* Create form */}
        {showForm && (
          <View style={al.formCard}>
            <Text style={al.formTitle}>Create alert</Text>

            <Text style={al.fieldLabel}>Crop</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, paddingBottom: 8 }}>
              {CROPS.map(c => (
                <TouchableOpacity key={c.id}
                  style={[al.cropChip, cropId === c.id && al.cropChipActive]}
                  onPress={() => setCropId(c.id)}>
                  <Text style={{ fontSize: 16 }}>{c.icon}</Text>
                  <Text style={[al.cropChipText, cropId === c.id && { color: '#fff' }]}>
                    {c.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={al.fieldLabel}>Alert condition</Text>
            <View style={al.conditionRow}>
              <TouchableOpacity
                style={[al.condBtn, condition === 'above' && al.condBtnActive]}
                onPress={() => setCondition('above')}>
                <Text style={[al.condText, condition === 'above' && { color: '#fff' }]}>
                  ↑ Price goes above
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[al.condBtn, condition === 'below' && al.condBtnActive]}
                onPress={() => setCondition('below')}>
                <Text style={[al.condText, condition === 'below' && { color: '#fff' }]}>
                  ↓ Price drops below
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={al.fieldLabel}>Threshold price (USD per kg)</Text>
            <View style={al.priceRow}>
              <Text style={al.priceDollar}>$</Text>
              <TextInput
                style={al.priceInput}
                value={threshold}
                onChangeText={setThreshold}
                keyboardType="decimal-pad"
                placeholder="e.g. 0.80"
                placeholderTextColor={Colors.slate300}
                maxLength={6}
              />
              <Text style={al.priceUnit}>/kg</Text>
            </View>

            {threshold && parseFloat(threshold) > 0 && (
              <View style={al.previewBox}>
                <Text style={al.previewText}>
                  Notify me when {selectedCrop.name} is{' '}
                  {condition === 'above' ? 'above' : 'below'}{' '}
                  ${parseFloat(threshold).toFixed(3)}/kg
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[al.saveBtn, (!threshold || saving) && al.saveBtnDisabled]}
              onPress={handleCreate}
              disabled={!threshold || saving}>
              {saving
                ? <ActivityIndicator color="#fff" />
                : <Text style={al.saveBtnText}>Create alert →</Text>}
            </TouchableOpacity>
          </View>
        )}

        {/* Existing alerts */}
        {loading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#1A5C2A" />
          </View>
        ) : !isOnline ? (
          <View style={al.emptyCard}>
            <Text style={{ fontSize: 32, marginBottom: 10 }}>📡</Text>
            <Text style={{ fontSize: 14, color: Colors.slate600 }}>
              Connect to manage price alerts
            </Text>
          </View>
        ) : !farmerId ? (
          <View style={al.emptyCard}>
            <Text style={{ fontSize: 32, marginBottom: 10 }}>🔑</Text>
            <Text style={{ fontSize: 14, color: Colors.slate600 }}>
              Log in to create price alerts
            </Text>
          </View>
        ) : alerts.length === 0 ? (
          <View style={al.emptyCard}>
            <Text style={{ fontSize: 32, marginBottom: 10 }}>🔔</Text>
            <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.slate700 }}>
              No active alerts
            </Text>
            <Text style={{ fontSize: 13, color: Colors.slate400, marginTop: 6, textAlign: 'center' }}>
              Create an alert above to get notified when crop prices move
            </Text>
          </View>
        ) : (
          <>
            <Text style={al.sectionTitle}>{alerts.length} active alert{alerts.length !== 1 ? 's' : ''}</Text>
            {alerts.map((alert: any) => {
              const crop = CROPS.find(c => c.id === alert.crop_id);
              return (
                <View key={alert.id} style={al.alertCard}>
                  <View style={al.alertHeader}>
                    <Text style={{ fontSize: 20, marginRight: 10 }}>{crop?.icon ?? '🌾'}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={al.alertCrop}>{crop?.name ?? alert.crop_id}</Text>
                      <Text style={al.alertCondition}>
                        Notify when price {alert.condition === 'above' ? '↑ above' : '↓ below'}{' '}
                        ${parseFloat(alert.threshold_usd).toFixed(3)}/kg
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={al.deleteBtn}
                      onPress={() => handleDelete(alert.id, crop?.name ?? 'this crop')}>
                      <Text style={al.deleteBtnText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                  {alert.last_triggered && (
                    <Text style={al.lastTriggered}>
                      Last triggered: {new Date(alert.last_triggered).toLocaleDateString()}
                    </Text>
                  )}
                </View>
              );
            })}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const al = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: Colors.background },
  header:      { backgroundColor: '#1A5C2A', padding: Spacing[4], paddingTop: 16, paddingBottom: 18 },
  headerLabel: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 0.05 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#fff', marginTop: 2 },
  headerSub:   { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  createBtn:   { backgroundColor: '#1A5C2A', borderRadius: BorderRadius.md, paddingVertical: 14, alignItems: 'center', ...Shadows.sm },
  createBtnText:{ fontSize: 15, fontWeight: '700', color: '#fff' },
  formCard:    { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, borderWidth: 0.5, borderColor: Colors.slate100, padding: 16, ...Shadows.sm },
  formTitle:   { fontSize: 16, fontWeight: '700', color: Colors.slate900, marginBottom: 14 },
  fieldLabel:  { fontSize: 12, fontWeight: '600', color: Colors.slate600, textTransform: 'uppercase', letterSpacing: 0.04, marginBottom: 8, marginTop: 12 },
  cropChip:    { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.slate100, backgroundColor: Colors.white },
  cropChipActive: { backgroundColor: '#1A5C2A', borderColor: '#1A5C2A' },
  cropChipText:{ fontSize: 12, color: Colors.slate700 },
  conditionRow:{ flexDirection: 'row', gap: 8 },
  condBtn:     { flex: 1, padding: 10, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.slate200, alignItems: 'center' },
  condBtnActive:{ backgroundColor: '#1A5C2A', borderColor: '#1A5C2A' },
  condText:    { fontSize: 13, color: Colors.slate700, fontWeight: '500' },
  priceRow:    { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.slate050, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.slate200, paddingHorizontal: 14 },
  priceDollar: { fontSize: 22, fontWeight: '700', color: Colors.slate400, marginRight: 4 },
  priceInput:  { flex: 1, fontSize: 28, fontWeight: '700', color: Colors.slate900, paddingVertical: 10 },
  priceUnit:   { fontSize: 14, color: Colors.slate400 },
  previewBox:  { backgroundColor: '#EAF3DE', borderRadius: 8, padding: 10, marginTop: 10 },
  previewText: { fontSize: 13, color: '#27500A', fontWeight: '500' },
  saveBtn:     { backgroundColor: '#1A5C2A', borderRadius: BorderRadius.md, paddingVertical: 13, alignItems: 'center', marginTop: 14, ...Shadows.sm },
  saveBtnDisabled: { backgroundColor: Colors.slate200 },
  saveBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  sectionTitle:{ fontSize: 11, fontWeight: '700', color: Colors.slate400, textTransform: 'uppercase', letterSpacing: 0.05 },
  alertCard:   { backgroundColor: Colors.white, borderRadius: BorderRadius.md, borderWidth: 0.5, borderColor: Colors.slate100, padding: 14, ...Shadows.sm },
  alertHeader: { flexDirection: 'row', alignItems: 'center' },
  alertCrop:   { fontSize: 15, fontWeight: '600', color: Colors.slate900 },
  alertCondition:{ fontSize: 12, color: Colors.slate600, marginTop: 3 },
  deleteBtn:   { backgroundColor: '#FCEBEB', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  deleteBtnText:{ fontSize: 12, color: '#A32D2D', fontWeight: '600' },
  lastTriggered:{ fontSize: 11, color: Colors.slate400, marginTop: 8, paddingTop: 8, borderTopWidth: 0.5, borderTopColor: Colors.slate050 },
  emptyCard:   { padding: 40, alignItems: 'center', backgroundColor: Colors.white, borderRadius: BorderRadius.md, borderWidth: 0.5, borderColor: Colors.slate100 },
});
