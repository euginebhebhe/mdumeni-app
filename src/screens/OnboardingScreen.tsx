// src/screens/OnboardingScreen.tsx
// Complete first-run setup flow — 6 steps
// Welcome → Province/District → Agro-region → Farm size → Irrigation/Budget → Done
// Saves to SQLite + Zustand, triggers first /session call

import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, Switch, Dimensions, Animated,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/store';
import { saveProfile, setActiveCrop } from '@/db/database';
import { useSession } from '@/hooks/useSession';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import type { BudgetLevel } from '@/types';

const { width: SW } = Dimensions.get('window');

// ── Data ──────────────────────────────────────────────────────────────────────
// Province and district data now comes from the province index,
// which loads from the bundled JSON province files.
// The hardcoded list is gone — districts are authoritative from the data files.

import { getAllProvinceNames, getDistrictNames, preloadProvince } from '@/data/provinceIndex';

const AGRO_REGIONS = [
  {
    num: 1,
    name: 'Region I — Highveld',
    rainfall: 'Over 1,000 mm/year',
    temp: 'Cool — 14–18°C',
    description: 'Eastern highlands. Best for tea, coffee, timber, dairy. Nyanga, Chimanimani, Chipinge.',
    crops: 'Tea · Coffee · Wheat · Barley · Potatoes · Cabbages',
    color: '#0C447C',
  },
  {
    num: 2,
    name: 'Region II — Intensive Cropping',
    rainfall: '750–1,000 mm/year',
    temp: 'Moderate — 18–22°C',
    description: 'Most productive farming land. Mashonaland provinces. Maize, tobacco, soy.',
    crops: 'Maize · Tobacco · Soybeans · Groundnuts · Cotton · Sunflower',
    color: '#1A5C2A',
  },
  {
    num: 3,
    name: 'Region III — Semi-Intensive',
    rainfall: '650–800 mm/year',
    temp: 'Warm — 20–24°C',
    description: 'Midlands and parts of Masvingo. Mixed farming, drought years possible.',
    crops: 'Maize · Sorghum · Groundnuts · Sunflower · Livestock',
    color: '#237533',
  },
  {
    num: 4,
    name: 'Region IV — Semi-Arid',
    rainfall: '450–650 mm/year',
    temp: 'Hot — 22–28°C',
    description: 'Matabeleland and Masvingo lowveld. Drought-tolerant crops essential.',
    crops: 'Sorghum · Pearl millet · Groundnuts · Cowpeas · Livestock',
    color: '#EF9F27',
  },
  {
    num: 5,
    name: 'Region V — Arid',
    rainfall: 'Under 450 mm/year',
    temp: 'Very hot — 26–32°C',
    description: 'Lowveld. Limpopo and Zambezi valleys. Very dry. Specialist farming only.',
    crops: 'Sesame · Pearl millet · Livestock · Wildlife ranching',
    color: '#DC3545',
  },
];

const BUDGET_OPTIONS: { key: BudgetLevel; label: string; desc: string; icon: string }[] = [
  {
    key:   'low',
    label: 'Low input',
    desc:  'Open-pollinated seeds, organic fertiliser, minimal chemicals. Under $300/ha.',
    icon:  '🌱',
  },
  {
    key:   'medium',
    label: 'Medium input',
    desc:  'Hybrid seeds, compound fertiliser, some chemicals. $300–600/ha.',
    icon:  '🌿',
  },
  {
    key:   'high',
    label: 'High input',
    desc:  'Premium hybrid seeds, full fertiliser programme, full chemical cover. Over $600/ha.',
    icon:  '🌾',
  },
];

// ── Step indicator ─────────────────────────────────────────────────────────────
function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <View style={dotStyles.row}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[
            dotStyles.dot,
            i < current  && dotStyles.done,
            i === current && dotStyles.active,
          ]}
        />
      ))}
    </View>
  );
}

