// src/engines/cropEngine.js
// JavaScript port of crop_engine/recommender.py
// Identical algorithm — same weights, same scoring functions, same output structure
// Runs entirely on-device — no server, no internet required

import CROPS from './cropDataset.json';

// ── WEIGHTS — must sum to 1.0 ─────────────────────────────────────────────────
const WEIGHTS = {
  soil_ph:        0.20,
  soil_moisture:  0.20,
  region_fit:     0.25,
  temperature:    0.15,
  irrigation_fit: 0.10,
  budget_fit:     0.10,
};

// ── CORE SCORING FUNCTION ─────────────────────────────────────────────────────
// Direct port of _range_score() in recommender.py
// Score in [0.0, 1.0] — 1.0 at optimal, scales to 0.6 at tolerance edge, 0.0 outside
function rangeScore(value, mn, mx, optimal) {
  if (value < mn || value > mx) return 0.0;
  const maxDistance = Math.max(optimal - mn, mx - optimal);
  if (maxDistance === 0) return 1.0;
  const distance = Math.abs(value - optimal);
  return Math.round((1.0 - (distance / maxDistance) * 0.4) * 10000) / 10000;
}

// ── INDIVIDUAL FACTOR SCORES ──────────────────────────────────────────────────
function scoreSoilPh(crop, inp) {
  const s = crop.soil;
  return rangeScore(inp.soil_ph, s.ph_min, s.ph_max, s.ph_optimal);
}

function scoreMoisture(crop, inp) {
  const s = crop.soil;
  return rangeScore(inp.soil_moisture_pct, s.moisture_min, s.moisture_max, s.moisture_optimal);
}

function scoreRegion(crop, inp) {
  return crop.agro_regions.includes(inp.agro_region) ? 1.0 : 0.0;
}

function scoreTemperature(crop, inp) {
  const c = crop.climate;
  return rangeScore(inp.soil_temp_c, c.temp_min_c, c.temp_max_c, c.temp_optimal_c);
}

function scoreIrrigation(crop, inp) {
  const req = crop.irrigation.required;
  const has = inp.has_irrigation;
  if (req === 'rain_fed')     return 1.0;
  if (req === 'supplemental') return has ? 1.0 : 0.65;
  if (req === 'full')         return has ? 1.0 : 0.0;
  return 0.5;
}

function scoreBudget(crop, inp) {
  const yieldMap = crop.yield_t_ha;
  const farmerYield = yieldMap[`${inp.budget_level}_input`] ?? yieldMap.low_input ?? 0;
  const maxYield = Math.max(...Object.values(yieldMap));
  if (maxYield === 0) return 0.0;
  return Math.round(Math.min(farmerYield / maxYield, 1.0) * 10000) / 10000;
}

// ── VARIETY SELECTOR ──────────────────────────────────────────────────────────
function selectVariety(crop, budgetLevel) {
  const priority = {
    low:    ['low',    'medium', 'high'],
    medium: ['medium', 'low',    'high'],
    high:   ['high',   'medium', 'low'],
  };
  for (const target of (priority[budgetLevel] ?? ['low'])) {
    const match = crop.varieties.find(v => v.input_level === target);
    if (match) return match;
  }
  return crop.varieties[0];
}

// ── HARD DISQUALIFIERS ────────────────────────────────────────────────────────
function getDisqualifiers(crop, inp, breakdown) {
  const disq = [];
  if (!crop.agro_regions.includes(inp.agro_region)) {
    disq.push(
      `Not suited to Region ${inp.agro_region}. ` +
      `${crop.name} grows in Regions: ${crop.agro_regions.join(', ')}.`
    );
  }
  if (breakdown.soil_ph === 0.0) {
    disq.push(
      `Soil pH (${inp.soil_ph.toFixed(1)}) is outside the survivable range ` +
      `[${crop.soil.ph_min}, ${crop.soil.ph_max}] for ${crop.name}.`
    );
  }
  if (crop.irrigation.required === 'full' && !inp.has_irrigation) {
    disq.push(`${crop.name} requires full irrigation. Not viable without a water source.`);
  }
  return disq;
}

// ── AGRONOMIC NOTES ───────────────────────────────────────────────────────────
function generateNotes(crop, inp, breakdown) {
  const notes = [];
  const s = crop.soil;

  if (inp.soil_ph < s.ph_min) {
    const limeKg = Math.round((s.ph_optimal - inp.soil_ph) * 500);
    notes.push(
      `Soil is too acidic (pH ${inp.soil_ph.toFixed(1)}). ` +
      `Apply approximately ${limeKg} kg/ha of agricultural lime to raise pH ` +
      `toward ${s.ph_optimal.toFixed(1)}. Allow 4–6 weeks before planting.`
    );
  } else if (inp.soil_ph > s.ph_max) {
    notes.push(
      `Soil pH (${inp.soil_ph.toFixed(1)}) is above the ideal range for ${crop.name}. ` +
      `Incorporate compost or sulphur to gradually reduce pH.`
    );
  } else if (breakdown.soil_ph < 0.8) {
    notes.push(
      `pH (${inp.soil_ph.toFixed(1)}) is within tolerance but not optimal — ` +
      `target ${s.ph_optimal.toFixed(1)} for best results.`
    );
  }

  if (inp.soil_moisture_pct < s.moisture_min) {
    notes.push(
      `Soil moisture (${inp.soil_moisture_pct.toFixed(0)}%) is below the minimum ` +
      `(${s.moisture_min}%) needed for ${crop.name}. ` +
      `Irrigate before planting or wait for rain.`
    );
  } else if (inp.soil_moisture_pct > s.moisture_max) {
    notes.push(
      `Soil moisture (${inp.soil_moisture_pct.toFixed(0)}%) is too high — risk of ` +
      `root rot and damping-off. Improve drainage before planting.`
    );
  }

  if (crop.irrigation.required === 'full' && !inp.has_irrigation) {
    notes.push(
      `${crop.name} requires consistent irrigation. ` +
      `Without irrigation, yield will be severely reduced or crop will fail.`
    );
  } else if (crop.irrigation.required === 'supplemental' && !inp.has_irrigation) {
    notes.push(
      `${crop.name} performs best with supplemental irrigation during dry spells. ` +
      `Rain-fed production is possible but yields will be lower.`
    );
  }

  if (inp.budget_level === 'low') {
    notes.push(`At low-input level, use open-pollinated varieties and save seed for next season.`);
  }
  if (crop.organic_alternatives && crop.organic_alternatives.length > 0) {
    notes.push(`Organic input alternatives are available — ask the guide for details.`);
  }

  return notes;
}

