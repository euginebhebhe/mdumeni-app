// src/types/index.ts
// Complete type definitions for the MDUMENI app

// ── Sensor ────────────────────────────────────────────────────────────────────
export interface SensorReading {
  id?: number;
  device_id: string;
  soil_ph: number;
  moisture_pct: number;
  temp_c: number;
  battery_pct: number;
  signal_rssi?: number;
  recorded_at: string;   // ISO string
  is_synced: 0 | 1;
}

export interface SensorState {
  latest: SensorReading | null;
  isConnected: boolean;
  deviceId: string | null;
  lastUpdated: string | null;
}

// ── Farmer profile ────────────────────────────────────────────────────────────
export type BudgetLevel = 'low' | 'medium' | 'high';
export type Language   = 'english' | 'shona' | 'ndebele';

export interface FarmerProfile {
  agro_region:    1 | 2 | 3 | 4 | 5;
  farm_size_ha:   number;
  has_irrigation: boolean;
  budget_level:   BudgetLevel;
  language:       Language;
  province:       string;
  district:       string;
  updated_at:     string;
}

// ── Active crop ───────────────────────────────────────────────────────────────
export interface ActiveCrop {
  id?: number;
  crop_id:        string;
  crop_name:      string;
  planting_date:  string;    // ISO string
  farm_size_ha:   number;
  budget_level:   BudgetLevel;
  is_active:      0 | 1;
}

// ── API — Crop Recommendation Engine ─────────────────────────────────────────
export interface ScoreBreakdown {
  soil_ph:        number;
  soil_moisture:  number;
  region_fit:     number;
  temperature:    number;
  irrigation_fit: number;
  budget_fit:     number;
}

export interface SeedVariety {
  name:          string;
  type:          string;
  maturity_days: number;
  yield_t_ha:    number;
  input_level:   BudgetLevel;
}

export interface CropRecommendation {
  rank:               number;
  crop_id:            string;
  crop_name:          string;
  score:              number;
  score_pct:          number;
  viable:             boolean;
  in_season:          boolean;
  breakdown:          ScoreBreakdown;
  selected_variety:   SeedVariety;
  expected_yield_t_ha: number;
  market_price_usd_kg: number;
  market_demand:      string;
  agronomic_notes:    string[];
  disqualifiers:      string[];
  local_name_shona?:  string;
  local_name_ndebele?: string;
}

export interface RecommendResult {
  recommendations: CropRecommendation[];
  total_viable:    number;
  total_assessed:  number;
  input_summary:   Record<string, unknown>;
  generated_at:    string;
}

// ── API — Calendar Engine ─────────────────────────────────────────────────────
export interface CalendarPhase {
  number:     number;
  name:       string;
  start_day:  number;
  end_day:    number;
  progress_pct: number;
}

export interface CalendarTask {
  title:       string;
  description: string;
  message: string;
  type:        'instruction' | 'fertiliser' | 'pest_check' | 'water' | 'harvest';
  due_date?:   string;
  priority:    'high' | 'medium' | 'low';
}

export interface CalendarAlert {
  message:   string;
  severity:  'critical' | 'warning' | 'info';
  field:     string;
  value:     number;
  threshold: number;
}

export interface CalendarResult {
  crop_id:            string;
  crop_name:          string;
  days_since_planting: number;
  current_phase:      CalendarPhase;
  progress_pct:       number;
  days_to_harvest:    number;
  season_complete:    boolean;
  alerts:             CalendarAlert[];
  tasks_today:        CalendarTask[];
  tasks_upcoming:     CalendarTask[];
  harvest_ready:      boolean;
  generated_at:       string;
}

// ── API — Planning Engine ─────────────────────────────────────────────────────
export interface CostLine {
  category:     string;
  description:  string;
  amount_usd:   number;
}