// ── Option card ────────────────────────────────────────────────────────────────
function OptionCard({
  selected, onPress, children,
}: {
  selected: boolean;
  onPress: () => void;
  children: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      style={[optStyles.card, selected && optStyles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {children}
      <View style={[optStyles.check, selected && optStyles.checkSelected]}>
        {selected && <Text style={optStyles.checkText}>✓</Text>}
      </View>
    </TouchableOpacity>
  );
}

// ── Nav buttons ────────────────────────────────────────────────────────────────
function NavButtons({
  onBack, onNext, onSkip,
  nextLabel = 'Continue',
  nextDisabled = false,
  showBack = true,
  showSkip = false,
}: {
  onBack?: () => void;
  onNext: () => void;
  onSkip?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  showBack?: boolean;
  showSkip?: boolean;
}) {
  return (
    <View style={navStyles.row}>
      {showBack && onBack ? (
        <TouchableOpacity style={navStyles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Text style={navStyles.backText}>← Back</Text>
        </TouchableOpacity>
      ) : <View style={{ width: 80 }} />}

      <TouchableOpacity
        style={[navStyles.nextBtn, nextDisabled && navStyles.nextBtnDisabled]}
        onPress={onNext}
        disabled={nextDisabled}
        activeOpacity={0.8}
      >
        <Text style={navStyles.nextText}>{nextLabel}</Text>
      </TouchableOpacity>

      {showSkip && onSkip ? (
        <TouchableOpacity onPress={onSkip} activeOpacity={0.7} style={{ width: 80, alignItems: 'flex-end' }}>
          <Text style={navStyles.skipText}>Skip</Text>
        </TouchableOpacity>
      ) : <View style={{ width: 80 }} />}
    </View>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// STEP 0 — WELCOME
// ══════════════════════════════════════════════════════════════════════════════
function WelcomeStep({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.step, { paddingTop: insets.top + 20 }]}>
      <View style={s.welcomeHero}>
        <View style={s.logoBox}>
          <Text style={s.logoEmoji}>🌱</Text>
        </View>
        <Text style={s.welcomeTitle}>
          MDU<Text style={{ color: Colors.amber500 }}>MENI</Text>
        </Text>
        <Text style={s.welcomeSub}>Your digital farming guide</Text>
      </View>

      <View style={s.featureList}>
        {[
          ['🧠', 'AI crop recommendations', 'Based on your real soil conditions'],
          ['📅', 'Step-by-step calendar',   'Daily tasks from planting to harvest'],
          ['💬', 'Ask any farming question', 'AI assistant knows your farm'],
          ['🔌', 'Works offline',            'No internet needed in the field'],
        ].map(([icon, title, desc]) => (
          <View key={title} style={s.featureRow}>
            <Text style={s.featureIcon}>{icon}</Text>
            <View>
              <Text style={s.featureTitle}>{title}</Text>
              <Text style={s.featureDesc}>{desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={s.welcomeFooter}>
        <TouchableOpacity style={s.primaryBtn} onPress={onNext} activeOpacity={0.85}>
          <Text style={s.primaryBtnText}>Set up my farm →</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSkip} activeOpacity={0.7} style={{ marginTop: 14 }}>
          <Text style={s.skipLink}>Skip — use demo data</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// STEP 1 — PROVINCE & DISTRICT
// ══════════════════════════════════════════════════════════════════════════════
function ProvinceStep({
  province, district,
  onProvince, onDistrict,
  onNext, onBack,
}: {
  province: string; district: string;
  onProvince: (p: string) => void; onDistrict: (d: string) => void;
  onNext: () => void; onBack: () => void;
}) {
  const provinces = getAllProvinceNames();
  const districts = province ? getDistrictNames(province) : [];

  // Preload the selected province's data in the background so services
  // are ready by the time the farmer reaches the main app.
  React.useEffect(() => {
    if (province) preloadProvince(province);
  }, [province]);

  return (
    <View style={s.step}>
      <Text style={s.stepTitle}>Where is your farm?</Text>
      <Text style={s.stepSub}>Select your province and district</Text>

      <Text style={s.fieldLabel}>Province</Text>
      <ScrollView style={s.optionList} showsVerticalScrollIndicator={false} nestedScrollEnabled>
        {provinces.map((p) => (
          <OptionCard key={p} selected={province === p} onPress={() => { onProvince(p); onDistrict(''); }}>
            <Text style={[optStyles.label, province === p && optStyles.labelSelected]}>{p}</Text>
          </OptionCard>
        ))}
      </ScrollView>

      {province !== '' && (
        <>
          <Text style={[s.fieldLabel, { marginTop: 14 }]}>District</Text>
          <ScrollView style={[s.optionList, { maxHeight: 180 }]} showsVerticalScrollIndicator={false} nestedScrollEnabled>
            {districts.map((d) => (
              <OptionCard key={d} selected={district === d} onPress={() => onDistrict(d)}>
                <Text style={[optStyles.label, district === d && optStyles.labelSelected]}>{d}</Text>
              </OptionCard>
            ))}
          </ScrollView>
        </>
      )}

      <NavButtons
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!province || !district}
      />
    </View>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// STEP 2 — AGRO-ECOLOGICAL REGION
// ══════════════════════════════════════════════════════════════════════════════
function RegionStep({
  region, onRegion, onNext, onBack,
}: {
  region: number; onRegion: (r: number) => void;
  onNext: () => void; onBack: () => void;
}) {
  return (
    <View style={s.step}>
      <Text style={s.stepTitle}>Your agro-ecological region</Text>
      <Text style={s.stepSub}>This determines which crops the AI recommends</Text>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} nestedScrollEnabled>
        {AGRO_REGIONS.map((r) => (
          <TouchableOpacity
            key={r.num}
            style={[regionStyles.card, region === r.num && { borderColor: r.color, borderWidth: 2 }]}
            onPress={() => onRegion(r.num)}
            activeOpacity={0.75}
          >
            <View style={regionStyles.header}>
              <View style={[regionStyles.numBadge, { backgroundColor: r.color }]}>
                <Text style={regionStyles.numText}>{r.num}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[regionStyles.name, region === r.num && { color: r.color }]}>{r.name}</Text>
                <Text style={regionStyles.rain}>{r.rainfall} · {r.temp}</Text>
              </View>
              {region === r.num && (
                <View style={[regionStyles.check, { backgroundColor: r.color }]}>
                  <Text style={{ color: 'white', fontSize: 12, fontWeight: '700' }}>✓</Text>
                </View>
              )}
            </View>
            <Text style={regionStyles.desc}>{r.description}</Text>
            <View style={regionStyles.cropRow}>
              <Text style={regionStyles.cropLabel}>Typical crops: </Text>
              <Text style={regionStyles.cropVal}>{r.crops}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <NavButtons onBack={onBack} onNext={onNext} nextDisabled={region === 0} />
    </View>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// STEP 3 — FARM SIZE
// ══════════════════════════════════════════════════════════════════════════════
function FarmSizeStep({
  farmSize, onFarmSize, onNext, onBack,
}: {
  farmSize: string; onFarmSize: (s: string) => void;
  onNext: () => void; onBack: () => void;
}) {
  const parsed = parseFloat(farmSize);
  const valid  = !isNaN(parsed) && parsed > 0 && parsed <= 500;

  const PRESETS = ['0.5', '1', '2', '2.4', '5', '10'];

  return (
    <KeyboardAvoidingView
      style={s.step}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={s.stepTitle}>How big is your farm?</Text>
      <Text style={s.stepSub}>Enter the size in hectares (ha)</Text>

      <View style={sizeStyles.inputWrap}>
        <TextInput
          style={sizeStyles.input}
          value={farmSize}
          onChangeText={onFarmSize}
          keyboardType="decimal-pad"
          placeholder="e.g. 2.4"
          placeholderTextColor={Colors.slate300}
          maxLength={6}
        />
        <Text style={sizeStyles.unit}>ha</Text>
      </View>

      {farmSize !== '' && !valid && (
        <Text style={sizeStyles.error}>Enter a number between 0.1 and 500</Text>
      )}

      <Text style={[s.fieldLabel, { marginTop: 20 }]}>Quick select</Text>
      <View style={sizeStyles.presetRow}>
        {PRESETS.map((p) => (
          <TouchableOpacity
            key={p}
            style={[sizeStyles.preset, farmSize === p && sizeStyles.presetActive]}
            onPress={() => onFarmSize(p)}
          >
            <Text style={[sizeStyles.presetText, farmSize === p && sizeStyles.presetTextActive]}>
              {p} ha
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {valid && (
        <View style={sizeStyles.estimate}>
          <Text style={sizeStyles.estimateText}>
            At low input, {parsed} ha of maize yields approximately{' '}
            <Text style={{ fontWeight: '700', color: Colors.green600 }}>
              {(parsed * 2500).toLocaleString()} kg
            </Text>{' '}
            per season
          </Text>
        </View>
      )}

      <NavButtons onBack={onBack} onNext={onNext} nextDisabled={!valid} />
    </KeyboardAvoidingView>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// STEP 4 — IRRIGATION & BUDGET
// ══════════════════════════════════════════════════════════════════════════════
function IrrigationBudgetStep({
  irrigation, budget,
  onIrrigation, onBudget,
  onNext, onBack,
}: {
  irrigation: boolean; budget: BudgetLevel;
  onIrrigation: (v: boolean) => void; onBudget: (b: BudgetLevel) => void;
  onNext: () => void; onBack: () => void;
}) {
  return (
    <View style={s.step}>
      <Text style={s.stepTitle}>Water & budget</Text>
      <Text style={s.stepSub}>This shapes every recommendation the AI gives you</Text>

      {/* Irrigation */}
      <View style={ibStyles.irrigationCard}>
        <View style={{ flex: 1 }}>
          <Text style={ibStyles.irrigationTitle}>Irrigation available</Text>
          <Text style={ibStyles.irrigationSub}>
            {irrigation
              ? 'Irrigation crops will be recommended'
              : 'Rain-fed crops only — no irrigation penalty'}
          </Text>
        </View>
        <Switch
          value={irrigation}
          onValueChange={onIrrigation}
          trackColor={{ false: Colors.slate200, true: Colors.green600 }}
          thumbColor={Colors.white}
        />
      </View>

      {/* Budget */}
      <Text style={[s.fieldLabel, { marginTop: 20 }]}>Input budget level</Text>
      {BUDGET_OPTIONS.map((opt) => (
        <OptionCard key={opt.key} selected={budget === opt.key} onPress={() => onBudget(opt.key)}>
          <View style={ibStyles.budgetRow}>
            <Text style={ibStyles.budgetIcon}>{opt.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[ibStyles.budgetLabel, budget === opt.key && { color: Colors.green600 }]}>
                {opt.label}
              </Text>
              <Text style={ibStyles.budgetDesc}>{opt.desc}</Text>
            </View>
          </View>
        </OptionCard>
      ))}

      <NavButtons onBack={onBack} onNext={onNext} nextLabel="Save my farm" />
    </View>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// STEP 5 — DONE
// ══════════════════════════════════════════════════════════════════════════════
function DoneStep({
  province, district, region, farmSize, budget, irrigation,
  onFinish,
}: {
  province: string; district: string; region: number;
  farmSize: string; budget: BudgetLevel; irrigation: boolean;
  onFinish: () => void;
}) {
  const regionName = AGRO_REGIONS.find((r) => r.num === region)?.name ?? '';
  return (
    <View style={[s.step, s.doneStep]}>
      <View style={doneStyles.iconWrap}>
        <Text style={doneStyles.icon}>✅</Text>
      </View>
      <Text style={doneStyles.title}>Farm set up!</Text>
      <Text style={doneStyles.sub}>MDUMENI is ready to guide your {farmSize} ha farm</Text>

      <View style={doneStyles.summaryCard}>
        {[
          ['📍', 'Location',  `${district}, ${province}`],
          ['🗺', 'Region',    regionName],
          ['📐', 'Farm size', `${farmSize} hectares`],
          ['💧', 'Irrigation', irrigation ? 'Available' : 'Rain-fed only'],
          ['💰', 'Budget',    `${budget.charAt(0).toUpperCase() + budget.slice(1)} input`],
        ].map(([icon, label, value]) => (
          <View key={label} style={doneStyles.row}>
            <Text style={doneStyles.rowIcon}>{icon}</Text>
            <Text style={doneStyles.rowLabel}>{label}</Text>
            <Text style={doneStyles.rowValue}>{value}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={s.primaryBtn} onPress={onFinish} activeOpacity={0.85}>
        <Text style={s.primaryBtnText}>Open MDUMENI →</Text>
      </TouchableOpacity>
    </View>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN ONBOARDING SCREEN
// ══════════════════════════════════════════════════════════════════════════════
export function OnboardingScreen({ onComplete }: { onComplete: () => void }) {
  const db             = useSQLiteContext();
  const setProfile     = useAppStore((s) => s.setProfile);
  const setOnboarding  = useAppStore((s) => s.setOnboardingDone);
  const { refresh }    = useSession();

  const [step,       setStep]       = useState(0);
  const [province,   setProvince]   = useState('');
  const [district,   setDistrict]   = useState('');
  const [region,     setRegion]     = useState<number>(0);
  const [farmSize,   setFarmSize]   = useState('');
  const [irrigation, setIrrigation] = useState(false);
  const [budget,     setBudget]     = useState<BudgetLevel>('low');

  const TOTAL_STEPS = 5; // 0=welcome, 1=location, 2=region, 3=size, 4=irr/budget, 5=done

  const next = () => setStep((s) => Math.min(s + 1, 5));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const saveAndFinish = async () => {
    const profile = {
      agro_region:    region as 1|2|3|4|5,
      farm_size_ha:   parseFloat(farmSize),
      has_irrigation: irrigation,
      budget_level:   budget,
      language:       'english' as const,
      province,
      district,
      updated_at:     new Date().toISOString(),
    };
    await saveProfile(db, profile);
    setProfile(profile);
    setOnboarding(true);
    next(); // go to done screen
  };

  const skipToDemo = async () => {
    // Seed a sensible demo profile and go straight in
    const demo = {
      agro_region:    2 as const,
      farm_size_ha:   2.4,
      has_irrigation: false,
      budget_level:   'low' as const,
      language:       'english' as const,
      province:       'Harare',
      district:       'Mount Pleasant',
      updated_at:     new Date().toISOString(),
    };
    await saveProfile(db, demo);
    setProfile(demo);
    setOnboarding(true);
    onComplete();
  };

  const finish = async () => {
    await refresh(); // trigger first real /session call with new profile
    onComplete();
  };

  return (
    <View style={s.screen}>
      {/* Progress dots — hide on welcome and done */}
      {step > 0 && step < 5 && (
        <View style={s.dotsWrap}>
          <StepDots total={TOTAL_STEPS} current={step - 1} />
        </View>
      )}

      {step === 0 && <WelcomeStep onNext={next} onSkip={skipToDemo} />}
      {step === 1 && (
        <ProvinceStep
          province={province} district={district}
          onProvince={setProvince} onDistrict={setDistrict}
          onNext={next} onBack={back}
        />
      )}
      {step === 2 && (
        <RegionStep
          region={region} onRegion={setRegion}
          onNext={next} onBack={back}
        />
      )}
      {step === 3 && (
        <FarmSizeStep
          farmSize={farmSize} onFarmSize={setFarmSize}
          onNext={next} onBack={back}
        />
      )}
      {step === 4 && (
        <IrrigationBudgetStep
          irrigation={irrigation} budget={budget}
          onIrrigation={setIrrigation} onBudget={setBudget}
          onNext={saveAndFinish} onBack={back}
        />
      )}
      {step === 5 && (
        <DoneStep
          province={province} district={district}
          region={region} farmSize={farmSize}
          budget={budget} irrigation={irrigation}
          onFinish={finish}
        />
      )}
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.white },
  step:   { flex: 1, paddingHorizontal: Spacing[4], paddingBottom: Spacing[4] },
  doneStep: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing[6] },
  dotsWrap: { paddingTop: 52, paddingBottom: 8, alignItems: 'center' },

  // Welcome
  welcomeHero: { alignItems: 'center', paddingTop: 20, paddingBottom: 28 },
  logoBox: {
    width: 72, height: 72,
    backgroundColor: Colors.green600,
    borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
    ...Shadows.md,
  },
  logoEmoji:     { fontSize: 34 },
  welcomeTitle:  { fontSize: 38, fontWeight: '800', color: Colors.green700, letterSpacing: -1 },
  welcomeSub:    { fontSize: 16, color: Colors.slate400, marginTop: 4 },
  featureList:   { flex: 1, gap: 16 },
  featureRow:    { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  featureIcon:   { fontSize: 26, width: 36, textAlign: 'center' },
  featureTitle:  { fontSize: 15, fontWeight: '600', color: Colors.slate900 },
  featureDesc:   { fontSize: 13, color: Colors.slate400, marginTop: 2 },
  welcomeFooter: { paddingTop: 20 },

  // Shared
  stepTitle:  { fontSize: 24, fontWeight: '800', color: Colors.slate900, marginTop: 16, marginBottom: 4, letterSpacing: -0.3 },
  stepSub:    { fontSize: 14, color: Colors.slate400, marginBottom: 18 },
  fieldLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.05, textTransform: 'uppercase', color: Colors.slate400, marginBottom: 8 },
  optionList: { maxHeight: 220 },

  // Buttons
  primaryBtn: {
    backgroundColor: Colors.green600,
    borderRadius: BorderRadius.md,
    paddingVertical: 15,
    alignItems: 'center',
    ...Shadows.sm,
  },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white },
  skipLink:       { fontSize: 14, color: Colors.slate400, textAlign: 'center' },
});

const dotStyles = StyleSheet.create({
  row:    { flexDirection: 'row', gap: 6 },
  dot:    { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.slate100 },
  done:   { backgroundColor: Colors.green400 },
  active: { backgroundColor: Colors.green600, width: 20 },
});

const optStyles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.slate050,
    borderRadius: BorderRadius.sm,
    borderWidth: 1.5, borderColor: Colors.slate100,
    paddingVertical: 11, paddingHorizontal: 14,
    marginBottom: 7,
  },
  cardSelected: { backgroundColor: Colors.green050, borderColor: Colors.green400 },
  label:        { fontSize: 14, color: Colors.slate700, flex: 1 },
  labelSelected: { color: Colors.green700, fontWeight: '600' },
  check: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 1.5, borderColor: Colors.slate200,
    alignItems: 'center', justifyContent: 'center',
    marginLeft: 8,
  },
  checkSelected: { backgroundColor: Colors.green600, borderColor: Colors.green600 },
  checkText:     { fontSize: 11, color: Colors.white, fontWeight: '700' },
});

const navStyles = StyleSheet.create({
  row:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16 },
  backBtn: { paddingVertical: 10, paddingHorizontal: 4 },
  backText: { fontSize: 15, color: Colors.slate400, fontWeight: '500' },
  nextBtn: { backgroundColor: Colors.green600, paddingVertical: 12, paddingHorizontal: 28, borderRadius: BorderRadius.md, ...Shadows.sm },
  nextBtnDisabled: { backgroundColor: Colors.slate200 },
  nextText: { fontSize: 15, fontWeight: '700', color: Colors.white },
  skipText: { fontSize: 13, color: Colors.slate400 },
});

const regionStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5, borderColor: Colors.slate100,
    padding: 13, marginBottom: 10,
    ...Shadows.sm,
  },
  header:   { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 7 },
  numBadge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  numText:  { fontSize: 14, fontWeight: '700', color: Colors.white },
  name:     { fontSize: 14, fontWeight: '700', color: Colors.slate900 },
  rain:     { fontSize: 11, color: Colors.slate400, marginTop: 1 },
  desc:     { fontSize: 12, color: Colors.slate600, lineHeight: 17, marginBottom: 7 },
  cropRow:  { flexDirection: 'row', flexWrap: 'wrap' },
  cropLabel: { fontSize: 11, color: Colors.slate400, fontWeight: '600' },
  cropVal:   { fontSize: 11, color: Colors.green700, fontWeight: '500', flex: 1 },
  check:    { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
});

const sizeStyles = StyleSheet.create({
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 6 },
  input: {
    flex: 1, fontSize: 32, fontWeight: '700', color: Colors.slate900,
    borderBottomWidth: 2, borderBottomColor: Colors.green600,
    paddingVertical: 8, textAlign: 'center',
  },
  unit:     { fontSize: 20, fontWeight: '600', color: Colors.slate400, width: 30 },
  error:    { fontSize: 12, color: Colors.red500, textAlign: 'center', marginBottom: 8 },
  presetRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  preset:   { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.slate100, backgroundColor: Colors.slate050 },
  presetActive: { backgroundColor: Colors.green050, borderColor: Colors.green600 },
  presetText:   { fontSize: 13, color: Colors.slate600, fontWeight: '500' },
  presetTextActive: { color: Colors.green700, fontWeight: '700' },
  estimate: { marginTop: 16, backgroundColor: Colors.green050, borderRadius: BorderRadius.sm, padding: 12, borderWidth: 1, borderColor: Colors.green100 },
  estimateText: { fontSize: 13, color: Colors.green700, lineHeight: 19 },
});

const ibStyles = StyleSheet.create({
  irrigationCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.slate050, borderRadius: BorderRadius.md,
    borderWidth: 1.5, borderColor: Colors.slate100, padding: 14, marginBottom: 6,
  },
  irrigationTitle: { fontSize: 14, fontWeight: '600', color: Colors.slate900 },
  irrigationSub:   { fontSize: 12, color: Colors.slate400, marginTop: 2 },
  budgetRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 10, flex: 1 },
  budgetIcon: { fontSize: 22, width: 30, textAlign: 'center' },
  budgetLabel: { fontSize: 14, fontWeight: '600', color: Colors.slate900 },
  budgetDesc:  { fontSize: 12, color: Colors.slate400, marginTop: 2, lineHeight: 17 },
});

const doneStyles = StyleSheet.create({
  iconWrap:    { width: 72, height: 72, backgroundColor: Colors.green050, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  icon:        { fontSize: 34 },
  title:       { fontSize: 28, fontWeight: '800', color: Colors.green700, marginBottom: 6 },
  sub:         { fontSize: 14, color: Colors.slate400, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  summaryCard: { width: '100%', backgroundColor: Colors.slate050, borderRadius: BorderRadius.md, padding: 14, marginBottom: 24, borderWidth: 1, borderColor: Colors.slate100 },
  row:         { flexDirection: 'row', alignItems: 'center', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: Colors.white, gap: 8 },
  rowIcon:     { fontSize: 16, width: 24 },
  rowLabel:    { fontSize: 13, color: Colors.slate400, width: 80 },
  rowValue:    { fontSize: 13, fontWeight: '600', color: Colors.slate900, flex: 1 },
});