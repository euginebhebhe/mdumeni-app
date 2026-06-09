// src/engines/pestEngine.js
// JavaScript port of pest_engine/engine.py
// Three modes: threats(), diagnose(), treatmentPlan()
// Runs entirely on-device — no server, no internet required

import PEST_DATA from './pestDataset.json';

const { pests: PESTS, diseases: DISEASES, pestsByCrop: PESTS_BY_CROP, diseasesByCrop: DISEASES_BY_CROP } = PEST_DATA;

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const PRODUCT_COSTS = {
  emamectin: 35.0, proclaim: 35.0,
  chlorpyrifos: 8.0, dursban: 8.0,
  lambda: 12.0, karate: 12.0,
  carbofuran: 15.0, furadan: 15.0,
  spinosad: 45.0, tracer: 45.0,
  propiconazole: 18.0, tilt: 18.0,
  azoxystrobin: 22.0, amistar: 22.0,
  mancozeb: 5.0, dithane: 5.0,
  chlorothalonil: 8.0, bravo: 8.0,
  metalaxyl: 20.0, ridomil: 22.0,
  copper: 4.5, cuprox: 4.5,
  imidacloprid: 25.0, confidor: 25.0,
  abamectin: 30.0, dynamec: 30.0,
  dimethoate: 7.0, pirimicarb: 28.0,
  indoxacarb: 32.0, steward: 32.0,
  tebuconazole: 20.0, folicur: 20.0,
  spirotetramat: 38.0, movento: 38.0,
  cymoxanil: 18.0, curzate: 18.0,
  sulphur: 3.0, iprodione: 22.0,
  bt: 12.0, dipel: 12.0,
  neem: 5.5, pyrethrin: 8.0,
  soap: 3.0, 'mineral oil': 2.0,
  kaolin: 4.0, surround: 4.0,
  'wood ash': 0.5, kocide: 8.0,
  bicarbonate: 1.0, beauveria: 15.0,
};

const SEVERITY_WEIGHTS = { critical: 4.0, high: 3.0, medium: 2.0, low: 1.0 };

const STOPWORDS = new Set([
  'the','a','an','and','or','of','in','on','at','to','with','by',
  'is','are','has','have','be','been','from','than','more','less',
  'per','for','this','that','which','when','where','what','how',
  'may','can','will','not','no','some','all','any','very','most','also',
]);

// ── HELPERS ───────────────────────────────────────────────────────────────────
function tokenise(text) {
  return new Set(
    text.toLowerCase()
      .replace(/-/g, ' ').replace(/,/g, ' ').replace(/\./g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !STOPWORDS.has(w))
  );
}

function scoreSymptoms(record, queryTokens) {
  if (queryTokens.size === 0) return { score: 0.0, matched: [] };
  let matched = [];
  let totalOverlap = 0;
  for (const symptom of (record.symptoms ?? [])) {
    const symTokens = tokenise(symptom);
    const overlap   = [...queryTokens].filter(t => symTokens.has(t)).length;
    if (overlap > 0) {
      matched.push(symptom);
      totalOverlap += overlap;
    }
  }
  const score = Math.round((totalOverlap / queryTokens.size) * 10000) / 10000;
  return { score, matched };
}

function filterTreatments(treatments, budgetLevel) {
  const organic  = treatments.filter(t => t.type === 'organic');
  const chemical = treatments.filter(t => t.type === 'chemical');
  const cultural = treatments.filter(t => t.type === 'cultural');
  if (budgetLevel === 'low')    return [...(organic.length ? organic : chemical.slice(0,1)), ...cultural];
  if (budgetLevel === 'medium') return [...chemical.slice(0,1), ...organic.slice(0,1), ...cultural];
  return [...chemical, ...organic.slice(0,1), ...cultural];
}

function estimateProductCost(productName) {
  const lower = productName.toLowerCase();
  for (const [key, cost] of Object.entries(PRODUCT_COSTS)) {
    if (lower.includes(key)) return cost;
  }
  return 10.0;
}