export interface ScenarioPlan {
  budget_level:        BudgetLevel;
  total_cost_usd:      number;
  expected_yield_kg:   number;
  gross_revenue_usd:   number;
  net_profit_usd:      number;
  roi_pct:             number;
}

export interface PlanResult {
  crop_id:              string;
  crop_name:            string;
  farm_size_ha:         number;
  budget_level:         BudgetLevel;
  expected_yield_kg:    number;
  yield_t_ha:           number;
  market_price_usd_kg:  number;
  gross_revenue_usd:    number;
  total_cost_usd:       number;
  net_profit_usd:       number;
  roi_pct:              number;
  break_even_yield_kg:  number;
  margin_of_safety_pct: number;
  profit_per_ha_usd:    number;
  cost_lines:           CostLine[];
  scenarios:            Record<BudgetLevel, ScenarioPlan>;
  harvest_plan:         HarvestPlan;
  generated_at:         string;
}

export interface HarvestPlan {
  expected_harvest_month: string;
  storage_advice:         string;
  market_advice:          string;
  rotation_suggestion:    string;
}

// ── API — Pest & Disease Engine ───────────────────────────────────────────────
export interface ThreatSummary {
  id:               string;
  category:         'pest' | 'disease';
  name:             string;
  severity:         'critical' | 'high' | 'medium' | 'low';
  in_season:        boolean;
  symptoms_preview: string[];
  treatment_count:  number;
  organic_options:  boolean;
}

export interface ThreatsResult {
  crop_id:       string;
  month:         number;
  pests:         ThreatSummary[];
  diseases:      ThreatSummary[];
  total_threats: number;
}

export interface DiagnosisResult {
  id:               string;
  category:         'pest' | 'disease';
  name:             string;
  scientific_name:  string;
  confidence_pct:   number;
  matched_symptoms: string[];
  severity:         string;
  in_season:        boolean;
  scouting_method:  string;
  treatments:       Treatment[];
  prevention:       string[];
  urgency:          'immediate' | 'monitor' | 'low';
}

export interface Treatment {
  type:     'chemical' | 'organic' | 'cultural';
  product:  string;
  rate:     string;
  timing:   string;
  notes?:   string;
  estimated_cost_usd?: number;
}

export interface TreatmentPlan {
  pest_disease_id:      string;
  name:                 string;
  category:             string;
  severity:             string;
  farm_size_ha:         number;
  budget_level:         BudgetLevel;
  recommended_products: (Treatment & { estimated_cost_usd: number })[];
  total_cost_usd:       number;
  application_notes:    string[];
  organic_only:         boolean;
}

// ── API — Session (composite) ─────────────────────────────────────────────────
export interface SessionRequest {
  soil_ph:             number;
  soil_moisture_pct:   number;
  soil_temp_c:         number;
  agro_region:         number;
  has_irrigation:      boolean;
  budget_level:        BudgetLevel;
  planting_month:      number;
  farm_size_ha:        number;
  active_crop_id?:     string | null;
  days_since_planting?: number | null;
}

export interface SessionResponse {
  crop_recommendations: RecommendResult;
  daily_calendar?:      CalendarResult;
  crop_threats?:        ThreatsResult;
  crop_plan?:           PlanResult;
  generated_at:         string;
  from_cache?:          boolean;
}

// ── Response cache ────────────────────────────────────────────────────────────
export interface ResponseCache {
  key:        string;
  data:       string;   // JSON blob
  cached_at:  string;
  expires_at: string;
}

// ── Navigation ────────────────────────────────────────────────────────────────
export type RootTabParamList = {
  Home:      undefined;
  Calendar:  undefined;
  Analytics: undefined;
  Chat:      undefined;
  Settings:  undefined;
};

export type CalendarSubTab = 'calendar' | 'advice' | 'pests';

// ── UI helpers ────────────────────────────────────────────────────────────────
export type AlertSeverity = 'critical' | 'warning' | 'info';
export type TaskType = CalendarTask['type'];
