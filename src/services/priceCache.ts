// src/services/priceCache.ts
// Caches market prices and input prices in SQLite
// When offline: serves yesterday's (or last known) prices
// When online: fetches fresh prices, saves to cache, serves fresh data
// Cache TTL: 24 hours for crop prices, 72 hours for input prices

import * as SQLite from 'expo-sqlite';

const BASE_URL = 'https://mdumeni-api.onrender.com';

// ── Cache schema ───────────────────────────────────────────────────────────────
// Added to existing mdumeni.db via migration

export const PRICE_CACHE_MIGRATION = `
  CREATE TABLE IF NOT EXISTS price_cache (
    cache_key   TEXT PRIMARY KEY,
    data_json   TEXT NOT NULL,
    fetched_at  TEXT NOT NULL,
    price_date  TEXT NOT NULL
  );
`;

// ── Cache keys ────────────────────────────────────────────────────────────────
const KEYS = {
  CROP_SUMMARY:   'market_summary',
  CROP_BEST:      'crop_prices_best',
  INPUTS_FERT:    'inputs_fertiliser',
  INPUTS_SEED:    'inputs_seed',
  INPUTS_CHEM:    'inputs_chemical',
  INPUTS_MACH:    'inputs_machinery',
  INPUTS_EQUIP:   'inputs_equipment',
} as const;

type CacheKey = typeof KEYS[keyof typeof KEYS];

// ── Read from cache ───────────────────────────────────────────────────────────
export async function readCache(
  db: SQLite.SQLiteDatabase,
  key: CacheKey,
  maxAgeHours = 24
): Promise<{ data: any; isStale: boolean; priceDate: string | null } | null> {
  try {
    const rows = await db.getAllAsync(
      'SELECT data_json, fetched_at, price_date FROM price_cache WHERE cache_key = ?',
      [key]
    ) as any[];

    if (!rows || rows.length === 0) return null;

    const row = rows[0];
    const fetchedAt = new Date(row.fetched_at);
    const ageHours  = (Date.now() - fetchedAt.getTime()) / (1000 * 3600);
    const isStale   = ageHours > maxAgeHours;

    return {
      data:      JSON.parse(row.data_json),
      isStale,
      priceDate: row.price_date,
    };
  } catch {
    return null;
  }
}

// ── Write to cache ────────────────────────────────────────────────────────────
export async function writeCache(
  db: SQLite.SQLiteDatabase,
  key: CacheKey,
  data: any,
  priceDate?: string
): Promise<void> {
  try {
    await db.runAsync(
      `INSERT OR REPLACE INTO price_cache (cache_key, data_json, fetched_at, price_date)
       VALUES (?, ?, ?, ?)`,
      [
        key,
        JSON.stringify(data),
        new Date().toISOString(),
        priceDate ?? new Date().toISOString().split('T')[0],
      ]
    );
  } catch (e) {
    console.log('Price cache write error:', e);
  }
}

// ── Clear cache ───────────────────────────────────────────────────────────────
export async function clearPriceCache(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.runAsync('DELETE FROM price_cache');
}

// ── Fetch with cache fallback ─────────────────────────────────────────────────
interface FetchWithCacheOptions {
  db:         SQLite.SQLiteDatabase;
  key:        CacheKey;
  url:        string;
  isOnline:   boolean;
  maxAgeHours?: number;
  method?:    'GET' | 'POST';
  body?:      object;
}

