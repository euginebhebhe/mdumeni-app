// src/services/marketplaceApi.ts
// ZimAgroMarket — all marketplace API calls
// Listings, deals, alerts, photos, SMS broadcast

import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'https://mdumeni-api.onrender.com';

// ── Fetch with timeout ─────────────────────────────────────
// Render free tier sleeps after 15 min idle and can take 30-60s to cold-start.
// Without a timeout every call hangs indefinitely on a sleeping server.
// 20s is long enough to survive a cold start but bounded so the UI can recover.
const REQUEST_TIMEOUT = 20_000;

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = REQUEST_TIMEOUT,
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

export type ListingType = 'selling' | 'buying' | 'input';
export type QualityGrade = 'A' | 'B' | 'standard';
export type ListingStatus = 'active' | 'sold' | 'expired' | 'draft';

export interface MarketplaceListing {
  id: string;
  type: ListingType;
  crop_name: string;
  product_name?: string;
  category?: string;
  quantity_kg: number;
  quantity_bags?: number;
  price_usd_kg: number;
  quality_grade: QualityGrade;
  province: string;
  district: string;
  phone: string;
  farmer_name: string;
  farmer_id?: string;
  description?: string;
  photo_url?: string;
  status: ListingStatus;
  deal_count: number;
  is_verified_seller: boolean;
  is_pro: boolean;
  is_boosted: boolean;
  broadcast_sent: boolean;
  created_at: string;
  expires_at: string;
  available_from?: string;
}

export interface DealConfirmation {
  listing_id: string;
  buyer_name: string;
  buyer_phone: string;
  quantity_kg: number;
  agreed_price: number;
  buyer_paid: boolean;
  seller_confirmed: boolean;
  buyer_rating?: 'up' | 'down';
}

export interface PriceAlert {
  id: string;
  crop_name: string;
  target_price: number;
  province: string;
  type: 'above' | 'below';
  active: boolean;
}

// ── Browse listings ────────────────────────────────────────
export async function getListings(params: {
  type?: ListingType;
  province?: string;
  district?: string;
  crop_name?: string;
  search?: string;
  boosted_first?: boolean;
}): Promise<MarketplaceListing[]> {
  try {
    const q = new URLSearchParams();
    if (params.type)         q.append('type', params.type);
    if (params.province)     q.append('province', params.province);
    if (params.district)     q.append('district', params.district);
    if (params.crop_name)    q.append('crop_name', params.crop_name);
    if (params.search)       q.append('search', params.search);
    if (params.boosted_first) q.append('boosted_first', 'true');
    const res = await fetchWithTimeout(`${BASE_URL}/marketplace/listings?${q}`);
    const data = await res.json();
    return data.listings ?? [];
  } catch { return []; }
}

// ── My listings ────────────────────────────────────────────
export async function getMyListings(farmerId: string): Promise<MarketplaceListing[]> {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/marketplace/listings/mine?farmer_id=${farmerId}`);
    const data = await res.json();
    return data.listings ?? [];
  } catch { return []; }
}

// ── Create listing ─────────────────────────────────────────
export async function createListing(listing: Partial<MarketplaceListing> & {
  broadcast?: boolean;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/marketplace/listing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listing),
    });
    return await res.json();
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ── Update listing ─────────────────────────────────────────
export async function updateListing(id: string, updates: Partial<MarketplaceListing>): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/marketplace/listing/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    return data.success ?? false;
  } catch { return false; }
}

// ── Delete listing ─────────────────────────────────────────
export async function deleteListing(id: string): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/marketplace/listing/${id}`, { method: 'DELETE' });
    const data = await res.json();
    return data.success ?? false;
  } catch { return false; }
}

// ── Deal confirmation ──────────────────────────────────────
export async function confirmDeal(deal: DealConfirmation): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/marketplace/listing/${deal.listing_id}/deal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deal),
    });
    const data = await res.json();
    return data.success ?? false;
  } catch { return false; }
}

// ── Price alerts ───────────────────────────────────────────
export async function getPriceAlerts(farmerId: string): Promise<PriceAlert[]> {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/marketplace/alerts?farmer_id=${farmerId}`);
    const data = await res.json();
    return data.alerts ?? [];
  } catch { return []; }
}

export async function createPriceAlert(alert: Omit<PriceAlert, 'id' | 'active'> & {
  farmer_id: string;
}): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/marketplace/alert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alert),
    });
    const data = await res.json();
    return data.success ?? false;
  } catch { return false; }
}

// ── Boost listing ──────────────────────────────────────────
export async function boostListing(id: string): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/marketplace/listing/${id}/boost`, { method: 'POST' });
    const data = await res.json();
    return data.success ?? false;
  } catch { return false; }
}

// ── Upload photo ───────────────────────────────────────────
export async function uploadListingPhoto(listingId: string, base64: string): Promise<string | null> {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/marketplace/listing/${listingId}/photo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_base64: base64 }),
    });
    const data = await res.json();
    return data.photo_url ?? null;
  } catch { return null; }
}

// ── Suggest price ──────────────────────────────────────────
export async function getSuggestedPrice(cropName: string, province: string): Promise<number | null> {
  try {
    const res = await fetchWithTimeout(
      `${BASE_URL}/market/prices/crops/best?crop_name=${encodeURIComponent(cropName)}&province=${encodeURIComponent(province)}`
    );
    const data = await res.json();
    return data.best_price?.price_usd_kg ?? null;
  } catch { return null; }
}

// ── Offline draft queue (persistent) ───────────────────────
// Listings posted while offline are stored on-device and flushed when the
// connection returns. Persisted with expo-secure-store so a draft survives an
// app restart — previously it lived in a module array and was lost on reload.
const DRAFT_KEY = 'marketplace_draft_queue';

async function readDrafts(): Promise<Partial<MarketplaceListing>[]> {
  try {
    const raw = await SecureStore.getItemAsync(DRAFT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

async function writeDrafts(drafts: Partial<MarketplaceListing>[]): Promise<void> {
  try {
    await SecureStore.setItemAsync(DRAFT_KEY, JSON.stringify(drafts));
  } catch { /* storage full or unavailable — drop silently */ }
}

export async function saveDraft(listing: Partial<MarketplaceListing>): Promise<void> {
  const drafts = await readDrafts();
  drafts.push({ ...listing, id: `draft_${Date.now()}` });
  await writeDrafts(drafts);
}

export async function flushDrafts(): Promise<void> {
  const pending = await readDrafts();
  if (!pending.length) return;

  const failed: Partial<MarketplaceListing>[] = [];
  for (const draft of pending) {
    // strip the local draft id before sending to the server
    const { id, ...payload } = draft;
    const result = await createListing(payload);
    if (!result.success) failed.push(draft); // keep it to retry next time
  }
  // Persist only the ones that didn't post (don't lose drafts on a flaky connection)
  await writeDrafts(failed);
}