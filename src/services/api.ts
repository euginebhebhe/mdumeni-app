// src/services/api.ts
// FastAPI client — typed, offline-aware, with SQLite cache fallback
// Every call uses the /session composite endpoint for efficiency

import type { SessionRequest, SessionResponse } from '@/types';

// ── Configuration ─────────────────────────────────────────────────────────────
// Change BASE_URL to your deployed server URL before production
const BASE_URL = __DEV__
  ? 'http://192.168.1.100:8000'   // local dev — change to your machine's LAN IP
  : 'https://api.mdumeni.intelli-farming.com';

const DEFAULT_TIMEOUT = 12_000; // 12 seconds

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

// ── POST helper with typed response ──────────────────────────────────────────
async function post<TReq, TRes>(
  path: string,
  body: TReq
): Promise<TRes> {
  const response = await fetchWithTimeout(
    `${BASE_URL}${path}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail ?? `HTTP ${response.status}`);
  }
  return response.json() as Promise<TRes>;
}

async function get<TRes>(path: string): Promise<TRes> {
  const response = await fetchWithTimeout(
    `${BASE_URL}${path}`,
    { method: 'GET', headers: { 'Content-Type': 'application/json' } }
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

/** Health check — used on startup to determine online status */
export async function checkHealth(): Promise<boolean> {
  try {
    const result = await get<{ status: string }>('/health');
    return result.status === 'ok';
  } catch {
    return false;
  }
}

/** Get AI chat response — passes full farming context */
export async function callAIChat(
  question: string,
  farmContext: Record<string, unknown>
): Promise<string> {
  // When the real /chat endpoint exists, call it here
  // For now: build a contextual response based on farm data
  // This will be replaced with the actual LLM endpoint
  const response = await post<
    { question: string; context: Record<string, unknown> },
    { answer: string }
  >('/chat', { question, context: farmContext });
  return response.answer;
}

/** Upload batched sensor readings for sync */
export async function syncReadings(
  readings: Array<{
    device_id: string;
    soil_ph: number;
    moisture_pct: number;
    temp_c: number;
    recorded_at: string;
  }>
): Promise<void> {
  await post('/sync/readings', { readings });
}