function parseRateToAmount(rateStr, farmSizeHa) {
  const match = rateStr.match(/([\d.]+)\s*(mL|L|g|kg)/i);
  if (!match) return 1.0;
  let amount = parseFloat(match[1]);
  const unit = match[2].toLowerCase();
  if (unit === 'ml' || unit === 'g') amount /= 1000;
  return amount * farmSizeHa;
}

// ── MODE 1: THREATS ───────────────────────────────────────────────────────────
// Port of crop_threats() in engine.py
export function threats(cropId, month) {
  if (!cropId) throw new Error('cropId is required');
  if (month < 1 || month > 12) throw new Error('month must be 1–12');

  const summarise = (record, category) => {
    const inSeason = category === 'disease' ||
      (record.season_risk ?? Array.from({length:12},(_,i)=>i+1)).includes(month);
    const hasOrganic = (record.treatments ?? []).some(t => t.type === 'organic');
    return {
      id:               record.id,
      category,
      name:             record.common_name,
      severity:         record.severity,
      in_season:        inSeason,
      symptoms_preview: (record.symptoms ?? []).slice(0, 2),
      treatment_count:  (record.treatments ?? []).length,
      organic_options:  hasOrganic,
    };
  };

  const sortKey = t => [t.in_season ? 0 : 1, -(SEVERITY_WEIGHTS[t.severity] ?? 1.0)];

  const pestList    = (PESTS_BY_CROP[cropId]    ?? []).map(p => summarise(p, 'pest'));
  const diseaseList = (DISEASES_BY_CROP[cropId] ?? []).map(d => summarise(d, 'disease'));

  pestList.sort((a, b)    => sortKey(a)[0] - sortKey(b)[0] || sortKey(a)[1] - sortKey(b)[1]);
  diseaseList.sort((a, b) => sortKey(a)[0] - sortKey(b)[0] || sortKey(a)[1] - sortKey(b)[1]);

  return {
    crop_id:       cropId,
    month,
    pests:         pestList,
    diseases:      diseaseList,
    total_threats: pestList.length + diseaseList.length,
  };
}

// ── MODE 2: DIAGNOSE ──────────────────────────────────────────────────────────
// Port of diagnose() in engine.py
export function diagnose(cropId, symptoms, month, budgetLevel = 'medium', topN = 3) {
  if (!cropId)        throw new Error('cropId is required');
  if (!symptoms?.length) throw new Error('symptoms list cannot be empty');
  if (!['low','medium','high'].includes(budgetLevel))
    throw new Error('budgetLevel must be low / medium / high');

  const queryTokens = symptoms.reduce((acc, s) => {
    tokenise(s).forEach(t => acc.add(t));
    return acc;
  }, new Set());

  const urgencyMap = { critical: 'immediate', high: 'monitor', medium: 'low', low: 'low' };
  const candidates = [];

  for (const pest of (PESTS_BY_CROP[cropId] ?? [])) {
    const { score, matched } = scoreSymptoms(pest, queryTokens);
    if (score === 0 || !matched.length) continue;
    const inSeason   = (pest.season_risk ?? Array.from({length:12},(_,i)=>i+1)).includes(month);
    const sevWeight  = SEVERITY_WEIGHTS[pest.severity] ?? 1.0;
    const weighted   = score * sevWeight * (inSeason ? 1.3 : 0.7);
    candidates.push({
      id:               pest.id,
      category:         'pest',
      name:             pest.common_name,
      scientific_name:  pest.scientific_name ?? '',
      confidence_pct:   Math.min(99, Math.round(weighted * 35)),
      matched_symptoms: matched,
      severity:         pest.severity,
      in_season:        inSeason,
      scouting_method:  pest.scouting_method ?? '',
      treatments:       filterTreatments(pest.treatments ?? [], budgetLevel),
      prevention:       pest.prevention ?? [],
      urgency:          urgencyMap[pest.severity] ?? 'low',
    });
  }

  for (const disease of (DISEASES_BY_CROP[cropId] ?? [])) {
    const { score, matched } = scoreSymptoms(disease, queryTokens);
    if (score === 0 || !matched.length) continue;
    const sevWeight = SEVERITY_WEIGHTS[disease.severity] ?? 1.0;
    const weighted  = score * sevWeight;
    candidates.push({
      id:               disease.id,
      category:         'disease',
      name:             disease.common_name,
      scientific_name:  disease.scientific_name ?? '',
      confidence_pct:   Math.min(99, Math.round(weighted * 35)),
      matched_symptoms: matched,
      severity:         disease.severity,
      in_season:        true,
      scouting_method:  disease.scouting_method ?? '',
      treatments:       filterTreatments(disease.treatments ?? [], budgetLevel),
      prevention:       disease.prevention ?? [],
      urgency:          urgencyMap[disease.severity] ?? 'low',
    });
  }

  const urgencyOrder = { immediate: 0, monitor: 1, low: 2 };
  candidates.sort((a, b) =>
    b.confidence_pct - a.confidence_pct ||
    (urgencyOrder[a.urgency] ?? 3) - (urgencyOrder[b.urgency] ?? 3)
  );

  return candidates.slice(0, topN);
}

