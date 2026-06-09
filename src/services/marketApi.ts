// src/services/marketApi.ts
// Typed client for all MDUMENI market intelligence endpoints
// Wraps fetch with timeout, error handling, and consistent response types

const BASE_URL = 'https://mdumeni-api.onrender.com';
const TIMEOUT  = 12_000;

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Market {
  id:               string;
  name:             string;
  type:             'open_market' | 'gmb_depot' | 'export_buyer' | 'agro_dealer' | 'cooperative';
  province:         string;
  district:         string;
  lat:              number | null;
  lng:              number | null;
  phone:            string | null;
  min_quantity_kg:  number;
  payment_methods:  string[];
  is_active:        boolean;
}

export interface Supplier {
  id:       string;
  name:     string;
  branch:   string | null;
  type:     'agro_dealer' | 'seed_company' | 'fertiliser' | 'equipment' | 'cooperative';
  province: string;
  district: string;
  lat:      number | null;
  lng:      number | null;
  phone:    string | null;
}

export interface CropPrice {
  crop_id:       string;
  crop_name:     string;
  price_usd_kg:  number;
  quality_grade: string;
  source:        string;
  price_date:    string;
  change_pct?:   number | null;
  markets?:      Partial<Market>;
}

export interface InputPriceOption {
  price_usd:  number;
  supplier:   Partial<Supplier>;
  source:     string;
  price_date: string;
}

export interface InputPriceGroup {
  product_id:   string;
  product_name: string;
  category:     string;
  unit:         string;
  unit_size:    string | null;
  options:      InputPriceOption[];
}

export interface ProfitLine {
  product:    string;
  product_id: string;
  qty:        number;
  unit_price: number;
  total:      number;
}

export interface ProfitResult {
  crop_id:            string;
  crop_name:          string;
  farm_size_ha:       number;
  budget_level:       string;
  agro_region:        number;
  price_date:         string;
  yield_t_ha:         number;
  total_yield_kg:     number;
  best_sell_price_kg: number | null;
  best_market:        string | null;
  input_lines:        ProfitLine[];
  input_cost_per_ha:  number;
  labour_per_ha:      number;
  land_prep_per_ha:   number;
  contingency_8pct:   number;
  total_cost_per_ha:  number;
  total_cost:         number;
  gross_revenue:      number | null;
  net_profit:         number | null;
  roi_pct:            number | null;
  break_even_kg:      number | null;
  is_profitable:      boolean | null;
  verdict:            string;
}

export interface MarketSummaryItem {
  crop_id:      string;
  crop_name:    string;
  price_usd_kg: number;
  change_pct:   number | null;
  trend:        'up' | 'down' | 'flat';
}

export interface PriceTrend {
  crop_id:        string;
  days:           number;
  trend:          Array<{ date: string; avg_price: number; min: number; max: number }>;
  change_pct:     number;
  recommendation: string;
}

export interface PriceAlert {
  id:             string;
  farmer_id:      string;
  alert_type:     'crop_sell' | 'input_buy';
  crop_id:        string | null;
  product_id:     string | null;
  condition:      'above' | 'below';
  threshold_usd:  number;
  is_active:      boolean;
  last_triggered: string | null;
  created_at:     string;
}

export interface TriggeredAlert {
  alert_id:      string;
  crop_name:     string;
  condition:     string;
  threshold:     number;
  current_price: number;
  market:        string;
  message:       string;
}

export interface CropBuyer extends CropPrice {
  distance_km?: number | null;
}

// ── Fetch helpers ─────────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {},
  timeoutMs = TIMEOUT
): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
    });
    clearTimeout(id);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail ?? `HTTP ${res.status}`);
    }
    return res.json() as Promise<T>;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

