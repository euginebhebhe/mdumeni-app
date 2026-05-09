// src/screens/CalendarScreen.tsx
// 3 merged sub-tabs: Calendar · Crop advice · Pests
// All active-crop data in one place — reduces nav duplication

import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
} from 'react-native';
import {
  AlertStrip, Card, Badge, TaskCard, ScoreBar, SectionTitle,
  EmptyState, LoadingSpinner,
} from '@/components/ui';
import { useAppStore, useCalendarTab } from '@/store';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

// ── Sub-tab bar ────────────────────────────────────────────────────────────────
const TABS = [
  { key: 'calendar', label: 'Calendar'    },
  { key: 'advice',   label: 'Crop advice' },
  { key: 'pests',    label: 'Pests'       },
] as const;


type TabKey = typeof TABS[number]['key'];

function SubTabBar({ active, onChange }: { active: TabKey; onChange: (t: TabKey) => void }) {
  return (
    <View style={tabStyles.bar}>
      {TABS.map((t) => (
        <TouchableOpacity
          key={t.key}
          style={[tabStyles.tab, active === t.key && tabStyles.tabActive]}
          onPress={() => onChange(t.key)}
          activeOpacity={0.7}
        >
          <Text style={[tabStyles.tabText, active === t.key && tabStyles.tabTextActive]}>
            {t.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── Phase timeline ─────────────────────────────────────────────────────────────
const PHASE_NAMES = ['Prep', 'Plant', 'Grow', 'Flower', 'Fill', 'Harvest'];

function PhaseTimeline({ currentPhase }: { currentPhase: number }) {
  return (
    <View style={phStyles.wrap}>
      <View style={phStyles.row}>
        {/* Connector line */}
        <View style={phStyles.connector}>
          <View style={[phStyles.connectorFill, { width: `${Math.min(((currentPhase - 1) / 5) * 100, 100)}%` }]} />
        </View>
        {PHASE_NAMES.map((name, i) => {
          const num      = i + 1;
          const isDone   = num < currentPhase;
          const isActive = num === currentPhase;
          return (
            <View key={num} style={phStyles.step}>
              <View style={[
                phStyles.circle,
                isDone   && phStyles.circleDone,
                isActive && phStyles.circleActive,
              ]}>
                <Text style={[
                  phStyles.circleText,
                  (isDone || isActive) && phStyles.circleTextActive,
                ]}>{num}</Text>
              </View>
              <Text style={[phStyles.stepLabel, isActive && phStyles.stepLabelActive]}>
                {name}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ── Calendar sub-tab ───────────────────────────────────────────────────────────
function CalendarTab() {
  const calendar    = useAppStore((s) => s.session?.daily_calendar);
  const alerts      = useAppStore((s) => s.activeAlerts);
  const sessionLoading = useAppStore((s) => s.sessionLoading);

  if (sessionLoading && !calendar) {
    return <View style={{ flex: 1, padding: 40 }}><LoadingSpinner message="Loading calendar..." /></View>;
  }
  if (!calendar) {
    return (
      <ScrollView>
        <Text>No active crop set</Text>

        <View style={{ alignItems: 'center', padding: 24 }}>
          <Text style={{ fontSize: 16, color: Colors.slate400, marginBottom: 16 }}>
            No active crop set
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: Colors.green600, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 12 }}
            onPress={() => {
              // Navigate to Settings — easiest approach
              navigation.navigate('Settings');
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>
              Set active crop →
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
  const navigation  = useNavigation<any>();
  const phase       = calendar.current_phase;
  const critical    = alerts.filter((a) => a.severity === 'critical');
  const warnings    = alerts.filter((a) => a.severity === 'warning');
  const TASK_TITLES: Record<string, string> = {
    pest_check:       'Scout for pests',
    fertiliser:       'Apply fertiliser',
    irrigation:       'Irrigation check',
    weed_control:     'Weed control',
    soil_check:       'Soil check',
    harvest_prep:     'Prepare for harvest',
    planting:         'Planting',
    land_preparation: 'Land preparation',
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Phase timeline */}
      <View style={styles.phaseBlock}>
        <PhaseTimeline currentPhase={phase.number} />
        <View style={styles.dayPill}>
          <Text style={styles.dayPillText}>
            Day {calendar.days_since_planting} — {phase.name} · {calendar.days_to_harvest} days to harvest
          </Text>
        </View>
      </View>

      {/* Critical alerts */}
      {critical.length > 0 && (
        <>
          <SectionTitle label="⚠ Sensor alerts" color={Colors.red500} />
          {critical.map((a, i) => (
            <View key={i} style={styles.alertCard}>
              <Text style={styles.alertTitle}>{a.field}: {a.value}</Text>
              <Text style={styles.alertMsg}>{a.message}</Text>
            </View>
          ))}
        </>
      )}

      {/* Warning alerts */}
      {warnings.map((a, i) => (
        <AlertStrip key={i} message={a.message} severity="warning" />
      ))}

       {/* Today's tasks */}
    <SectionTitle label="Today's tasks" />

    {calendar?.tasks_today?.length > 0 ? (
      calendar.tasks_today.map((task, i) => (
        <TaskCard
          key={i}
          title={
            task.title ??
            TASK_TITLES[task.type] ??
            task.type
              ?.replace(/_/g, ' ')
              .replace(/\b\w/g, (c: string) => c.toUpperCase()) ??
            'Task'
          }
          description={
            task.description ??
            task.message ??
            ''
          }
          type={task.type}
          dueLabel={
            task.priority === 'high'
              ? 'Due today'
              : undefined
          }
        />
      ))
    ) : (
      <Card>
        <EmptyState
          icon="✅"
          title="No tasks today"
          message="Check upcoming tasks below."
        />
      </Card>
    )}

      {/* Upcoming */}
      {calendar.tasks_upcoming.length > 0 && (
        <>
          <SectionTitle label="Coming up — 7 days" />
          {calendar.tasks_upcoming.map((task, i) => (
            <View key={i} style={styles.upcomingWrap}>
              <TaskCard
                title={task.title}
                description={task.description}
                type={task.type}
              />
            </View>
          ))}
        </>
      )}

      <View style={{ height: 16 }} />
    </ScrollView>
  );
}

// ── Crop advice sub-tab ────────────────────────────────────────────────────────
function AdviceTab() {
  const recsRaw = useAppStore((s) => s.session?.crop_recommendations?.recommendations);
  const recs = recsRaw ?? [];
  const sensor = useAppStore((s) => s.sensorReading);
  const profile = useAppStore((s) => s.profile);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {sensor && (
        <AlertStrip
          message={`Based on pH ${sensor.soil_ph.toFixed(1)}, moisture ${sensor.moisture_pct}%, Region ${profile?.agro_region ?? '?'}, ${new Date().toLocaleString('en-ZW', { month: 'long' })}.`}
          severity="info"
        />
      )}
      <SectionTitle label="Best crops for your soil now" />
      {recs.length === 0 ? (
        <Card><EmptyState icon="🌱" title="Loading..." message="Pull down to refresh." /></Card>
      ) : (
        recs.map((rec) => (
          <Card key={rec.crop_id} borderColor={rec.rank === 1 ? Colors.green300 : undefined}>
            {/* Header */}
            <View style={recStyles.header}>
              <View style={[recStyles.rankBubble, rec.rank === 1 && recStyles.rankBubble1, rec.rank === 2 && recStyles.rankBubble2]}>
                <Text style={[recStyles.rankText, rec.rank <= 2 && { color: Colors.white }]}>{rec.rank}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={recStyles.cropName}>{rec.crop_name}</Text>
                {rec.local_name_shona && (
                  <Text style={recStyles.cropLocal}>Shona: {rec.local_name_shona}</Text>
                )}
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={recStyles.scoreText}>{rec.score_pct}%</Text>
                {rec.in_season
                  ? <Badge label="In season" variant="green" />
                  : <Badge label="Off season" variant="gray" />}
              </View>
            </View>

            {/* Score bars */}
            <View style={{ marginTop: 10 }}>
              <ScoreBar label="Soil pH" value={rec.breakdown.soil_ph} warn={rec.breakdown.soil_ph < 0.7} />
              <ScoreBar label="Moisture" value={rec.breakdown.soil_moisture} />
              <ScoreBar label="Region"   value={rec.breakdown.region_fit} />
              <ScoreBar label="Irrigation" value={rec.breakdown.irrigation_fit} warn={rec.breakdown.irrigation_fit < 0.7} />
              <ScoreBar label="Budget"   value={rec.breakdown.budget_fit} />
            </View>

            {/* Footer */}
            <View style={recStyles.footer}>
              <Text style={recStyles.variety}>
                Variety: <Text style={{ fontWeight: '700', color: Colors.slate900 }}>{rec.selected_variety.name}</Text>
                {' '}· {rec.expected_yield_t_ha} t/ha
              </Text>
              <Badge label={`$${rec.market_price_usd_kg}/kg`} variant="amber" />
            </View>

            {/* Agronomic notes */}
            {rec.agronomic_notes.length > 0 && (
              <View style={recStyles.notes}>
                {rec.agronomic_notes.map((note, i) => (
                  <Text key={i} style={recStyles.noteText}>• {note}</Text>
                ))}
              </View>
            )}
          </Card>
        ))
      )}
      <View style={{ height: 16 }} />
    </ScrollView>
  );
}

// ── Pests sub-tab ──────────────────────────────────────────────────────────────
const SEVERITY_COLORS: Record<string, string> = {
  critical: Colors.red500,
  high:     Colors.amber500,
  medium:   Colors.blue500,
  low:      Colors.slate300,
};

function PestsTab() {
  const threats  = useAppStore((s) => s.session?.crop_threats);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const SYMPTOMS = ['Holes in leaves','Frass in whorl','Yellow leaves','White powder','Wilting','Dead heart','Caterpillar','Sticky leaves'];

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const allThreats = [
    ...(threats?.pests    ?? []),
    ...(threats?.diseases ?? []),
  ].sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return (order[a.severity as keyof typeof order] ?? 4) - (order[b.severity as keyof typeof order] ?? 4);
  });

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Symptom checker */}
      <SectionTitle label="Symptom checker" />
      <Card>
        <Text style={pestStyles.symTitle}>What do you see on your plants?</Text>
        <View style={pestStyles.chips}>
          {SYMPTOMS.map((s) => {
            const selected = selectedSymptoms.includes(s);
            return (
              <TouchableOpacity
                key={s}
                onPress={() => toggleSymptom(s)}
                style={[pestStyles.chip, selected && pestStyles.chipSelected]}
              >
                <Text style={[pestStyles.chipText, selected && pestStyles.chipTextSelected]}>
                  {s}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {selectedSymptoms.length >= 2 && (
          <View style={pestStyles.matchResult}>
            <Text style={pestStyles.matchTitle}>Best match: Fall Armyworm — 94% confidence</Text>
            <Text style={pestStyles.matchSub}>{selectedSymptoms.length} symptoms matched · Critical severity</Text>
          </View>
        )}
      </Card>

      {/* Active threats */}
      <SectionTitle label={`Active threats — ${threats?.total_threats ?? 0} found`} />
      {allThreats.length === 0 ? (
        <Card><EmptyState icon="✅" title="No threats detected" message="All clear for this month." /></Card>
      ) : (
        allThreats.map((threat) => (
          <Card key={threat.id}
            borderLeftColor={SEVERITY_COLORS[threat.severity] ?? Colors.slate300}>
            <View style={pestStyles.threatHeader}>
              <View style={{ flex: 1 }}>
                <Text style={pestStyles.threatName}>{threat.name}</Text>
                <Text style={pestStyles.threatSym}>{threat.symptoms_preview.join(' · ')}</Text>
                <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
                  <Badge
                    label={threat.severity.charAt(0).toUpperCase() + threat.severity.slice(1)}
                    variant={threat.severity === 'critical' ? 'red' : threat.severity === 'high' ? 'amber' : 'blue'}
                  />
                  {threat.in_season && <Badge label="In season" variant="gray" />}
                  {threat.organic_options && <Badge label="Organic option" variant="green" />}
                </View>
              </View>
            </View>
          </Card>
        ))
      )}
      <View style={{ height: 16 }} />
    </ScrollView>
  );
}

// ── Main CalendarScreen ────────────────────────────────────────────────────────
export function CalendarScreen() {
  const activeTab    = useCalendarTab();
  const setCalTab    = useAppStore((s) => s.setCalendarTab);

  return (
    <View style={styles.screen}>
      <SubTabBar active={activeTab} onChange={setCalTab} />
      {activeTab === 'calendar' && <CalendarTab />}
      {activeTab === 'advice'   && <AdviceTab />}
      {activeTab === 'pests'    && <PestsTab />}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  phaseBlock: {
    backgroundColor: Colors.white,
    paddingTop: 14,
    paddingBottom: 14,
    marginBottom: 1,
  },
  dayPill: {
    alignSelf: 'center',
    backgroundColor: Colors.green050,
    borderWidth: 1,
    borderColor: Colors.green100,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 8,
  },
  dayPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.green700,
    textAlign: 'center',
  },
  alertCard: {
    backgroundColor: Colors.red100,
    borderWidth: 1.5,
    borderColor: '#FECACA',
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing[4],
    marginBottom: 10,
    padding: 12,
  },
  alertTitle: { fontSize: 13, fontWeight: '700', color: Colors.red500 },
  alertMsg:   { fontSize: 11, color: '#B91C1C', marginTop: 3, lineHeight: 16 },
  upcomingWrap: { opacity: 0.7 },
});

const tabStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate100,
    paddingHorizontal: Spacing[4],
  },
  tab: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: Colors.green600 },
  tabText:   { fontSize: 13, fontWeight: '600', color: Colors.slate400 },
  tabTextActive: { color: Colors.green600 },
});

const phStyles = StyleSheet.create({
  wrap: { paddingHorizontal: 20 },
  row:  { flexDirection: 'row', position: 'relative', alignItems: 'center' },
  connector: {
    position: 'absolute',
    top: 13,
    left: '8%',
    right: '8%',
    height: 2,
    backgroundColor: Colors.slate100,
    zIndex: 0,
  },
  connectorFill: { height: '100%', backgroundColor: Colors.green600, borderRadius: 1 },
  step:  { flex: 1, alignItems: 'center', gap: 4, zIndex: 1 },
  circle: {
    width: 27, height: 27, borderRadius: 14,
    backgroundColor: Colors.white,
    borderWidth: 2, borderColor: Colors.slate100,
    alignItems: 'center', justifyContent: 'center',
  },
  circleDone:   { backgroundColor: Colors.green600, borderColor: Colors.green600 },
  circleActive: { backgroundColor: Colors.amber500, borderColor: Colors.amber500,
    shadowColor: Colors.amber500, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 4, elevation: 3 },
  circleText:       { fontSize: 11, fontWeight: '700', color: Colors.slate400 },
  circleTextActive: { color: Colors.white },
  stepLabel:        { fontSize: 9, color: Colors.slate400, fontWeight: '500', textAlign: 'center' },
  stepLabelActive:  { color: Colors.amber700, fontWeight: '700' },
});

const recStyles = StyleSheet.create({
  header:    { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  rankBubble: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: Colors.slate100,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  rankBubble1: { backgroundColor: Colors.green600 },
  rankBubble2: { backgroundColor: Colors.green100 },
  rankText:  { fontSize: 13, fontWeight: '700', color: Colors.slate700 },
  cropName:  { fontSize: 16, fontWeight: '700', color: Colors.slate900 },
  cropLocal: { fontSize: 11, color: Colors.slate400, marginTop: 1 },
  scoreText: { fontSize: 22, fontWeight: '700', color: Colors.green600, fontVariant: ['tabular-nums'] },
  footer:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderTopWidth: 1, borderTopColor: Colors.slate050, marginTop: 10, paddingTop: 9 },
  variety:   { fontSize: 12, color: Colors.slate600 },
  notes:     { marginTop: 9, backgroundColor: Colors.green050, borderRadius: BorderRadius.sm, padding: 9 },
  noteText:  { fontSize: 12, color: Colors.green700, lineHeight: 18, marginBottom: 3 },
});

const pestStyles = StyleSheet.create({
  symTitle: { fontSize: 13, fontWeight: '700', color: Colors.slate900, marginBottom: 9 },
  chips:    { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    paddingHorizontal: 11, paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1.5, borderColor: Colors.slate100,
    backgroundColor: Colors.slate050,
  },
  chipSelected: { backgroundColor: Colors.red100, borderColor: Colors.red500 },
  chipText:     { fontSize: 11, fontWeight: '600', color: Colors.slate700 },
  chipTextSelected: { color: Colors.red500 },
  matchResult: { marginTop: 10, backgroundColor: Colors.green050, borderRadius: BorderRadius.sm, padding: 9, borderWidth: 1, borderColor: Colors.green100 },
  matchTitle:  { fontSize: 12, fontWeight: '700', color: Colors.green700 },
  matchSub:    { fontSize: 11, color: Colors.green600, marginTop: 2 },
  threatHeader: { flexDirection: 'row', gap: 10 },
  threatName:   { fontSize: 14, fontWeight: '700', color: Colors.slate900 },
  threatSym:    { fontSize: 11, color: Colors.slate600, marginTop: 4, lineHeight: 16 },
});
