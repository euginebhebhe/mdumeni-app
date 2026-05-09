// src/screens/SettingsScreen.tsx
// Settings & Help — farm profile, sensor, app preferences, help links
// All data read from and written back to SQLite via the Zustand store

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch,
  Alert,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useAppStore } from '@/store';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RootTabParamList } from '@/types';
import { saveProfile } from '@/db/database';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { Badge } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { ManualSensorInput } from '@/components/ManualSensorInput';
import { CropSelectorScreen } from '@/screens/CropSelectorScreen';
import { ProfileEditScreen } from '@/screens/ProfileEditScreen';
import { ProjectModeScreen } from '@/screens/ProjectModeScreen';
import { YieldRecordScreen } from '@/screens/YieldRecordScreen';
import { SeasonHistoryScreen } from '@/screens/SeasonHistoryScreen';
import { Modal } from 'react-native';

// ── Setting row ────────────────────────────────────────────────────────────────
interface SettingRowProps {
  icon:     string;
  title:    string;
  subtitle?: string;
  value?:   string;
  onPress?: () => void;
  rightEl?: React.ReactNode;
  isLast?:  boolean;
}

function SettingRow({ icon, title, subtitle, value, onPress, rightEl, isLast }: SettingRowProps) {
  return (
    <TouchableOpacity
      style={[rowStyles.row, isLast && rowStyles.rowLast]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress && !rightEl}
    >
      <View style={rowStyles.left}>
        <Text style={rowStyles.icon}>{icon}</Text>
        <View>
          <Text style={rowStyles.title}>{title}</Text>
          {subtitle && <Text style={rowStyles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={rowStyles.right}>
        {value && <Text style={rowStyles.value}>{value}</Text>}
        {rightEl}
        {onPress && !rightEl && <Text style={rowStyles.chevron}>›</Text>}
      </View>
    </TouchableOpacity>
  );
}

// ── Settings group ─────────────────────────────────────────────────────────────
function SettingsGroup({ children }: { children: React.ReactNode }) {
  return <View style={groupStyles.group}>{children}</View>;
}

// ── Main screen ───────────────────────────────────────────────────────────────
export function SettingsScreen() {
  const db         = useSQLiteContext();
  const { t }      = useTranslation();
  const navigation  = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const isDemoMode  = useAppStore((s) => s.isDemoMode);
  const profile        = useAppStore((s) => s.profile);
  const updateProfile  = useAppStore((s) => s.updateProfile);
  const sensorConnected = useAppStore((s) => s.sensorConnected);
  const sensorDeviceId  = useAppStore((s) => s.sensorDeviceId);
  const sensor          = useAppStore((s) => s.sensorReading);

  const [alertsOn, setAlertsOn]             = useState(true);
  const [showCropSelector, setShowCropSelector] = useState(false);
  const [showProfileEdit, setShowProfileEdit]   = useState(false);
  const [showProjectMode, setShowProjectMode]   = useState(false);
  const [showYieldRecord, setShowYieldRecord]     = useState(false);
  const [showSeasonHistory, setShowSeasonHistory] = useState(false);
  const [showManual, setShowManual] = useState(false);

  const toggleAlerts = (val: boolean) => {
    setAlertsOn(val);
    // TODO: save notification preference to AsyncStorage
  };

  const toggleIrrigation = async () => {
    if (!profile) return;
    const newVal = !profile.has_irrigation;
    updateProfile({ has_irrigation: newVal });
    await saveProfile(db, { has_irrigation: newVal });
  };

  const changeBudget = () => {
    if (!profile) return;
    const levels = ['low', 'medium', 'high'] as const;
    const idx  = levels.indexOf(profile.budget_level);
    const next = levels[(idx + 1) % levels.length];
    Alert.alert(
      'Change budget level',
      `Switch to ${next} input?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            updateProfile({ budget_level: next });
            await saveProfile(db, { budget_level: next });
          },
        },
      ]
    );
  };

  const changeLanguage = () => {
    const languages = ['english', 'shona', 'ndebele'] as const;
    const current = profile?.language ?? 'english';
    const idx  = languages.indexOf(current);
    const next = languages[(idx + 1) % languages.length];
    Alert.alert(
      'Change language',
      `Switch to ${next.charAt(0).toUpperCase() + next.slice(1)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            updateProfile({ language: next });
            await saveProfile(db, { language: next });
          },
        },
      ]
    );
  };

  const pairSensor = () => {
    Alert.alert(
      'Pair sensor',
      'Bluetooth sensor pairing will be available once the BLE module is configured. Make sure your MDUMENI sensor is powered on and within 10 metres.',
      [{ text: 'OK' }]
    );
  };

  const regionLabel = profile?.agro_region
    ? `Region ${profile.agro_region} — ${['Highveld', 'Mashonaland', 'Midlands', 'Masvingo', 'Lowveld'][profile.agro_region - 1] ?? ''}`
    : '—';

  const langLabel = profile?.language === 'shona' ? 'Shona' : profile?.language === 'ndebele' ? 'Ndebele' : 'English';

  return (
    <>
    <ScrollView
      style={styles.screen}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings &amp; Help</Text>
        <Text style={styles.headerSub}>Profile · Sensor · Preferences</Text>
      </View>

      {/* ── Profile block ────────────────────────────────────────────────── */}
      <View style={styles.profileBlock}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarEmoji}>👨‍🌾</Text>
        </View>
        <View>
          <Text style={styles.profileName}>
            {profile?.district ? `${profile.district} Farm` : 'My Farm'}
          </Text>
          <Text style={styles.profileSub}>
            {regionLabel} · {profile?.farm_size_ha ?? '—'} ha · {profile?.budget_level ?? '—'} input
          </Text>
        </View>
      </View>

      {/* ── Sensor status ────────────────────────────────────────────────── */}
      <TouchableOpacity
          style={styles.sensorPill}
          onPress={() => setShowManual(true)}
          activeOpacity={0.75}
    >
          <View style={[styles.sensorDot, sensorConnected && styles.sensorDotActive]} />
          
          <View>
            <Text style={styles.sensorTitle}>
              {sensorConnected
                ? `Sensor connected — ${sensorDeviceId ?? 'MDUMENI-001'}`
                : 'No sensor paired'}
            </Text>

            <Text style={styles.sensorSub}>
              {sensor
                ? `Last read ${new Date(sensor.recorded_at).toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })} · ${sensor.battery_pct}% battery`
                : 'Pair your sensor in the options below'}
            </Text>
          </View>
        </TouchableOpacity>

      {/* ── Farm profile ─────────────────────────────────────────────────── */}
      <Text style={styles.groupLabel}>Farm profile</Text>
      <SettingsGroup>
        <SettingRow
          icon="📍"
          title="Province & district"
          subtitle={profile ? `${profile.province || 'Not set'} · ${profile.district || 'Not set'}` : '—'}
          onPress={() => Alert.alert('Edit location', 'Location editing coming in the next update.')}
        />
        <SettingRow
          icon="🗺"
          title="Agro-ecological region"
          subtitle={regionLabel}
          onPress={() => Alert.alert('Edit region', 'Region editing coming in the next update.')}
        />
        <SettingRow
          icon="📐"
          title="Farm size"
          value={profile ? `${profile.farm_size_ha} ha` : '—'}
          onPress={() => Alert.alert('Edit farm size', 'Farm size editing coming in the next update.')}
        />
        <SettingRow
          icon="💧"
          title="Irrigation available"
          subtitle={profile?.has_irrigation ? 'Yes — irrigation available' : 'No — rain-fed only'}
          rightEl={
            <Switch
              value={profile?.has_irrigation ?? false}
              onValueChange={toggleIrrigation}
              trackColor={{ false: Colors.slate200, true: Colors.green600 }}
              thumbColor={Colors.white}
            />
          }
        />
        <SettingRow
          icon="💰"
          title="Input budget"
          subtitle={profile ? `${profile.budget_level.charAt(0).toUpperCase() + profile.budget_level.slice(1)} input` : '—'}
          onPress={changeBudget}
          isLast
        />
      </SettingsGroup>

      {/* ── App settings ─────────────────────────────────────────────────── */}
      <Text style={styles.groupLabel}>App settings</Text>
      <SettingsGroup>
        <SettingRow
          icon="🌐"
          title="Language"
          value={langLabel}
          onPress={changeLanguage}
        />
        <SettingRow
          icon="🔔"
          title="Sensor alerts"
          subtitle="Critical soil condition notifications"
          rightEl={
            <Switch
              value={alertsOn}
              onValueChange={toggleAlerts}
              trackColor={{ false: Colors.slate200, true: Colors.green600 }}
              thumbColor={Colors.white}
            />
          }
        />
        <SettingRow
          icon="✏️"
          title="Enter readings manually"
          subtitle="Type pH, moisture & temp from a handheld meter"
          onPress={() => setShowManual(true)}
        />
        <SettingRow
          icon="🌱"
          title="Active crop & planting date"
          subtitle="Set which crop you are currently growing"
          onPress={() => setShowCropSelector(true)}
        />
        <SettingRow
          icon="✏️"
          title="Edit farm profile"
          subtitle="Change farm size, region, irrigation, budget"
          onPress={() => setShowProfileEdit(true)}
        />
        <SettingRow
          icon="🔀"
          title="Project mode"
          subtitle={isDemoMode ? "Currently in Demo mode — tap to switch" : "Currently in Real project mode"}
          onPress={() => setShowProjectMode(true)}
        />
        <SettingRow
          icon="📱"
          title="Pair sensor device"
          subtitle={sensorConnected ? `${sensorDeviceId} connected` : 'No device paired'}
          onPress={pairSensor}
          isLast
        />
      </SettingsGroup>

      {/* ── Help & support ────────────────────────────────────────────────── */}
      <Text style={styles.groupLabel}>Help &amp; support</Text>
      <SettingsGroup>
        <SettingRow
          icon="🌾"
          title="Record harvest yield"
          subtitle="Log your actual harvest after each season"
          onPress={() => setShowYieldRecord(true)}
        />
        <SettingRow
          icon="📊"
          title="Season history"
          subtitle="View all past crops, yields and profits"
          onPress={() => setShowSeasonHistory(true)}
        />
        <SettingRow
          icon="💬"
          title="Ask AI assistant"
          subtitle="Get instant farming advice"
          onPress={() => Alert.alert('AI Chat', 'Go to the AI Chat tab to ask questions.')}
        />
        <SettingRow
          icon="📖"
          title="How to use MDUMENI"
          onPress={() => Alert.alert('User guide', 'Full user guide coming in v1.1.')}
        />
        <SettingRow
          icon="📞"
          title="Contact extension officer"
          onPress={() => Alert.alert('Extension services', 'AGRITEX national helpline: +263 242 700 600')}
        />
        <SettingRow
          icon="ℹ️"
          title="App version"
          value="v1.0.0"
          isLast
        />
      </SettingsGroup>

      {/* ── About ────────────────────────────────────────────────────────── */}
      <View style={styles.about}>
        <Text style={styles.aboutLogo}>🌱 MDUMENI</Text>
        <Text style={styles.aboutText}>Your digital Mudhumeni</Text>
        <Text style={styles.aboutSub}>
          Built by INTELLI-Farming · University of Zimbabwe
        </Text>
        <Text style={styles.aboutSub}>
          Engine dataset: 30 crops · 5 agro-ecological regions
        </Text>
      </View>
    </ScrollView>

      <Modal visible={showYieldRecord} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowYieldRecord(false)}>
        <View style={{ flex: 1, paddingTop: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, marginBottom: 8 }}>
            <TouchableOpacity onPress={() => setShowYieldRecord(false)} style={{ padding: 8 }}>
              <Text style={{ fontSize: 16, color: Colors.blue500 }}>✕ Close</Text>
            </TouchableOpacity>
          </View>
          <YieldRecordScreen onDone={() => setShowYieldRecord(false)} />
        </View>
      </Modal>

      <Modal visible={showSeasonHistory} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowSeasonHistory(false)}>
        <View style={{ flex: 1, paddingTop: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, marginBottom: 8 }}>
            <TouchableOpacity onPress={() => setShowSeasonHistory(false)} style={{ padding: 8 }}>
              <Text style={{ fontSize: 16, color: Colors.blue500 }}>✕ Close</Text>
            </TouchableOpacity>
          </View>
          <SeasonHistoryScreen onRecordYield={() => { setShowSeasonHistory(false); setShowYieldRecord(true); }} />
        </View>
      </Modal>

      <ManualSensorInput
        visible={showManual}
        onClose={() => setShowManual(false)}
      />

      <Modal visible={showCropSelector} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowCropSelector(false)}>
        <View style={{ flex: 1, paddingTop: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, marginBottom: 8 }}>
            <TouchableOpacity onPress={() => setShowCropSelector(false)} style={{ padding: 8 }}>
              <Text style={{ fontSize: 16, color: Colors.blue500 }}>✕ Close</Text>
            </TouchableOpacity>
          </View>
          <CropSelectorScreen onDone={() => setShowCropSelector(false)} />
        </View>
      </Modal>

      <Modal visible={showProfileEdit} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowProfileEdit(false)}>
        <View style={{ flex: 1, paddingTop: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, marginBottom: 8 }}>
            <TouchableOpacity onPress={() => setShowProfileEdit(false)} style={{ padding: 8 }}>
              <Text style={{ fontSize: 16, color: Colors.blue500 }}>✕ Close</Text>
            </TouchableOpacity>
          </View>
          <ProfileEditScreen onDone={() => setShowProfileEdit(false)} />
        </View>
      </Modal>

      <Modal visible={showProjectMode} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowProjectMode(false)}>
        <View style={{ flex: 1, paddingTop: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, marginBottom: 8 }}>
            <TouchableOpacity onPress={() => setShowProjectMode(false)} style={{ padding: 8 }}>
              <Text style={{ fontSize: 16, color: Colors.blue500 }}>✕ Close</Text>
            </TouchableOpacity>
          </View>
          <ProjectModeScreen
            onDone={() => setShowProjectMode(false)}
            onStartReal={() => {
              setShowProjectMode(false);
              useAppStore.getState().setOnboardingDone(false);
            }}
          />
        </View>
      </Modal>
      </>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.green600,
    paddingHorizontal: Spacing[4],
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.white },
  headerSub:   { fontSize: 12, color: Colors.green200, marginTop: 3 },
  profileBlock: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing[4],
    marginTop: 14,
    marginBottom: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...Shadows.sm,
  },
  avatarCircle: {
    width: 52, height: 52,
    borderRadius: 26,
    backgroundColor: Colors.green050,
    borderWidth: 2,
    borderColor: Colors.green100,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarEmoji:  { fontSize: 24 },
  profileName:  { fontSize: 17, fontWeight: '700', color: Colors.slate900 },
  profileSub:   { fontSize: 12, color: Colors.slate400, marginTop: 2 },
  sensorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.green050,
    borderWidth: 1.5,
    borderColor: Colors.green100,
    borderRadius: BorderRadius.sm,
    padding: 10,
    marginHorizontal: Spacing[4],
    marginBottom: 10,
  },
  sensorDot: {
    width: 9, height: 9,
    borderRadius: 5,
    backgroundColor: Colors.slate300,
    flexShrink: 0,
  },
  sensorDotActive: { backgroundColor: Colors.green400 },
  sensorTitle: { fontSize: 12, color: Colors.green700, fontWeight: '700' },
  sensorSub:   { fontSize: 11, color: Colors.green600, marginTop: 1, fontVariant: ['tabular-nums'] },
  groupLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.06,
    textTransform: 'uppercase',
    color: Colors.slate400,
    paddingHorizontal: Spacing[5],
    paddingTop: 14,
    paddingBottom: 6,
  },
  about: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: Spacing[4],
  },
  aboutLogo: { fontSize: 22, fontWeight: '800', color: Colors.green600, marginBottom: 4 },
  aboutText: { fontSize: 14, color: Colors.slate400, marginBottom: 6 },
  aboutSub:  { fontSize: 12, color: Colors.slate300, textAlign: 'center' },
});

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 13,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate050,
  },
  rowLast: { borderBottomWidth: 0 },
  left:    { flexDirection: 'row', alignItems: 'center', gap: 11, flex: 1 },
  icon:    { fontSize: 18 },
  title:   { fontSize: 14, fontWeight: '600', color: Colors.slate900 },
  subtitle: { fontSize: 11, color: Colors.slate400, marginTop: 1 },
  right:   { flexDirection: 'row', alignItems: 'center', gap: 7 },
  value:   { fontSize: 13, color: Colors.slate400 },
  chevron: { fontSize: 18, color: Colors.slate300 },
});

const groupStyles = StyleSheet.create({
  group: {
    marginHorizontal: Spacing[4],
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    ...Shadows.sm,
  },
});
