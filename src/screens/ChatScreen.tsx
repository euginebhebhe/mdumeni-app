// src/screens/ChatScreen.tsx
// Hybrid AI chatbot:
// ONLINE  → Real Claude API via /chat — answers ANY question with farm context
// OFFLINE → 486 pre-built Q&A organised by category — tap to get instant answer

import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore, type ChatMessage } from '@/store';
import { callAIChat } from '@/services/api';
import { useTranslation } from '@/hooks/useTranslation';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import QA_DATA from '@/engines/offlineQA.json';

const ALL_QA = QA_DATA as { category: string; question: string; answer: string }[];
const CATEGORIES = [...new Set(ALL_QA.map(q => q.category))];

function fillTemplate(template: string, d: Record<string, unknown>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(d[k] ?? `{${k}}`));
}

function buildFarmData(
  ph: number | null, moisture: number | null, temp: number | null,
  crop: string | null, region: number, farmSize: number,
  budget: string, district: string,
): Record<string, unknown> {
  const phAdvice = !ph ? '' : ph < 5.0 ? 'Very acidic — lime urgently needed before planting.'
    : ph < 5.5 ? 'Acidic — apply lime at 250 kg/ha before planting.'
    : ph < 6.5 ? 'Good range for most crops.' : 'Slightly alkaline — most crops still grow well.';
  const phRating = !ph ? 'unknown' : ph < 5.0 ? 'very acidic' : ph < 5.5 ? 'acidic — lime needed'
    : ph < 6.5 ? 'good' : ph < 7.5 ? 'neutral — good' : 'alkaline';
  const limeTotal = ph && ph < 5.8 ? farmSize * Math.round((5.8 - ph) * 500) : 0;
  const months = ['January','February','March','April','May','June',
    'July','August','September','October','November','December'];
  return {
    ph: ph?.toFixed(1) ?? '—', moisture: moisture ?? '—', temp: temp?.toFixed(1) ?? '—',
    crop: crop ?? 'your active crop', region, farm_size: farmSize,
    budget, district: district || 'your district',
    month: months[new Date().getMonth()],
    ph_advice: phAdvice, ph_rating: phRating, ph_direction: !ph ? 'unknown' : ph < 7 ? 'acidic' : ph > 7 ? 'alkaline' : 'neutral',
    lime_total: limeTotal, compound_d_total: farmSize * 200, an_total: farmSize * 200,
    maize_seed_total: farmSize * 25,
    maize_total_yield: farmSize * 2500,
    maize_revenue: (farmSize * 2500 * 0.28).toFixed(0),
    beans_revenue: (farmSize * 900 * 0.65).toFixed(0),
    faw_organic_cost: (farmSize * 12).toFixed(2),
    expected_yield: farmSize * 2500, market_price: 0.28,
    gross_revenue: (farmSize * 2500 * 0.28).toFixed(0),
    net_profit: (farmSize * 2500 * 0.28 * 0.35).toFixed(0),
    top_crop: 'Sugar beans', top_score: '89', days_planted: 35,
    irrigation_status: 'rain-fed only',
    region_soil_type: ({1:'deep red clay loams',2:'deep red and brown clay loams',
      3:'sandy clay loams',4:'sandy and sandy loam soils',5:'coarse sandy soils'})[region] ?? 'mixed soils',
    region_traditional_crops: ({1:'potatoes, cabbages, wheat, tea',
      2:'maize, tobacco, groundnuts, cotton',3:'maize, sorghum, groundnuts',
      4:'sorghum, pearl millet, cowpeas',5:'pearl millet, sesame, cowpeas'})[region] ?? 'various crops',
    seed_rec: budget === 'low' ? 'ZM521 (OPV — save seed)' : 'SC403 (hybrid)',
    seed_type_rec: budget === 'low' ? 'OPV varieties (can save seed)' : 'Hybrid varieties (higher yield)',
    lime_urgency: ph && ph < 5.8 ? 'Apply lime before next planting — urgent' : 'pH acceptable — retest next season',
    germ_temp_status: temp && temp >= 15 && temp <= 35 ? 'suitable for germination' : 'check temperature before planting',
  };
}

