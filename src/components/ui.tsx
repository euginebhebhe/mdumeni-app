// src/components/ui.tsx
// All shared UI components used across every screen
// Follows the approved v2 design exactly

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useAppStore } from '@/store';

// ── AppHeader ─────────────────────────────────────────────────────────────────
interface AppHeaderProps {
  farmName?: string;
  region?: string;
}

export function AppHeader({ farmName = "My Farm", region = "" }: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const sensorReading  = useAppStore((s) => s.sensorReading);
  const sensorConnected = useAppStore((s) => s.sensorConnected);

  const sensorLabel = sensorReading
    ? `pH ${sensorReading.soil_ph.toFixed(1)} · ${sensorReading.moisture_pct}%`
    : 'No sensor';

  const phLow = sensorReading && sensorReading.soil_ph < 5.5;

  return (
    <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
      {/* Logo + farm name */}
      <View style={styles.headerLeft}>
        <View style={styles.logoIcon}>
          <Image
            source={require('../../assets/icon.png')}
            style={{
              width: 38,
              height: 42,
            }}
            resizeMode="contain"
          />
        </View>
        <View>
          <Text style={styles.logoText}>
            MDU<Text style={styles.logoAccent}>MENI</Text>
          </Text>
          {farmName ? (
            <Text style={styles.farmName}>{farmName}{region ? ` · ${region}` : ''}</Text>
          ) : null}
        </View>
      </View>

      {/* Sensor pill */}
      <View style={[styles.sensorPill, phLow && styles.sensorPillWarn]}>
        <View style={[styles.pillDot, sensorConnected && styles.pillDotActive]} />
        <Text style={[styles.pillText, phLow && styles.pillTextWarn]}>
          {sensorLabel}
        </Text>
      </View>
    </View>
  );
}

// ── AlertStrip ────────────────────────────────────────────────────────────────
interface AlertStripProps {
  message: string;
  severity?: 'critical' | 'warning' | 'info';
  onPress?: () => void;
}

export function AlertStrip({ message, severity = 'warning', onPress }: AlertStripProps) {
  const bgColor = severity === 'critical' ? Colors.red100
    : severity === 'warning' ? Colors.amber100
    : Colors.blue100;
  const borderColor = severity === 'critical' ? Colors.red500
    : severity === 'warning' ? Colors.amber500
    : Colors.blue500;
  const textColor = severity === 'critical' ? '#8B0000'
    : severity === 'warning' ? '#855000'
    : '#1e3a5f';
  const icon = severity === 'critical' ? '🚨' : severity === 'warning' ? '⚠️' : 'ℹ️';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[styles.alertStrip, { backgroundColor: bgColor, borderLeftColor: borderColor }]}
    >
      <Text style={styles.alertIcon}>{icon}</Text>
      <Text style={[styles.alertText, { color: textColor }]}>{message}</Text>
    </TouchableOpacity>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  borderColor?: string;
  borderLeftColor?: string;
}

export function Card({ children, style, onPress, borderColor, borderLeftColor }: CardProps) {
  const content = (
    <View style={[
      styles.card,
      borderColor && { borderColor, borderWidth: 1.5 },
      borderLeftColor && { borderLeftColor, borderLeftWidth: 3 },
      style,
    ]}>
      {children}
    </View>
  );
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
}

// ── Badge ─────────────────────────────────────────────────────────────────────
type BadgeVariant = 'green' | 'amber' | 'red' | 'blue' | 'gray';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

const BADGE_COLORS: Record<BadgeVariant, { bg: string; text: string }> = {
  green: { bg: Colors.green100,  text: Colors.green700 },
  amber: { bg: Colors.amber100,  text: Colors.amber700 },
  red:   { bg: Colors.red100,    text: Colors.red500   },
  blue:  { bg: Colors.blue100,   text: Colors.blue500  },
  gray:  { bg: Colors.slate100,  text: Colors.slate600 },
};

export function Badge({ label, variant = 'gray', style }: BadgeProps) {
  const colors = BADGE_COLORS[variant];
  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }, style]}>
      <Text style={[styles.badgeText, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

// ── ScoreBar ──────────────────────────────────────────────────────────────────
interface ScoreBarProps {
  label: string;
  value: number;     // 0–1
  warn?: boolean;
}

export function ScoreBar({ label, value, warn = false }: ScoreBarProps) {
  const pct = Math.round(value * 100);
  const fillColor = warn ? Colors.amber500 : Colors.green400;

  return (
    <View style={styles.scoreRow}>
      <Text style={styles.scoreLabel}>{label}</Text>
      <View style={styles.scoreTrack}>
        <View style={[styles.scoreFill, { width: `${pct}%` as `${number}%`, backgroundColor: fillColor }]} />
      </View>
      <Text style={[styles.scorePct, warn && { color: Colors.amber700 }]}>
        {pct}%
      </Text>
    </View>
  );
}

// ── SectionTitle ──────────────────────────────────────────────────────────────
interface SectionTitleProps {
  label: string;
  color?: string;
  style?: TextStyle;
}

export function SectionTitle({ label, color, style }: SectionTitleProps) {
  return (
    <Text style={[styles.sectionTitle, color && { color }, style]}>
      {label}
    </Text>
  );
}

// ── TaskTypeIcon ──────────────────────────────────────────────────────────────
type TaskType = 'instruction' | 'fertiliser' | 'pest_check' | 'water' | 'harvest';

const TASK_CONFIG: Record<TaskType, { icon: string; bg: string; border: string }> = {
  instruction: { icon: '📋', bg: Colors.green050,   border: Colors.green400  },
  fertiliser:  { icon: '🌿', bg: Colors.amber100,   border: Colors.amber500  },
  pest_check:  { icon: '🔍', bg: Colors.red100,     border: Colors.red500    },
  water:       { icon: '💧', bg: Colors.blue100,    border: Colors.blue500   },
  harvest:     { icon: '🌾', bg: Colors.green100,   border: Colors.green600  },
};

interface TaskCardProps {
  title:       string;
  description: string;
  type:        TaskType;
  dueLabel?:   string;
  onPress?:    () => void;
}

export function TaskCard({ title, description, type, dueLabel, onPress }: TaskCardProps) {
  const cfg = TASK_CONFIG[type] ?? TASK_CONFIG.instruction;
  return (
    <Card onPress={onPress} borderLeftColor={cfg.border} style={styles.taskCard}>
      <View style={styles.taskRow}>
        <View style={[styles.taskIconWrap, { backgroundColor: cfg.bg }]}>
          <Text style={styles.taskIcon}>{cfg.icon}</Text>
        </View>
        <View style={styles.taskContent}>
          <Text style={styles.taskTitle}>{title}</Text>
          <Text style={styles.taskDesc}>{description}</Text>
          {dueLabel && (
            <Badge label={dueLabel} variant="amber" style={styles.taskDue} />
          )}
        </View>
      </View>
    </Card>
  );
}

// ── EmptyState ────────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon:    string;
  title:   string;
  message: string;
}

export function EmptyState({ icon, title, message }: EmptyStateProps) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>{icon}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
    </View>
  );
}