function get<T>(path: string, token?: string): Promise<T> {
  return request<T>(path, {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

function post<T>(path: string, body: object, token?: string): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

// ── Market summary ────────────────────────────────────────────────────────────

export async function getMarketSummary(): Promise<{
  summary: MarketSummaryItem[];
  date: string;
}> {
  return get('/market/summary');
}

// ── Crop prices ───────────────────────────────────────────────────────────────

export async function getCropPricesBest(options?: {
  province?: string;
}): Promise<{ prices: CropPrice[]; date: string }> {
  const qs = options?.province
    ? `?province=${encodeURIComponent(options.province)}`
    : '';
  return get(`/market/prices/crops/best${qs}`);
}

export async function getCropPrices(options?: {
  crop_id?:  string;
  province?: string;
  limit?:    number;
}): Promise<{ prices: CropPrice[]; date: string; count: number }> {
  const p = new URLSearchParams();
  if (options?.crop_id)  p.append('crop_id',  options.crop_id);
  if (options?.province) p.append('province', options.province);
  if (options?.limit)    p.append('limit',    String(options.limit));
  const qs = p.toString() ? `?${p}` : '';
  return get(`/market/prices/crops${qs}`);
}

export async function getCropPriceTrend(
  cropId: string,
  days = 30
): Promise<PriceTrend> {
  return get(`/market/prices/crops/${cropId}/trend?days=${days}`);
}

export async function getCropBuyers(
  cropId: string,
  options?: { farmerLat?: number; farmerLng?: number; minPrice?: number }
): Promise<{ crop_id: string; buyers: CropBuyer[]; count: number }> {
  const p = new URLSearchParams();
  if (options?.farmerLat) p.append('farmer_lat', String(options.farmerLat));
  if (options?.farmerLng) p.append('farmer_lng', String(options.farmerLng));
  if (options?.minPrice)  p.append('min_price',  String(options.minPrice));
  const qs = p.toString() ? `?${p}` : '';
  return get(`/market/prices/crops/${cropId}/buyers${qs}`);
}

// ── Input prices ──────────────────────────────────────────────────────────────

export async function getInputPrices(options?: {
  category?:   string;
  product_id?: string;
  district?:   string;
  limit?:      number;
}): Promise<{ inputs: InputPriceGroup[]; date: string }> {
  const p = new URLSearchParams();
  if (options?.category)   p.append('category',   options.category);
  if (options?.product_id) p.append('product_id', options.product_id);
  if (options?.district)   p.append('district',   options.district);
  if (options?.limit)      p.append('limit',      String(options.limit));
  const qs = p.toString() ? `?${p}` : '';
  return get(`/market/prices/inputs${qs}`);
}

export async function getCheapestInputs(category?: string): Promise<{
  inputs: any[];
  date: string;
}> {
  const qs = category ? `?category=${encodeURIComponent(category)}` : '';
  return get(`/market/prices/inputs/cheapest${qs}`);
}

// ── Profit calculator ─────────────────────────────────────────────────────────

export async function calculateProfit(body: {
  crop_id:        string;
  crop_name:      string;
  farm_size_ha:   number;
  budget_level:   'low' | 'medium' | 'high';
  agro_region:    number;
  has_irrigation: boolean;
  planting_month: number;
}): Promise<ProfitResult> {
  return post('/market/profit/calculate', body);
}

// ── Markets & suppliers ───────────────────────────────────────────────────────

export async function getMarkets(options?: {
  type?:     string;
  province?: string;
}): Promise<{ markets: Market[] }> {
  const p = new URLSearchParams();
  if (options?.type)     p.append('type',     options.type);
  if (options?.province) p.append('province', options.province);
  const qs = p.toString() ? `?${p}` : '';
  return get(`/market/markets${qs}`);
}

export async function getSuppliers(options?: {
  type?:     string;
  province?: string;
  district?: string;
}): Promise<{ suppliers: Supplier[] }> {
  const p = new URLSearchParams();
  if (options?.type)     p.append('type',     options.type);
  if (options?.province) p.append('province', options.province);
  if (options?.district) p.append('district', options.district);
  const qs = p.toString() ? `?${p}` : '';
  return get(`/market/suppliers${qs}`);
}

// ── Price reporting ───────────────────────────────────────────────────────────

export async function reportPrice(body: {
  farmer_id:    string;
  report_type:  'crop_sell' | 'input_buy';
  crop_id?:     string;
  product_id?:  string;
  market_id?:   string;
  supplier_id?: string;
  price_usd:    number;
  unit?:        string;
  notes?:       string;
}): Promise<{ status: string; message: string }> {
  return post('/market/prices/report', body);
}

// ── Price alerts ──────────────────────────────────────────────────────────────

export async function createPriceAlert(body: {
  farmer_id:     string;
  alert_type:    'crop_sell' | 'input_buy';
  crop_id?:      string;
  product_id?:   string;
  condition:     'above' | 'below';
  threshold_usd: number;
}): Promise<{ status: string; id: string }> {
  return post('/market/alerts', body);
}

export async function getPriceAlerts(
  farmerId: string
): Promise<{ alerts: PriceAlert[] }> {
  return get(`/market/alerts/${farmerId}`);
}

export async function deletePriceAlert(
  alertId: string
): Promise<{ status: string }> {
  return request(`/market/alerts/${alertId}`, { method: 'DELETE' });
}

export async function checkPriceAlerts(
  farmerId: string
): Promise<{ triggered: TriggeredAlert[]; checked_at: string }> {
  return post(`/market/alerts/check/${farmerId}`, {});
}

// ── Admin / scraper ───────────────────────────────────────────────────────────

export async function triggerScrape(useAi = false): Promise<{
  date:         string;
  crop_prices:  number;
  input_prices: number;
  errors:       string[];
}> {
  return post(`/market/admin/scrape?use_ai=${useAi}`, {});
}

export async function getScrapeStatus(): Promise<{
  last_crop_price_update:  object | null;
  last_input_price_update: object | null;
  today:                   string;
  prices_are_current:      boolean;
}> {
  return get('/market/admin/scrape/status');
}