// ── MAIN FUNCTION ─────────────────────────────────────────────────────────────
// Identical signature to Python recommend_crops()
// Returns the same JSON structure as the FastAPI /recommend endpoint

export function recommend(inp, topN = 5) {
  // Validate input
  if (inp.soil_ph < 3.0 || inp.soil_ph > 9.0)
    throw new Error(`soil_ph ${inp.soil_ph} out of range [3.0, 9.0]`);
  if (inp.soil_moisture_pct < 0 || inp.soil_moisture_pct > 100)
    throw new Error(`soil_moisture_pct out of range [0, 100]`);
  if (![1, 2, 3, 4, 5].includes(inp.agro_region))
    throw new Error(`agro_region must be 1–5`);
  if (!['low', 'medium', 'high'].includes(inp.budget_level))
    throw new Error(`budget_level must be low / medium / high`);

  const scored = [];

  for (const crop of CROPS) {
    const breakdown = {
      soil_ph:        scoreSoilPh(crop, inp),
      soil_moisture:  scoreMoisture(crop, inp),
      region_fit:     scoreRegion(crop, inp),
      temperature:    scoreTemperature(crop, inp),
      irrigation_fit: scoreIrrigation(crop, inp),
      budget_fit:     scoreBudget(crop, inp),
    };

    const score = Math.round((
      breakdown.soil_ph        * WEIGHTS.soil_ph        +
      breakdown.soil_moisture  * WEIGHTS.soil_moisture  +
      breakdown.region_fit     * WEIGHTS.region_fit     +
      breakdown.temperature    * WEIGHTS.temperature    +
      breakdown.irrigation_fit * WEIGHTS.irrigation_fit +
      breakdown.budget_fit     * WEIGHTS.budget_fit
    ) * 10000) / 10000;

    const disqualifiers = getDisqualifiers(crop, inp, breakdown);
    const viable        = disqualifiers.length === 0;

    // Season check
    const monthsForRegion = (crop.planting.months_by_region[String(inp.agro_region)] ?? []);
    const inSeason = monthsForRegion.includes(inp.planting_month);

    // Variety and yield
    const selectedVariety = selectVariety(crop, inp.budget_level);
    const yieldKey        = `${inp.budget_level}_input`;
    const expectedYield   = crop.yield_t_ha[yieldKey] ?? crop.yield_t_ha.low_input;

    // Notes
    const notes = generateNotes(crop, inp, breakdown);

    scored.push({
      rank:                0,
      crop_id:             crop.id,
      crop_name:           crop.name,
      local_name_shona:    crop.local_names?.shona  ?? '',
      local_name_ndebele:  crop.local_names?.ndebele ?? '',
      crop_type:           crop.type,
      score,
      score_pct:           Math.round(score * 100),
      viable,
      in_season:           inSeason,
      breakdown,
      selected_variety:    selectedVariety,
      disqualifiers,
      agronomic_notes:     notes,
      expected_yield_t_ha: expectedYield,
      market_price_usd_kg: crop.market.price_usd_per_kg,
      market_demand:       crop.market.demand,
    });
  }

  // Sort: in-season first, then by score descending
  const viableCrops = scored
    .filter(r => r.viable)
    .sort((a, b) => {
      if (a.in_season !== b.in_season) return a.in_season ? -1 : 1;
      return b.score - a.score;
    });

  // Assign ranks
  viableCrops.slice(0, topN).forEach((rec, i) => { rec.rank = i + 1; });

  return {
    recommendations: viableCrops.slice(0, topN),
    total_viable:    viableCrops.length,
    total_assessed:  CROPS.length,
    input_summary: {
      soil_ph:           inp.soil_ph,
      soil_moisture_pct: inp.soil_moisture_pct,
      soil_temp_c:       inp.soil_temp_c,
      agro_region:       inp.agro_region,
      has_irrigation:    inp.has_irrigation,
      budget_level:      inp.budget_level,
      planting_month:    inp.planting_month,
      farm_size_ha:      inp.farm_size_ha ?? null,
    },
    generated_at: new Date().toISOString(),
    source:        'offline-js-engine',
  };
}
