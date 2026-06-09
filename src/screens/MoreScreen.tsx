// src/screens/MoreScreen.tsx
// The "More" tab — all secondary features in a clean list
// AI assistant, calendar, pest & disease, find market, reports, settings

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/store';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { ChatScreen }          from '@/screens/ChatScreen';
import { CalendarScreen }      from '@/screens/CalendarScreen';
import { SettingsScreen }      from '@/screens/SettingsScreen';
import { ReportPriceScreen }   from '@/screens/ReportPriceScreen';
import { FindMarketScreen }    from '@/screens/FindMarketScreen';
import { PriceAlertsScreen }   from '@/screens/PriceAlertsScreen';
import { RealModeSetupScreen}      from '@/screens/RealModeSetupScreen';
import { generateAndShareReport } from '@/services/reportService';

function Row({
  icon, title, subtitle, onPress, badge,
}: {
  icon: string; title: string; subtitle?: string;
  onPress: () => void; badge?: string;
}) {
  return (
    <TouchableOpacity style={m.row} onPress={onPress} activeOpacity={0.7}>
      <View style={m.rowIcon}><Text style={{ fontSize: 18 }}>{icon}</Text></View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={m.rowTitle}>{title}</Text>
        {subtitle && <Text style={m.rowSub}>{subtitle}</Text>}
      </View>
      {badge && (
        <View style={m.badge}><Text style={m.badgeText}>{badge}</Text></View>
      )}
      <Text style={m.chevron}>›</Text>
    </TouchableOpacity>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={m.section}>
      <Text style={m.sectionTitle}>{title}</Text>
      <View style={m.sectionCard}>{children}</View>
    </View>
  );
}

type ModalScreen = 'chat' | 'calendar' | 'settings' | 'report' | 'findmarket' | 'alerts' | 'realmode' | null;