function Bubble({ message }: { message: ChatMessage }) {
  const isAI = message.role === 'assistant';
  return (
    <View style={[bStyles.wrap, isAI ? bStyles.wrapAI : bStyles.wrapUser]}>
      <View style={[bStyles.bubble, isAI ? bStyles.bubbleAI : bStyles.bubbleUser]}>
        <Text style={[bStyles.text, isAI ? bStyles.textAI : bStyles.textUser]}>{message.content}</Text>
      </View>
      <Text style={[bStyles.time, !isAI && { textAlign: 'right' }]}>
        {new Date(message.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );
}

function OfflinePanel({ onSelect, farmData }: { onSelect: (q: string, a: string) => void; farmData: Record<string, unknown> }) {
  const [cat, setCat] = useState<string | null>(null);
  const questions = cat ? ALL_QA.filter(q => q.category === cat) : [];
  return (
    <View style={oStyles.panel}>
      <View style={oStyles.header}>
        <Text style={{ fontSize: 20 }}>📚</Text>
        <View>
          <Text style={oStyles.title}>Offline farming guide</Text>
          <Text style={oStyles.sub}>486 questions · Tap a topic then tap a question</Text>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={oStyles.catRow}>
        {CATEGORIES.map(c => (
          <TouchableOpacity key={c} style={[oStyles.chip, cat === c && oStyles.chipActive]} onPress={() => setCat(cat === c ? null : c)} activeOpacity={0.7}>
            <Text style={[oStyles.chipText, cat === c && oStyles.chipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {cat && (
        <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false} nestedScrollEnabled>
          {questions.map((item, i) => (
            <TouchableOpacity key={i} style={oStyles.qRow} onPress={() => onSelect(item.question, fillTemplate(item.answer, farmData))} activeOpacity={0.7}>
              <Text style={oStyles.qText}>{item.question}</Text>
              <Text style={{ fontSize: 18, color: Colors.slate300 }}>›</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      {!cat && <View style={{ padding: 14, alignItems: 'center' }}><Text style={{ fontSize: 13, color: Colors.slate400 }}>Select a topic above</Text></View>}
    </View>
  );
}

export function ChatScreen() {
  const insets    = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const messages   = useAppStore((s) => s.chatMessages);
  const addMessage = useAppStore((s) => s.addChatMessage);
  const sensor     = useAppStore((s) => s.sensorReading);
  const activeCrop = useAppStore((s) => s.activeCrop);
  const profile    = useAppStore((s) => s.profile);
  const isOnline   = useAppStore((s) => s.isOnline);
  const { t }      = useTranslation();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping]   = useState(false);

  const farmData = buildFarmData(
    sensor?.soil_ph ?? null, sensor?.moisture_pct ?? null, sensor?.temp_c ?? null,
    activeCrop?.crop_name ?? null, profile?.agro_region ?? 2,
    profile?.farm_size_ha ?? 2.4, profile?.budget_level ?? 'low', profile?.district ?? '',
  );

  const ph = sensor?.soil_ph;
  const greeting = `Hello! I am MDUMENI, your AI farming guide.\n\n`
    + `Your farm right now:\n`
    + (ph ? `• Soil pH: ${ph.toFixed(1)} — ${ph < 5.5 ? '⚠ acidic, lime needed' : '✅ good range'}\n` : '')
    + (sensor?.moisture_pct ? `• Moisture: ${sensor.moisture_pct}%\n` : '')
    + (activeCrop?.crop_name ? `• Active crop: ${activeCrop.crop_name}\n` : '')
    + `• ${profile?.farm_size_ha ?? 2.4} ha · Region ${profile?.agro_region ?? 2} · ${profile?.budget_level ?? 'low'} input\n\n`
    + (isOnline
      ? `I am online — ask me any farming question and I will give you a personalised answer.`
      : `You are offline. Browse the 486-question farming guide below — each answer is personalised for your farm.`);

  const sendMessage = useCallback(async (text: string, offlineAnswer?: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;
    addMessage({ id: Date.now().toString(), role: 'user', content: trimmed, timestamp: new Date().toISOString() });
    setInputText('');
    setIsTyping(true);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    try {
      let res: string;
      if (offlineAnswer) {
        res = offlineAnswer;
      } else if (isOnline) {
        try {
          res = await callAIChat(trimmed, {
            soil_ph: sensor?.soil_ph, moisture_pct: sensor?.moisture_pct,
            temp_c: sensor?.temp_c, active_crop: activeCrop?.crop_name,
            agro_region: profile?.agro_region ?? 2,
            farm_size_ha: profile?.farm_size_ha ?? 2.4,
            budget_level: profile?.budget_level ?? 'low',
            current_month: new Date().toLocaleString('en', { month: 'long' }),
          });
        } catch {
          res = `Could not reach the AI server right now. Try again in a moment, or turn off WiFi to browse the offline guide.`;
        }
      } else {
        res = `You are offline. Browse the farming guide below to find answers personalised for your farm.`;
      }
      addMessage({ id: (Date.now() + 1).toString(), role: 'assistant', content: res, timestamp: new Date().toISOString() });
    } finally {
      setIsTyping(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200);
    }
  }, [isTyping, isOnline, sensor, activeCrop, profile, addMessage]);

  return (
    // Replace with:
    <KeyboardAvoidingView
      style={s.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'android' ? 90 : 0}
    >
      <View style={[s.header, { paddingTop: insets.top + 6 }]}>
        <View style={s.avatar}><Text style={{ fontSize: 20 }}>🤖</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={s.headerTitle}>MDUMENI Assistant</Text>
          <Text style={s.headerSub}>{isOnline ? t('chat.online_sub') : t('chat.offline_sub')}</Text>
        </View>
        <View style={[s.badge, { backgroundColor: isOnline ? Colors.green600 : Colors.slate400 }]}>
          <Text style={s.badgeText}>{isOnline ? 'AI' : 'GUIDE'}</Text>
        </View>
      </View>

      <ScrollView ref={scrollRef} style={s.body} contentContainerStyle={s.bodyContent}
        showsVerticalScrollIndicator={false} onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        keyboardShouldPersistTaps="handled">
        <Bubble message={{ id: 'greeting', role: 'assistant', content: greeting, timestamp: new Date().toISOString() }} />
        {messages.map(m => <Bubble key={m.id} message={m} />)}
        {isTyping && (
          <View style={[bStyles.wrap, bStyles.wrapAI]}>
            <View style={[bStyles.bubble, bStyles.bubbleAI, { paddingVertical: 14 }]}>
              <View style={{ flexDirection: 'row', gap: 5 }}>
                {[0,1,2].map(i => <View key={i} style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: Colors.slate300 }} />)}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {!isOnline && <OfflinePanel onSelect={(q, a) => sendMessage(q, a)} farmData={farmData} />}

      {isOnline && (
        <View style={[s.inputRow, { paddingBottom: insets.bottom + 8 }]}>
          <TextInput
            style={s.input} value={inputText} onChangeText={setInputText}
            placeholder="Ask any farming question..." placeholderTextColor={Colors.slate300}
            multiline maxLength={500} editable={!isTyping}
          />
          <TouchableOpacity
            style={[s.sendBtn, (!inputText.trim() || isTyping) && s.sendBtnOff]}
            onPress={() => sendMessage(inputText)} disabled={!inputText.trim() || isTyping} activeOpacity={0.8}>
            {isTyping ? <ActivityIndicator size="small" color={Colors.white} /> : <Text style={s.sendIcon}>→</Text>}
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.slate050 },
  header: { backgroundColor: Colors.green600, paddingHorizontal: Spacing[4], paddingBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 38, height: 38, backgroundColor: Colors.amber500, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  headerTitle: { fontSize: 15, fontWeight: '700', color: Colors.white },
  headerSub:   { fontSize: 11, color: Colors.green200, marginTop: 1 },
  badge:       { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText:   { fontSize: 11, fontWeight: '700', color: Colors.white },
  body:        { flex: 1 },
  bodyContent: { paddingVertical: 14, paddingHorizontal: 14, gap: 10 },
  inputRow:    { flexDirection: 'row', alignItems: 'flex-end', gap: 8, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.slate100, paddingHorizontal: 14, paddingTop: 10 },
  input:       { flex: 1, borderWidth: 1.5, borderColor: Colors.slate100, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 9, fontSize: 14, color: Colors.slate900, backgroundColor: Colors.slate050, maxHeight: 100 },
  sendBtn:     { width: 38, height: 38, backgroundColor: Colors.green600, borderRadius: 19, alignItems: 'center', justifyContent: 'center', ...Shadows.sm },
  sendBtnOff:  { backgroundColor: Colors.slate200 },
  sendIcon:    { fontSize: 18, fontWeight: '700', color: Colors.white },
});
const bStyles = StyleSheet.create({
  wrap: { maxWidth: '85%', gap: 3 }, wrapAI: { alignSelf: 'flex-start' }, wrapUser: { alignSelf: 'flex-end' },
  bubble: { borderRadius: 16, paddingHorizontal: 13, paddingVertical: 10 },
  bubbleAI: { backgroundColor: Colors.white, borderTopLeftRadius: 4, ...Shadows.sm },
  bubbleUser: { backgroundColor: Colors.green600, borderTopRightRadius: 4 },
  text: { fontSize: 14, lineHeight: 21 }, textAI: { color: Colors.slate900 }, textUser: { color: Colors.white },
  time: { fontSize: 10, color: Colors.slate300, paddingHorizontal: 4 },
});
const oStyles = StyleSheet.create({
  panel: { backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.slate100, maxHeight: 340 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderBottomWidth: 1, borderBottomColor: Colors.slate050 },
  title: { fontSize: 13, fontWeight: '700', color: Colors.slate900 },
  sub:   { fontSize: 11, color: Colors.slate400, marginTop: 1 },
  catRow: { paddingHorizontal: 12, paddingVertical: 8, gap: 6 },
  chip:  { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1.5, borderColor: Colors.slate100, backgroundColor: Colors.slate050 },
  chipActive: { backgroundColor: Colors.green600, borderColor: Colors.green600 },
  chipText:   { fontSize: 12, fontWeight: '500', color: Colors.slate600 },
  chipTextActive: { color: Colors.white, fontWeight: '700' },
  qRow:  { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 11, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: Colors.slate050 },
  qText: { flex: 1, fontSize: 13, color: Colors.slate800, lineHeight: 18 },
});
