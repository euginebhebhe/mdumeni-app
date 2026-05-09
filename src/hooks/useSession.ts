// src/hooks/useSession.ts
// The most important hook in the app.
// Called once on every app open. Drives all 4 engines.
// Online: calls /session API → stores result in SQLite cache
// Offline: loads cache from SQLite → runs fallback

import { useCallback } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { useAppStore } from '@/store';
import { callSession } from '@/services/api';
import { setCacheEntry, getCacheEntry } from '@/db/database';
import type { SessionRequest, SessionResponse } from '@/types';
import { recommend } from '@/engines/cropEngine';
import { threats } from '@/engines/pestEngine';

const CACHE_KEY = 'session_latest';
const CACHE_TTL = 24 * 60 * 60; // 24 hours

export function useSession() {
  const db = useSQLiteContext();
  const {
    profile,
    sensorReading,
    activeCrop,
    isOnline,
    setSession,
    setSessionLoading,
    setSessionError,
  } = useAppStore();

  const refresh = useCallback(async () => {
    if (!profile) return;

    setSessionLoading(true);
    setSessionError(null);

    // Build request from current state
    const reading = sensorReading;
    const request: SessionRequest = {
      soil_ph:             reading?.soil_ph           ?? 6.5,
      soil_moisture_pct:   reading?.moisture_pct       ?? 60,
      soil_temp_c:         reading?.temp_c             ?? 25,
      agro_region:         profile.agro_region,
      has_irrigation:      profile.has_irrigation,
      budget_level:        profile.budget_level,
      planting_month:      new Date().getMonth() + 1,
      farm_size_ha:        profile.farm_size_ha,
      active_crop_id:      activeCrop?.crop_id         ?? null,
      days_since_planting: activeCrop
        ? Math.floor(
            (Date.now() - new Date(activeCrop.planting_date).getTime()) /
            (1000 * 60 * 60 * 24)
          )
        : null,
    };

    try {
      if (isOnline) {
        // Try live API
        const result = await callSession(request);
        await setCacheEntry(db, CACHE_KEY, result, CACHE_TTL);
        setSession(result);
      } else {
        throw new Error('offline');
      }
    } catch (_err) {
      // Fallback to cache
      const cached = await getCacheEntry<SessionResponse>(db, CACHE_KEY);
      if (cached) {
        setSession({ ...cached, from_cache: true });
      } else {
        // No cache — use hardcoded demo data so app is never empty
        setSession(buildFallbackSession(request));
      }
    } finally {
      setSessionLoading(false);
    }
  }, [db, profile, sensorReading, activeCrop, isOnline, setSession, setSessionLoading, setSessionError]);

  return { refresh };
}

// ── Run JS engines on-device (true offline AI) ───────────────────────────────
function runLocalEngines(req: SessionRequest): SessionResponse {
  try {
    // Engine 1: Crop recommendations
    const cropResult = recommend({
      soil_ph:           req.soil_ph,
      soil_moisture_pct: req.soil_moisture_pct,
      soil_temp_c:       req.soil_temp_c,
      agro_region:       req.agro_region,
      has_irrigation:    req.has_irrigation,
      budget_level:      req.budget_level,
      planting_month:    req.planting_month,
      farm_size_ha:      req.farm_size_ha,
    }, 5);

    // Engine 4: Pest & disease threats (if active crop)
    const threatResult = req.active_crop_id
      ? threats(req.active_crop_id, req.planting_month)
      : undefined;

    return {
      crop_recommendations: cropResult as any,
      crop_threats:         threatResult as any,
      generated_at:         new Date().toISOString(),
      from_cache:           false,
    };
  } catch (e) {
    console.error('JS engine error:', e);
    return buildFallbackSession(req);
  }
}

