// lib/api.ts
// API client สำหรับเชื่อมต่อกับเซิร์ฟเวอร์ Growve

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '3O4DSBW-GyUIVGATdwOe2sAyCJbNcMpF76NV6bl-UR4';

function getHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
  };
}

// ============================================================
// Types
// ============================================================

export type AssetType = 'us' | 'th' | 'etf' | 'crypto' | 'fx' | 'other';

export interface MarketItem {
  symbol: string;
  name: string;
  asset: AssetType;
  price: number;
  change_percent: number;
  currency: string;
  exchange?: string;
  image?: string;
  market_cap?: number | null;
  growth_score?: number | null;
  [key: string]: any;
}

export interface StockNewsItem {
  headline: string;
  source: string;
  url: string;
  datetime: number;
  image?: string;
  [key: string]: any;
}

export interface StockGrowth {
  symbol: string;
  name?: string;
  price?: number;
  change_percent?: number;
  growth_score?: number;
  analyst_buy_percent?: number;
  analyst_count?: number;
  revenue_growth_percent?: number;
  eps_growth_percent?: number;
  earnings_surprise_percent?: number;
  data_coverage?: number;
  breakdown?: any;
  news?: StockNewsItem[];
  disclaimer?: string;
  [key: string]: any;
}

export interface StockDetail extends StockGrowth {
  description?: string;
  market_cap?: string;
  volume?: number;
  high_52w?: number;
  low_52w?: number;
  dividend_yield?: number | null;
  earnings_date?: string;
  analyst_rating?: string;
  [key: string]: any;
}

// ============================================================
// Health Check
// ============================================================
export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

// ============================================================
// Markets – รายการยาวรวมทุกตลาด (US, TH, ETF, Crypto, FX)
// ============================================================
export async function getMarkets(options?: {
  assets?: string; // e.g. "th,etf,crypto"
  symbols?: string; // e.g. "PTT.BK,SPY,BTC"
  crypto_limit?: number;
}): Promise<MarketItem[]> {
  const params = new URLSearchParams();
  if (options?.assets) params.append('assets', options.assets);
  if (options?.symbols) params.append('symbols', options.symbols);
  if (options?.crypto_limit) params.append('crypto_limit', String(options.crypto_limit));

  const qs = params.toString();
  const url = qs ? `${API_BASE}/markets?${qs}` : `${API_BASE}/markets`;

  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) throw new Error(`Failed to fetch markets: ${res.status}`);

  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}

// ============================================================
// Stocks – Growth Watchlist (เฉพาะหุ้น US ที่มีคะแนน Growth)
// ============================================================
export async function getGrowthStocks(symbols?: string[]): Promise<StockGrowth[]> {
  const url = symbols && symbols.length > 0
    ? `${API_BASE}/stocks/growth?symbols=${symbols.join(',')}`
    : `${API_BASE}/stocks/growth`;

  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) throw new Error(`Failed to fetch growth stocks: ${res.status}`);

  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}

// ============================================================
// Historical Price Data – ข้อมูลราคาย้อนหลัง
// ============================================================
export type TimeRange = '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y';
export type Interval = '1m' | '5m' | '15m' | '30m' | '1h' | '1d';

export interface HistoricalPoint {
  date: string;      // daily: "2026-11-25", intraday: "2026-11-25T14:30:00"
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export async function getStockHistory(
  symbol: string,
  range: TimeRange = '1M',
  interval?: Interval
): Promise<HistoricalPoint[]> {
  const params = new URLSearchParams({ range });
  if (interval) params.append('interval', interval);

  const res = await fetch(
    `${API_BASE}/stocks/${encodeURIComponent(symbol)}/history?${params.toString()}`,
    { headers: getHeaders() }
  );
  if (!res.ok) throw new Error(`Failed to fetch history for ${symbol}: ${res.status}`);
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  if (data && Array.isArray(data.prices)) return data.prices;
  return [];
}

// ============================================================
// Stock Detail – รายละเอียดหุ้นเดี่ยว
// ============================================================
export async function getStockDetail(symbol: string): Promise<StockDetail> {
  const res = await fetch(`${API_BASE}/stocks/${symbol}`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to fetch stock ${symbol}: ${res.status}`);
  return res.json();
}

// ============================================================
// AI Chat – ระบบแชท AI อัจฉริยะ (SSE Stream & History)
// ============================================================
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function getChatHistory(sessionId: string): Promise<ChatMessage[]> {
  try {
    const res = await fetch(`${API_BASE}/chat/history/${encodeURIComponent(sessionId)}`, {
      headers: getHeaders(),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.messages || [];
  } catch {
    return [];
  }
}

export async function clearChatHistory(sessionId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/chat/history/${encodeURIComponent(sessionId)}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function streamChat(
  sessionId: string,
  message: string,
  onChunk: (chunk: string) => void,
  onDone: () => void,
  onError: (err: any) => void
): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/chat/stream`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ session_id: sessionId, message }),
    });

    if (!res.ok || !res.body) {
      throw new Error(`Chat stream request failed: ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(':')) continue;
        if (trimmed.startsWith('data: ')) {
          const raw = trimmed.replace('data: ', '');
          if (raw === '[DONE]') {
            onDone();
            return;
          }
          try {
            const parsed = JSON.parse(raw);
            if (parsed.text) onChunk(parsed.text);
            else if (parsed.content) onChunk(parsed.content);
            else if (typeof parsed === 'string') onChunk(parsed);
          } catch {
            onChunk(raw);
          }
        }
      }
    }
    onDone();
  } catch (err) {
    onError(err);
  }
}