export async function fetchWithCache(opts: FetchWithCacheOptions): Promise<{
  data: any;
  source: 'live' | 'cache' | 'stale_cache' | 'none';
  priceDate: string | null;
  cacheAge?: string;
}> {
  const { db, key, url, isOnline, maxAgeHours = 24, method = 'GET', body } = opts;

  // ── Online: try fresh fetch first ────────────────────────────────────────
  if (isOnline) {
    try {
      const fetchOpts: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json' },
      };
      if (body) fetchOpts.body = JSON.stringify(body);

      const res  = await fetch(url, fetchOpts);
      if (res.ok) {
        const data = await res.json();
        // Cache the fresh data
        await writeCache(db, key, data);
        return { data, source: 'live', priceDate: new Date().toISOString().split('T')[0] };
      }
    } catch {
      // Network error — fall through to cache
    }
  }

  // ── Offline or fetch failed: try cache ────────────────────────────────────
  const cached = await readCache(db, key, maxAgeHours);
  if (cached) {
    const ageMs   = Date.now() - new Date(cached.priceDate ?? '').getTime();
    const ageHrs  = Math.floor(ageMs / (1000 * 3600));
    const ageFmt  = ageHrs < 24 ? `${ageHrs}h ago` : `${Math.floor(ageHrs/24)}d ago`;
    return {
      data:      cached.data,
      source:    cached.isStale ? 'stale_cache' : 'cache',
      priceDate: cached.priceDate,
      cacheAge:  ageFmt,
    };
  }

  return { data: null, source: 'none', priceDate: null };
}

// ── Convenience functions ─────────────────────────────────────────────────────

export async function getCropSummary(db: SQLite.SQLiteDatabase, isOnline: boolean) {
  return fetchWithCache({
    db, key: KEYS.CROP_SUMMARY,
    url: `${BASE_URL}/market/summary`,
    isOnline,
    maxAgeHours: 24,
  });
}

export async function getCropPricesBest(db: SQLite.SQLiteDatabase, isOnline: boolean) {
  return fetchWithCache({
    db, key: KEYS.CROP_BEST,
    url: `${BASE_URL}/market/prices/crops/best`,
    isOnline,
    maxAgeHours: 24,
  });
}

export async function getInputPrices(
  db: SQLite.SQLiteDatabase,
  isOnline: boolean,
  category: string
) {
  const keyMap: Record<string, CacheKey> = {
    fertiliser: KEYS.INPUTS_FERT,
    seed:       KEYS.INPUTS_SEED,
    chemical:   KEYS.INPUTS_CHEM,
    machinery:  KEYS.INPUTS_MACH,
    equipment:  KEYS.INPUTS_EQUIP,
  };
  const key = keyMap[category] ?? KEYS.INPUTS_FERT;
  return fetchWithCache({
    db, key,
    url: `${BASE_URL}/market/prices/inputs?category=${category}`,
    isOnline,
    maxAgeHours: 72, // inputs change less frequently
  });
}

export async function getProfitCalc(
  db: SQLite.SQLiteDatabase,
  isOnline: boolean,
  body: object,
  cacheKey: string
) {
  return fetchWithCache({
    db,
    key: `profit_${cacheKey}` as CacheKey,
    url: `${BASE_URL}/market/profit/calculate`,
    isOnline,
    method: 'POST',
    body,
    maxAgeHours: 24,
  });
}

// ── Prefetch all prices (call on app startup when online) ─────────────────────
export async function prefetchAllPrices(
  db: SQLite.SQLiteDatabase,
  isOnline: boolean,
): Promise<void> {
  // Only prefetch when genuinely online — passing isOnline:true was bypassing
  // the offline guard inside fetchWithCache and hitting the server anyway.
  await Promise.allSettled([
    fetchWithCache({ db, key: KEYS.CROP_SUMMARY, url: `${BASE_URL}/market/summary`, isOnline }),
    fetchWithCache({ db, key: KEYS.CROP_BEST, url: `${BASE_URL}/market/prices/crops/best`, isOnline }),
    fetchWithCache({ db, key: KEYS.INPUTS_FERT, url: `${BASE_URL}/market/prices/inputs?category=fertiliser`, isOnline }),
    fetchWithCache({ db, key: KEYS.INPUTS_SEED, url: `${BASE_URL}/market/prices/inputs?category=seed`, isOnline }),
    fetchWithCache({ db, key: KEYS.INPUTS_CHEM, url: `${BASE_URL}/market/prices/inputs?category=chemical`, isOnline }),
    fetchWithCache({ db, key: KEYS.INPUTS_MACH, url: `${BASE_URL}/market/prices/inputs?category=machinery`, isOnline }),
  ]);
  if (isOnline) console.log('Market prices prefetched and cached');
}