// ── PhaseDots ─────────────────────────────────────────────────────────────────
interface PhaseDotsProps {
  total:   number;
  current: number;  // 1-based
  done:    number;  // how many are done (0-based count)
}

export function PhaseDots({ total, current, done }: PhaseDotsProps) {
  return (
    <View style={styles.phaseDots}>
      {Array.from({ length: total }, (_, i) => {
        const isDone    = i + 1 <= done;
        const isCurrent = i + 1 === current;
        return (
          <View
            key={i}
            style={[
              styles.phaseDot,
              isDone    && styles.phaseDotDone,
              isCurrent && styles.phaseDotCurrent,
            ]}
          />
        );
      })}
    </View>
  );
}

// ── LoadingSpinner ────────────────────────────────────────────────────────────
export function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <View style={styles.loadingWrap}>
      <Image
        source={require('../../assets/icon.png')}
        style={{
          width: 32,
          height: 32,
        }}
        resizeMode="contain"
      />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Header
  header: {
    backgroundColor: Colors.green700,
    paddingHorizontal: Spacing[4],
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 34,
    height: 34,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderColor: Colors.amber500,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 17,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.5,
    lineHeight: 22,
  },
  logoAccent: {
    color: Colors.amber500,
  },
  farmName: {
    fontSize: 11,
    color: Colors.green200,
    fontWeight: '500',
    marginTop: 1,
  },
  sensorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  sensorPillWarn: {
    backgroundColor: 'rgba(239,159,39,0.22)',
    borderColor: 'rgba(239,159,39,0.40)',
  },
  pillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.slate300,
  },
  pillDotActive: {
    backgroundColor: Colors.green300,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.white,
  },
  pillTextWarn: {
    color: Colors.amber400,
  },

  // Alert strip
  alertStrip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderLeftWidth: 3,
    borderRadius: 0,
    paddingVertical: 10,
    paddingRight: 14,
    paddingLeft: 12,
    marginHorizontal: Spacing[4],
    marginTop: 10,
    borderTopRightRadius: BorderRadius.sm,
    borderBottomRightRadius: BorderRadius.sm,
  },
  alertIcon: {
    fontSize: 14,
    marginTop: 1,
  },
  alertText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    flex: 1,
  },

  // Card
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing[4],
    marginHorizontal: Spacing[4],
    marginBottom: 12,
    ...Shadows.sm,
  },

  // Badge
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.02,
  },

  // ScoreBar
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 5,
  },
  scoreLabel: {
    fontSize: 11,
    color: Colors.slate400,
    width: 72,
  },
  scoreTrack: {
    flex: 1,
    height: 5,
    backgroundColor: Colors.slate100,
    borderRadius: 3,
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    borderRadius: 3,
  },
  scorePct: {
    fontSize: 11,
    color: Colors.slate600,
    width: 32,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },

  // Section title
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.06,
    textTransform: 'uppercase',
    color: Colors.slate400,
    paddingHorizontal: Spacing[5],
    paddingTop: 14,
    paddingBottom: 6,
  },

  // Task card
  taskCard: {
    paddingVertical: 13,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
  },
  taskIconWrap: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  taskIcon: {
    fontSize: 17,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.slate900,
    lineHeight: 20,
  },
  taskDesc: {
    fontSize: 12,
    color: Colors.slate400,
    marginTop: 3,
    lineHeight: 16.5,
  },
  taskDue: {
    marginTop: 6,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing[10],
    paddingHorizontal: Spacing[6],
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.slate700,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 13,
    color: Colors.slate400,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Phase dots
  phaseDots: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 7,
  },
  phaseDot: {
    height: 4,
    flex: 1,
    borderRadius: 2,
    backgroundColor: Colors.slate100,
  },
  phaseDotDone: {
    backgroundColor: Colors.green600,
  },
  phaseDotCurrent: {
    backgroundColor: Colors.amber500,
  },

  // Loading
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingEmoji: {
    fontSize: 36,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.slate400,
    fontWeight: '500',
  },
});
