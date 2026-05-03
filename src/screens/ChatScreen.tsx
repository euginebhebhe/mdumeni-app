// src/screens/ChatScreen.tsx
// AI Assistance screen — reads live farm data, answers agronomic questions
// Working chat UI: quick questions, free-text input, typing indicator, context chips

import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore, type ChatMessage } from '@/store';
import { callAIChat } from '@/services/api';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

// ── Quick question chips ───────────────────────────────────────────────────────
const QUICK_QUESTIONS = [
  'Best rotation after maize?',
  'Fall Armyworm treatment?',
  'When should I harvest?',
  'How much lime do I need?',
  'Improve my profit?',
];

// ── Data context chips shown in the first AI greeting ─────────────────────────
function ContextChips({ farmData }: { farmData?: Record<string, unknown> }) {
  if (!farmData) return null;
  const chips = [
    farmData.ph    && { label: `pH ${farmData.ph}`,          warn: Number(farmData.ph) < 5.5 },
    farmData.moisture && { label: `💧 ${farmData.moisture}%`, warn: false },
    farmData.temp  && { label: `🌡 ${farmData.temp}°C`,       warn: false },
    farmData.crop  && { label: `🌽 ${farmData.crop}`,          warn: false },
  ].filter(Boolean) as { label: string; warn: boolean }[];

  if (chips.length === 0) return null;
  return (
    <View style={chipStyles.row}>
      {chips.map((c, i) => (
        <View key={i} style={[chipStyles.chip, c.warn && chipStyles.chipWarn]}>
          <Text style={[chipStyles.text, c.warn && chipStyles.textWarn]}>{c.label}</Text>
        </View>
      ))}
    </View>
  );
}

// ── Chat bubble ────────────────────────────────────────────────────────────────
interface BubbleProps {
  message: ChatMessage;
}

function Bubble({ message }: BubbleProps) {
  const isAI = message.role === 'assistant';
  return (
    <View style={[bubbleStyles.wrap, isAI ? bubbleStyles.wrapAI : bubbleStyles.wrapUser]}>
      <View style={[bubbleStyles.bubble, isAI ? bubbleStyles.bubbleAI : bubbleStyles.bubbleUser]}>
        <Text style={[bubbleStyles.text, isAI ? bubbleStyles.textAI : bubbleStyles.textUser]}>
          {message.content}
        </Text>
        {isAI && message.farmData && <ContextChips farmData={message.farmData} />}
      </View>
      <Text style={[bubbleStyles.time, !isAI && { textAlign: 'right' }]}>
        {new Date(message.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
        {message.farmData ? ' · Reading farm data' : ''}
      </Text>
    </View>
  );
}

// ── Typing indicator ───────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <View style={[bubbleStyles.wrap, bubbleStyles.wrapAI]}>
      <View style={[bubbleStyles.bubble, bubbleStyles.bubbleAI, { paddingVertical: 12 }]}>
        <View style={typStyles.row}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={typStyles.dot} />
          ))}
        </View>
      </View>
    </View>
  );
}

// ── Generate AI greeting from farm data ───────────────────────────────────────
function buildGreeting(
  ph: number | null,
  moisture: number | null,
  temp: number | null,
  cropName: string | null,
  farmSizeHa: number
): string {
  let msg = `Hello! I have access to your farm data. Here is what I can see right now:\n\n`;

  if (ph !== null) {
    if (ph < 5.5) {
      msg += `⚠ Your soil pH is ${ph.toFixed(1)} — below the minimum for most crops (5.5). `;
      msg += `This is your most urgent issue. I recommend applying agricultural lime before planting. `;
      msg += `Would you like me to calculate exactly how much lime you need for your ${farmSizeHa} ha?`;
    } else if (ph < 6.0) {
      msg += `Your soil pH is ${ph.toFixed(1)} — slightly below the optimal range of 6.0–6.5 for most crops. `;
      msg += `Consider a light lime application to bring this up. `;
      msg += `Your moisture at ${moisture}% looks good. What would you like to know?`;
    } else {
      msg += `Your soil conditions look good — pH ${ph.toFixed(1)}, moisture ${moisture}%, temperature ${temp}°C. `;
      if (cropName) {
        msg += `Your ${cropName} is progressing well. What can I help you with today?`;
      } else {
        msg += `What can I help you with today?`;
      }
    }
  } else {
    msg += `I don't have live sensor readings yet — make sure your sensor is paired in Settings. `;
    msg += `I can still help you with general farming advice. What would you like to know?`;
  }

  return msg;
}

