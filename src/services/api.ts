// src/services/api.ts
// FastAPI client — typed, offline-aware, with SQLite cache fallback

import type { SessionRequest, SessionResponse } from '@/types';

// ── Configuration ─────────────────────────────────────────────────────────────
const BASE_URL = 'https://mdumeni-api.onrender.com';

const DEFAULT_TIMEOUT = 12_000;

// ── Fetch with timeout ────────────────────────────────────────────────────────
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs = DEFAULT_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
async function post<TReq, TRes>(
  path: string,
  body: TReq,
  token?: string
): Promise<TRes> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const response = await fetchWithTimeout(
    `${BASE_URL}${path}`,
    { method: 'POST', headers, body: JSON.stringify(body) }
  );
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail ?? `HTTP ${response.status}`);
  }
  return response.json() as Promise<TRes>;
}

async function put<TReq, TRes>(
  path: string,
  body: TReq,
  token: string
): Promise<TRes> {
  const response = await fetchWithTimeout(
    `${BASE_URL}${path}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }
  );
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail ?? `HTTP ${response.status}`);
  }
  return response.json() as Promise<TRes>;
}

async function get<TRes>(path: string, token?: string): Promise<TRes> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const response = await fetchWithTimeout(
    `${BASE_URL}${path}`,
    { method: 'GET', headers }
  );
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json() as Promise<TRes>;
}

// ── API surface ───────────────────────────────────────────────────────────────

/** Main composite call — runs all 4 engines in one round trip */
export async function callSession(
  payload: SessionRequest
): Promise<SessionResponse> {
  return post<SessionRequest, SessionResponse>('/session', payload);
}

/** Health check */
export async function checkHealth(): Promise<boolean> {
  try {
    const result = await get<{ status: string }>('/health');
    return result.status === 'ok';
  } catch {
    return false;
  }
}

/** AI chat — passes full conversation history to Groq for continuity */
export async function callAIChat(
  question: string,
  farmContext: Record<string, unknown>,
  history: Array<{ role: string; content: string }> = [],
): Promise<string> {
  const response = await post<
    { question: string; context: Record<string, unknown>; history: Array<{ role: string; content: string }> },
    { answer: string; response: string }
  >('/chat', { question, context: farmContext, history });
  return response.answer ?? response.response ?? '';
}

/** Poll the server for the latest sensor reading */
export async function pollLatestReading(): Promise<{
  device_id: string;
  soil_ph: number;
  moisture_pct: number;
  temp_c: number;
  battery_pct: number;
  recorded_at: string;
  source: string;
} | null> {
  try {
    return await get('/sensor/latest');
  } catch {
    return null;
  }
}

/** Update farmer profile — requires auth token */
export async function updateFarmerProfile(
  data: {
    phone_number: string;
    pin: string;
    agro_region: number;
    farm_size_ha: number;
    has_irrigation: boolean;
    budget_level: string;
    province: string;
    district: string;
    language: string;
  },
  token: string
): Promise<void> {
  await put('/auth/profile', data, token);
}

/** Get current farmer profile from token */
export async function getFarmerProfile(token: string): Promise<any> {
  return get('/auth/me', token);
}

/** Record actual harvest yield */
export async function recordYield(data: {
  farmer_id: string;
  crop_id: string;
  crop_name: string;
  planting_date: string;
  harvest_date: string;
  farm_size_ha: number;
  budget_level: string;
  predicted_yield_kg: number;
  actual_yield_kg: number;
  total_cost_usd: number;
  gross_revenue_usd: number;
  net_profit_usd: number;
  notes: string;
}): Promise<{ id: string }> {
  return post('/farmer/yield', data);
}

/** Get farmer season history */
export async function getSeasonHistory(token: string): Promise<any[]> {
  try {
    return await get('/farmer/history', token);
  } catch {
    return [];
  }
}

/** Save a sensor reading linked to a farmer */
export async function saveFarmerReading(data: {
  farmer_id: string;
  soil_ph: number;
  moisture_pct: number;
  temp_c: number;
  device_id?: string;
  source?: string;
}): Promise<void> {
  await post('/farmer/reading', data);
}

/** Set farmer's active crop */
export async function setFarmerCrop(
  data: { crop_id: string; crop_name: string; planting_date: string },
  token: string
): Promise<void> {
  await post('/farmer/crop', data, token);
}

/** Fetch nearby agricultural services from the backend (GPS-sorted, online only) */
export async function fetchNearbyServices(query: {
  lat: number; lng: number; province: string;
  types?: string[]; crop_id?: string; radius_km?: number; limit?: number;
}): Promise<Array<Record<string, unknown>>> {
  try {
    const res = await post<typeof query, Array<Record<string, unknown>>>(
      '/services/nearby', query
    );
    return Array.isArray(res) ? res : [];
  } catch {
    return []; // silent fail — caller falls back to offline province index
  }
}

/** Fetch district services summary (AGRITEX office + key services) */
export async function fetchDistrictServices(
  province: string, district: string
): Promise<Record<string, unknown> | null> {
  try {
    return await get<Record<string, unknown>>(
      `/services/district/${encodeURIComponent(province)}/${encodeURIComponent(district)}`
    );
  } catch {
    return null;
  }
}