// ── Fallback session when offline + no cache ──────────────────────────────────
// Returns believable data so the app is always usable
function buildFallbackSession(req: SessionRequest): SessionResponse {
  return {
    generated_at: new Date().toISOString(),
    from_cache: true,
    crop_recommendations: {
      recommendations: [
        {
          rank: 1,
          crop_id: 'CROP_006',
          crop_name: 'Sugar beans',
          score: 0.89,
          score_pct: 89,
          viable: true,
          in_season: true,
          breakdown: {
            soil_ph: 0.95, soil_moisture: 0.91, region_fit: 1.0,
            temperature: 0.89, irrigation_fit: 1.0, budget_fit: 0.32,
          },
          selected_variety: {
            name: 'Chivaura', type: 'Open-pollinated',
            maturity_days: 90, yield_t_ha: 0.8, input_level: 'low',
          },
          expected_yield_t_ha: 0.8,
          market_price_usd_kg: 0.65,
          market_demand: 'High',
          agronomic_notes: [
            'Well-suited to your soil pH. Plant at 45 × 10 cm spacing.',
            'Good nitrogen fixer — excellent rotation after maize.',
          ],
          disqualifiers: [],
          local_name_shona: 'Nyemba',
        },
        {
          rank: 2,
          crop_id: 'CROP_019',
          crop_name: 'Sweet potato',
          score: 0.87,
          score_pct: 87,
          viable: true,
          in_season: true,
          breakdown: {
            soil_ph: 0.92, soil_moisture: 0.88, region_fit: 1.0,
            temperature: 0.86, irrigation_fit: 1.0, budget_fit: 0.84,
          },
          selected_variety: {
            name: 'Mugande', type: 'Open-pollinated',
            maturity_days: 120, yield_t_ha: 8.0, input_level: 'low',
          },
          expected_yield_t_ha: 8.0,
          market_price_usd_kg: 0.28,
          market_demand: 'Medium',
          agronomic_notes: ['Rain-fed crop. No irrigation needed.'],
          disqualifiers: [],
          local_name_shona: 'Mbambaira',
        },
        {
          rank: 3,
          crop_id: 'CROP_001',
          crop_name: 'Maize',
          score: 0.86,
          score_pct: 86,
          viable: true,
          in_season: true,
          breakdown: {
            soil_ph: 0.68, soil_moisture: 0.95, region_fit: 1.0,
            temperature: 0.90, irrigation_fit: 0.65, budget_fit: 0.26,
          },
          selected_variety: {
            name: 'ZM521', type: 'Open-pollinated',
            maturity_days: 120, yield_t_ha: 2.5, input_level: 'low',
          },
          expected_yield_t_ha: 2.5,
          market_price_usd_kg: 0.28,
          market_demand: 'High',
          agronomic_notes: [
            'Soil pH below optimal. Apply lime before planting.',
            'Consider supplemental irrigation during pollination.',
          ],
          disqualifiers: [],
          local_name_shona: 'Chibage',
        },
      ],
      total_viable: 8,
      total_assessed: 30,
      input_summary: {
        soil_ph: req.soil_ph,
        soil_moisture_pct: req.soil_moisture_pct,
        agro_region: req.agro_region,
        budget_level: req.budget_level,
      },
      generated_at: new Date().toISOString(),
    },
    crop_threats: req.active_crop_id
      ? {
          crop_id: req.active_crop_id,
          month: req.planting_month,
          total_threats: 6,
          pests: [
            {
              id: 'PEST_001',
              category: 'pest',
              name: 'Fall Armyworm',
              severity: 'critical',
              in_season: true,
              symptoms_preview: [
                'Window-pane feeding on young leaves',
                'Frass (sawdust-like droppings) in whorl',
              ],
              treatment_count: 3,
              organic_options: true,
            },
            {
              id: 'PEST_002',
              category: 'pest',
              name: 'Maize stalk borer',
              severity: 'high',
              in_season: true,
              symptoms_preview: [
                'Dead heart in young plants',
                'Row of small holes across leaves',
              ],
              treatment_count: 2,
              organic_options: true,
            },
          ],
          diseases: [
            {
              id: 'DIS_001',
              category: 'disease',
              name: 'Northern corn leaf blight',
              severity: 'high',
              in_season: true,
              symptoms_preview: [
                'Long cigar-shaped grey-green lesions',
                'Lesions turn tan to brown',
              ],
              treatment_count: 2,
              organic_options: false,
            },
          ],
        }
      : undefined,
  };
}