// ── Build context for AI call ──────────────────────────────────────────────────
function buildContext(
  ph: number | null,
  moisture: number | null,
  temp: number | null,
  cropName: string | null,
  region: number,
  farmSizeHa: number,
  budgetLevel: string
): Record<string, unknown> {
  return {
    soil_ph:         ph,
    moisture_pct:    moisture,
    temp_c:          temp,
    active_crop:     cropName,
    agro_region:     region,
    farm_size_ha:    farmSizeHa,
    budget_level:    budgetLevel,
    current_month:   new Date().toLocaleString('en-ZW', { month: 'long' }),
  };
}

// ── Main screen ───────────────────────────────────────────────────────────────
export function ChatScreen() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const messages     = useAppStore((s) => s.chatMessages);
  const addMessage   = useAppStore((s) => s.addChatMessage);
  const sensor       = useAppStore((s) => s.sensorReading);
  const activeCrop   = useAppStore((s) => s.activeCrop);
  const profile      = useAppStore((s) => s.profile);
  const isOnline     = useAppStore((s) => s.isOnline);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping]   = useState(false);

  // Initialise greeting on first open
  const hasGreeting = messages.length > 0;

  const greeting = buildGreeting(
    sensor?.soil_ph ?? null,
    sensor?.moisture_pct ?? null,
    sensor?.temp_c ?? null,
    activeCrop?.crop_name ?? null,
    profile?.farm_size_ha ?? 2.4
  );

  const farmData = {
    ph:       sensor?.soil_ph?.toFixed(1) ?? null,
    moisture: sensor?.moisture_pct ?? null,
    temp:     sensor?.temp_c?.toFixed(0) ?? null,
    crop:     activeCrop ? `${activeCrop.crop_name} Day ${Math.floor((Date.now() - new Date(activeCrop.planting_date).getTime()) / 86400000)}` : null,
  };

  // Offline AI fallback responses
  const OFFLINE_RESPONSES: Record<string, string> = {
    'Best rotation after maize?':
      `After maize, plant sugar beans or groundnuts next season. Both fix nitrogen back into your soil after maize depletes it.\n\nWith your current pH ${sensor?.soil_ph?.toFixed(1) ?? '5.1'}, sugar beans are the better choice — they tolerate slightly more acidic soil than groundnuts.\n\nExpected benefit: 15–20% better maize yield in the following season.`,
    'Fall Armyworm treatment?':
      `For organic treatment (your budget level):\n\nBacillus thuringiensis (Bt) DiPel — 1 kg/ha in 200L water. Apply directly into the whorl before caterpillars enter. Treat within 24 hours if more than 30% of plants show frass.\n\nRepeat after 5 days.\n\nCost for your ${profile?.farm_size_ha ?? 2.4} ha: approximately $${((profile?.farm_size_ha ?? 2.4) * 12).toFixed(2)}.`,
    'When should I harvest?':
      `Based on your planting date and ZM521 maturity of 120 days, look for:\n\n• Dry husk papering back from the cob\n• Black layer forming at the grain base\n• Grain moisture below 25%\n\nYour sensor moisture readings will drop as the plant nears maturity — watch for consistent readings below 50%.`,
    'How much lime do I need?':
      `For your ${profile?.farm_size_ha ?? 2.4} ha at pH ${sensor?.soil_ph?.toFixed(1) ?? '5.1'}:\n\n• Apply 250 kg/ha of agricultural lime\n• Total for your farm: ${((profile?.farm_size_ha ?? 2.4) * 250).toFixed(0)} kg\n• Broadcast evenly and incorporate with a disc\n• Recheck pH after 14 days\n\nEstimated cost: $${((profile?.farm_size_ha ?? 2.4) * 7.5).toFixed(2)}–$${((profile?.farm_size_ha ?? 2.4) * 10).toFixed(2)}`,
    'Improve my profit?':
      `Three quick wins based on your data:\n\n1. Fix the pH now — lime costs $${((profile?.farm_size_ha ?? 2.4) * 8).toFixed(0)} but protects $200+ of yield\n\n2. Add sugar beans alongside maize — they sell at $0.65/kg vs $0.28/kg for maize\n\n3. Store in hermetic bags — reduces post-harvest loss from 15% to under 2%\n\nThese three changes alone could raise your seasonal profit by $150–200.`,
  };

  const DEFAULT_RESPONSE =
    `I've noted your question and checked your farm data (pH ${sensor?.soil_ph?.toFixed(1) ?? '—'}, ${activeCrop?.crop_name ?? 'no active crop'}, ${profile?.farm_size_ha ?? 2.4} ha, Region ${profile?.agro_region ?? '?'}).\n\nFor the most accurate advice, connect to the internet so I can run a full analysis through the MDUMENI AI engines. In the meantime, check the Calendar tab for today's specific tasks.`;

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMsg: ChatMessage = {
      id:        Date.now().toString(),
      role:      'user',
      content:   trimmed,
      timestamp: new Date().toISOString(),
    };
    addMessage(userMsg);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      let responseText: string;

      if (isOnline) {
        const ctx = buildContext(
          sensor?.soil_ph ?? null,
          sensor?.moisture_pct ?? null,
          sensor?.temp_c ?? null,
          activeCrop?.crop_name ?? null,
          profile?.agro_region ?? 2,
          profile?.farm_size_ha ?? 2.4,
          profile?.budget_level ?? 'low'
        );
        try {
          responseText = await callAIChat(trimmed, ctx);
        } catch {
          // API not live yet — use offline responses
          responseText = OFFLINE_RESPONSES[trimmed] ?? DEFAULT_RESPONSE;
        }
      } else {
        // Offline — use prebuilt responses
        responseText = OFFLINE_RESPONSES[trimmed] ?? DEFAULT_RESPONSE;
      }

      const aiMsg: ChatMessage = {
        id:        (Date.now() + 1).toString(),
        role:      'assistant',
        content:   responseText,
        timestamp: new Date().toISOString(),
      };
      addMessage(aiMsg);
    } catch {
      const errMsg: ChatMessage = {
        id:        (Date.now() + 1).toString(),
        role:      'assistant',
        content:   'I could not get a response right now. Please check your connection and try again.',
        timestamp: new Date().toISOString(),
      };
      addMessage(errMsg);
    } finally {
      setIsTyping(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200);
    }
  }, [isTyping, isOnline, sensor, activeCrop, profile, addMessage]);

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {/* ── Chat header ─────────────────────────────────────────────────── */}
      <View style={[styles.chatHeader, { paddingTop: insets.top + 6 }]}>
        <View style={styles.aiAvatar}>
          <Text style={styles.aiEmoji}>🤖</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.aiName}>MDUMENI Assistant</Text>
          <Text style={styles.aiStatus}>
            {isOnline ? 'Online · Reads your farm data' : 'Offline · Using cached responses'}
          </Text>
        </View>
        <View style={styles.aiBadge}>
          <Text style={styles.aiBadgeText}>AI</Text>
        </View>
      </View>

      {/* ── Messages ─────────────────────────────────────────────────────── */}
      <ScrollView
        ref={scrollRef}
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        {/* Greeting (always first) */}
        <Bubble
          message={{
            id:        'greeting',
            role:      'assistant',
            content:   greeting,
            timestamp: new Date().toISOString(),
            farmData,
          }}
        />

        {/* All subsequent messages */}
        {messages.map((msg) => (
          <Bubble key={msg.id} message={msg} />
        ))}

        {/* Typing indicator */}
        {isTyping && <TypingIndicator />}
      </ScrollView>

      {/* ── Quick questions ───────────────────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.quickRow}
        contentContainerStyle={styles.quickContent}
      >
        {QUICK_QUESTIONS.map((q) => (
          <TouchableOpacity
            key={q}
            style={styles.quickChip}
            onPress={() => sendMessage(q)}
            activeOpacity={0.7}
          >
            <Text style={styles.quickText}>{q}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Input row ────────────────────────────────────────────────────── */}
      <View style={[styles.inputRow, { paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask any farming question..."
          placeholderTextColor={Colors.slate300}
          multiline
          maxLength={500}
          returnKeyType="send"
          onSubmitEditing={() => sendMessage(inputText)}
          editable={!isTyping}
        />
        <TouchableOpacity
          style={[styles.sendBtn, isTyping && styles.sendBtnDisabled]}
          onPress={() => sendMessage(inputText)}
          disabled={isTyping || !inputText.trim()}
          activeOpacity={0.8}
        >
          {isTyping
            ? <ActivityIndicator size="small" color={Colors.white} />
            : <Text style={styles.sendIcon}>→</Text>
          }
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen:  { flex: 1, backgroundColor: Colors.slate050 },
  chatHeader: {
    backgroundColor: Colors.green600,
    paddingHorizontal: Spacing[4],
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiAvatar: {
    width: 38, height: 38,
    backgroundColor: Colors.amber500,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  aiEmoji:   { fontSize: 20 },
  aiName:    { fontSize: 15, fontWeight: '700', color: Colors.white },
  aiStatus:  { fontSize: 11, color: Colors.green200, marginTop: 1 },
  aiBadge:   { backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 3 },
  aiBadgeText: { fontSize: 11, fontWeight: '700', color: Colors.white },
  body:        { flex: 1 },
  bodyContent: { paddingVertical: 14, paddingHorizontal: 14, gap: 10 },
  quickRow:    { backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.slate100 },
  quickContent: { paddingHorizontal: 14, paddingVertical: 8, gap: 6 },
  quickChip:   {
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.green200,
    backgroundColor: Colors.white,
  },
  quickText: { fontSize: 12, fontWeight: '600', color: Colors.green700,  },
  inputRow:  {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.slate100,
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.slate100,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    fontSize: 14,
    color: Colors.slate900,
    backgroundColor: Colors.slate050,
    maxHeight: 100,
  },
  sendBtn: {
    width: 38, height: 38,
    backgroundColor: Colors.green600,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    ...Shadows.sm,
  },
  sendBtnDisabled: { backgroundColor: Colors.slate200 },
  sendIcon: { fontSize: 18, fontWeight: '700', color: Colors.white },
});

const bubbleStyles = StyleSheet.create({
  wrap:     { maxWidth: '85%', gap: 3 },
  wrapAI:   { alignSelf: 'flex-start' },
  wrapUser: { alignSelf: 'flex-end' },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  bubbleAI: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 4,
    ...Shadows.sm,
  },
  bubbleUser: {
    backgroundColor: Colors.green600,
    borderTopRightRadius: 4,
  },
  text:     { fontSize: 14, lineHeight: 21,  },
  textAI:   { color: Colors.slate900 },
  textUser: { color: Colors.white },
  time:     { fontSize: 10, color: Colors.slate300, paddingHorizontal: 4 },
});

const chipStyles = StyleSheet.create({
  row:  { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 8 },
  chip: { backgroundColor: Colors.green050, borderWidth: 1, borderColor: Colors.green100, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  chipWarn: { backgroundColor: Colors.amber100, borderColor: 'rgba(239,159,39,0.3)' },
  text:     { fontSize: 11, color: Colors.green700, fontWeight: '500' },
  textWarn: { color: Colors.amber700 },
});

const typStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 4, alignItems: 'center' },
  dot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: Colors.slate300 },
});