export function MoreScreen() {
  const insets     = useSafeAreaInsets();
  const profile    = useAppStore((s) => s.profile);
  const isDemoMode = useAppStore((s) => s.isDemoMode);
  const session    = useAppStore((s) => s.session);
  const [modal, setModal] = useState<ModalScreen>(null);
  const activeCrop = useAppStore((s) => s.activeCrop);

  const farmName = isDemoMode
    ? '🧪 Demo Farm'
    : profile?.district ? `${profile.district} Farm` : 'My Farm';

  const modalContent: Record<Exclude<ModalScreen, null>, React.ReactNode> = {
    chat:       <ChatScreen />,
    calendar:   <CalendarScreen />,
    settings:   <SettingsScreen />,
    report:     <ReportPriceScreen onDone={() => setModal(null)} />,
    findmarket: <FindMarketScreen  onBack={() => setModal(null)} />,
    alerts:     <PriceAlertsScreen onDone={() => setModal(null)} />,
    realmode:   <RealModeSetupScreen onDone={() => setModal(null)} />,
  };

  return (
    <View style={[m.screen, { paddingTop: insets.top }]}>

      {/* Header */}
      <View style={m.header}>
        <Text style={m.headerLabel}>All features</Text>
        <Text style={m.headerTitle}>{farmName}</Text>
        <Text style={m.headerSub}>
          Region {profile?.agro_region ?? '—'} ·
          {profile?.budget_level ?? '—'} input ·
          {isDemoMode ? ' Demo mode' : ' Real project'}
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}>

        <Section title="AI & advice">
          <Row icon="🤖" title="AI farming assistant"
            subtitle="Ask any question — market, agronomy, or planning"
            onPress={() => setModal('chat')} badge="Live" />
          <Row icon="📅" title="Farming calendar"
            subtitle="Daily tasks · Phase guide · Pest alerts"
            onPress={() => setModal('calendar')} />
          <Row icon="🐛" title="Pest & disease guide"
            subtitle="Identify symptoms and get treatment plans"
            onPress={() => setModal('calendar')} />
        </Section>

        <Section title="Markets">
          <Row icon="📍" title="Find nearest market"
            subtitle="Markets, buyers, and agro-dealers near you"
            onPress={() => setModal('findmarket')} />
          <Row icon="🔔" title="Price alerts"
            subtitle="Notify me when a price crosses my threshold"
            onPress={() => setModal('alerts')} />
          <Row icon="📢" title="Report a price"
            subtitle="Submit what you saw at your local market today"
            onPress={() => setModal('report')} />
        </Section>

        <Section title="Reports & export">
          <Row icon="📄" title="Season PDF report"
            subtitle="Full season summary for bank or NGO loan application"
            onPress={async () => {
              const plan = session?.crop_plan;
              try {
                await generateAndShareReport({
                  farmerName:     profile?.district ? `${profile.district} Farm` : 'MDUMENI Farmer',
                  phone:          '',   // not stored in profile — farmer can handwrite on the PDF
                  province:       profile?.province      ?? '—',
                  district:       profile?.district      ?? '—',
                  farmSize:       profile?.farm_size_ha  ?? 0,
                  region:         profile?.agro_region   ?? 0,
                  budget:         profile?.budget_level  ?? 'low',
                  cropName:       activeCrop?.crop_name  ?? 'No active crop',
                  plantingDate:   activeCrop?.planting_date
                                    ? new Date(activeCrop.planting_date).toLocaleDateString('en-GB')
                                    : '—',
                  estimatedYield: plan?.expected_yield_kg    ?? 0,
                  totalCost:      plan?.total_cost_usd       ?? 0,
                  grossRevenue:   plan?.gross_revenue_usd    ?? 0,
                  netProfit:      plan?.net_profit_usd       ?? 0,
                  sellPrice:      plan?.market_price_usd_kg  ?? 0,
                  bestMarket:     plan?.harvest_plan?.market_advice ?? '—',
                  generatedDate:  new Date().toLocaleDateString('en-GB', {
                                    day: 'numeric', month: 'long', year: 'numeric'
                                  }),
                });
              } catch (e: any) {
                Alert.alert('Error', e.message ?? 'Could not generate report');
              }
            }} />
        </Section>

        <Section title="Account & settings">
          <Row icon="⚙️" title="Settings"
            subtitle="Farm profile, sensor, language, notifications"
            onPress={() => setModal('settings')} />
          <Row icon={isDemoMode ? '🧪' : '✅'}
            title={isDemoMode ? 'Demo mode — tap to switch to real' : 'Real project mode'}
            subtitle={isDemoMode ? 'Using sample data. Tap to register your real farm.' : 'Your data is saved to the server.'}
            onPress={() => {
              if (isDemoMode) {
                setModal('realmode');
              } else {
                Alert.alert('Real project mode', 'You are already in real project mode.');
              }
            }}
          />  
          <Row icon="🌐" title="Language"
            subtitle={profile?.language === 'shona' ? 'Shona' : profile?.language === 'ndebele' ? 'Ndebele' : 'English'}
            onPress={() => setModal('settings')} />
          <Row icon="ℹ️" title="App version"
            subtitle="MDUMENI v1.0.0 · Intelli-Farming · University of Zimbabwe"
            onPress={() => {}} />
        </Section>

      </ScrollView>

      {/* Full-screen modals */}
      {modal && (
        <Modal visible animationType="slide" presentationStyle="pageSheet"
          onRequestClose={() => setModal(null)}>
          <View style={{ flex: 1, paddingTop: 20 }}>
            <View style={m.modalClose}>
              <TouchableOpacity onPress={() => setModal(null)} style={{ padding: 8 }}>
                <Text style={m.modalCloseText}>✕ Close</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              {modalContent[modal]}
            </View>
          </View>
        </Modal>
      )}

    </View>
  );
}

const m = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: Colors.background },
  header:      { backgroundColor: '#1A5C2A', padding: Spacing[4], paddingTop: 12, paddingBottom: 18 },
  headerLabel: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 0.05 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#fff', marginTop: 2 },
  headerSub:   { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  section:     { padding: Spacing[4], paddingBottom: 0 },
  sectionTitle:{ fontSize: 11, fontWeight: '700', color: Colors.slate400, textTransform: 'uppercase', letterSpacing: 0.05, marginBottom: 8 },
  sectionCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, borderWidth: 0.5, borderColor: Colors.slate100, overflow: 'hidden', ...Shadows.sm },
  row:         { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 0.5, borderBottomColor: Colors.slate050 },
  rowIcon:     { width: 36, height: 36, backgroundColor: Colors.slate050, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  rowTitle:    { fontSize: 14, fontWeight: '500', color: Colors.slate900 },
  rowSub:      { fontSize: 12, color: Colors.slate400, marginTop: 2 },
  chevron:     { fontSize: 20, color: Colors.slate300, marginLeft: 8 },
  badge:       { backgroundColor: '#EAF3DE', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginRight: 4 },
  badgeText:   { fontSize: 10, fontWeight: '700', color: '#27500A' },
  modalClose:  { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, marginBottom: 8 },
  modalCloseText: { fontSize: 16, color: Colors.slate400 },
});
export default MoreScreen;