// ── MODE 3: TREATMENT PLAN ────────────────────────────────────────────────────
// Port of get_treatment_plan() in engine.py
export function treatmentPlan(pestDiseaseId, budgetLevel, farmSizeHa) {
  if (!['low','medium','high'].includes(budgetLevel))
    throw new Error('budgetLevel must be low / medium / high');
  if (farmSizeHa <= 0)
    throw new Error('farmSizeHa must be positive');

  const allPests    = PESTS    ?? [];
  const allDiseases = DISEASES ?? [];

  const record =
    allPests.find(p => p.id === pestDiseaseId) ??
    allDiseases.find(d => d.id === pestDiseaseId);

  if (!record) throw new Error(`ID '${pestDiseaseId}' not found in database`);

  const category   = pestDiseaseId.startsWith('PEST') ? 'pest' : 'disease';
  let treatments   = filterTreatments(record.treatments ?? [], budgetLevel);
  if (!treatments.length) treatments = record.treatments ?? [];

  const recommended = [];
  let totalCost     = 0;

  for (const t of treatments) {
    const product   = t.product ?? 'Unknown';
    const rateStr   = t.rate ?? '';
    const unitCost  = estimateProductCost(product);
    const amount    = parseRateToAmount(rateStr, farmSizeHa);
    const cost      = unitCost * amount;
    recommended.push({
      type:                t.type ?? 'chemical',
      product,
      rate:                rateStr,
      timing:              t.timing ?? '',
      notes:               t.notes ?? '',
      estimated_cost_usd:  Math.round(cost * 100) / 100,
    });
    totalCost += cost;
  }

  const severity = record.severity ?? 'medium';
  const notes    = [];
  if (severity === 'critical') {
    notes.push('URGENT: Apply treatment within 24 hours. Delay risks significant crop loss.');
  }
  notes.push(
    'Apply in early morning or late afternoon — heat reduces product effectiveness.',
    'Ensure good spray coverage — wet all leaf surfaces including undersides.',
    `Calibrate sprayer for ${farmSizeHa.toFixed(1)} ha. Incorrect calibration wastes product.`,
    'Use clean water. Alkaline water reduces effectiveness of many pesticides.',
  );
  if ((record.treatments ?? []).some(t => t.type === 'chemical')) {
    notes.push('Wear full PPE: gloves, goggles, respirator during application.');
    notes.push('Observe pre-harvest interval (PHI) from product label.');
  }
  notes.push('Record date, product, rate, and weather in your farm diary.');
  if (record.economic_threshold) {
    notes.push(`Retreat if: ${record.economic_threshold}`);
  }

  return {
    pest_disease_id:       pestDiseaseId,
    name:                  record.common_name ?? 'Unknown',
    category,
    severity,
    farm_size_ha:          farmSizeHa,
    budget_level:          budgetLevel,
    recommended_products:  recommended,
    total_cost_usd:        Math.round(totalCost * 100) / 100,
    application_notes:     notes,
    organic_only:          budgetLevel === 'low',
    source:                'offline-js-engine',
  };
}
