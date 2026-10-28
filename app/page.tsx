'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Hero } from '@/components/Hero';
import { DailyPickCard } from '@/components/DailyPickCard';
import { MarketTicker } from '@/components/MarketTicker';
import { NewsCarousel } from '@/components/NewsCarousel';
import { SearchFilterBar, CategoryType } from '@/components/SearchFilterBar';
import { AiChat } from '@/components/AiChat';
import { StockDetailModal } from '@/components/StockDetailModal';
import { BarChart3, Star, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import {
  getMarkets,
  getGrowthStocks,
  getStockDetail,
  checkHealth,
  MarketItem,
  StockGrowth,
  StockDetail,
} from '@/lib/api';

// พจนานุกรมคำแปลภาษาไทยสำหรับค้นหาชื่อหุ้นและประเภทสินทรัพย์
const THAI_SEARCH_SYNONYMS: { [key: string]: string[] } = {
  // หมวดประเภทตลาด / สินทรัพย์
  'th': ['หุ้นไทย', 'ไทย', 'ตลาดไทย', 'set', 'set50', 'thai', 'thailand'],
  'us': ['หุ้นสหรัฐ', 'หุ้นนอก', 'อเมริกา', 'สหรัฐ', 'us', 'usa', 'nasdaq', 'nyse'],
  'crypto': ['คริปโต', 'เหรียญ', 'บิทคอยน์', 'คริปโท', 'คริปโตเคอเรนซี', 'เหรียญคริปโต', 'crypto', 'token'],
  'etf': ['กองทุน', 'กองทุนรวม', 'อีทีเอฟ', 'กอง', 'etf'],
  'fx': ['ค่าเงิน', 'สกุลเงิน', 'อัตราแลกเปลี่ยน', 'ฟอเร็กซ์', 'ดอลลาร์', 'บาท', 'fx', 'forex'],

  // หุ้นไทยยอดนิยม
  'PTT.BK': ['ปตท', 'น้ำมัน', 'พลังงาน', 'ptt'],
  'PTTEP.BK': ['ปตทสผ', 'สำรวจ', 'pttep'],
  'CPALL.BK': ['ซีพีออลล์', 'เซเว่น', 'cpall', '7-eleven'],
  'DELTA.BK': ['เดลต้า', 'delta', 'อิเล็กทรอนิกส์'],
  'AOT.BK': ['ท่าอากาศยาน', 'สนามบิน', 'aot'],
  'ADVANC.BK': ['แอดวานซ์', 'เอไอเอส', 'ais', 'advanc'],
  'SCB.BK': ['ไทยพาณิชย์', 'แบงก์ม่วง', 'ธนาคารไทยพาณิชย์', 'scb', 'scbx'],
  'KBANK.BK': ['กสิกร', 'กสิกรไทย', 'แบงก์เขียว', 'kbank'],
  'BBL.BK': ['กรุงเทพ', 'ธนาคารกรุงเทพ', 'bbl'],
  'BDMS.BK': ['กรุงเทพดุสิต', 'โรงพยาบาลกรุงเทพ', 'bdms'],
  'TRUE.BK': ['ทรู', 'true'],
  'GULF.BK': ['กัลฟ์', 'โรงไฟฟ้า', 'gulf'],
  'OR.BK': ['โออาร์', 'ปั๊มปตท', 'อเมซอน', 'or'],

  // หุ้นสหรัฐ & คริปโตยอดนิยม
  'AAPL': ['แอปเปิ้ล', 'แอปเปิล', 'ไอโฟน', 'apple'],
  'NVDA': ['เอ็นวิเดีย', 'การ์ดจอ', 'ชิป', 'nvidia'],
  'TSLA': ['เทสลา', 'เทสล่า', 'รถไฟฟ้า', 'tesla', 'อีลอน'],
  'MSFT': ['ไมโครซอฟท์', 'วินโดว์', 'microsoft'],
  'GOOGL': ['กูเกิล', 'กูเกิ้ล', 'google', 'alphabet'],
  'AMZN': ['อเมซอน', 'amazon'],
  'META': ['เมตา', 'เฟสบุ๊ค', 'เฟซบุ๊ก', 'facebook', 'meta'],
  'BTC': ['บิทคอยน์', 'บิตคอยน์', 'bitcoin'],
  'ETH': ['อีเธอเรียม', 'อีทีเรียม', 'ethereum'],
  'SOL': ['โซลานา', 'โซลาน่า', 'solana'],
  'DOGE': ['หมา', 'โดจ', 'dogecoin'],
  'SPY': ['ดัชนีสหรัฐ', 'เอสแอนด์พี', 'spy', 's&p500'],
  'GLD': ['ทอง', 'ทองคำ', 'gold', 'gld'],
};

export default function Home() {
  const [markets, setMarkets] = useState<MarketItem[]>([]);
  const [growthMap, setGrowthMap] = useState<{ [symbol: string]: StockGrowth }>({});
  const [growthStocksList, setGrowthStocksList] = useState<StockGrowth[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [serverOnline, setServerOnline] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');

  const [selectedStock, setSelectedStock] = useState<StockDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const online = await checkHealth();
    setServerOnline(online);

    if (online) {
      try {
        const marketData = await getMarkets();
        setMarkets(marketData);

        try {
          const growthData = await getGrowthStocks();
          setGrowthStocksList(growthData);

          const map: { [symbol: string]: StockGrowth } = {};
          growthData.forEach((g) => {
            if (g.symbol) map[g.symbol] = g;
          });
          setGrowthMap(map);
        } catch (e) {
          console.warn('Could not load growth scores:', e);
        }
      } catch (err: any) {
        console.error('Fetch error:', err);
        setErrorMessage(err?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลจากเซิร์ฟเวอร์');
        setMarkets([]);
      }
    } else {
      setErrorMessage('เซิร์ฟเวอร์ออฟไลน์ (GET /health ไม่สำเร็จ)');
      setMarkets([]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();

    const savedFav = localStorage.getItem('growve_favorites');
    if (savedFav) {
      try { setFavorites(JSON.parse(savedFav)); } catch { }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('growve_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (symbol: string) => {
    setFavorites((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  const handleClickDetail = async (symbol: string) => {
    setDetailLoading(true);
    setSelectedStock(null);
    try {
      const detail = await getStockDetail(symbol);
      setSelectedStock(detail);
    } catch (err: any) {
      console.warn('Failed to load detailed stock view:', err);
      const foundMarket = markets.find((m) => m.symbol === symbol);
      const foundGrowth = growthMap[symbol];
      if (foundMarket) {
        setSelectedStock({
          symbol: foundMarket.symbol,
          name: foundMarket.name,
          price: foundMarket.price,
          change_percent: foundMarket.change_percent,
          revenue_growth_percent: foundGrowth?.revenue_growth_percent,
          analyst_buy_percent: foundGrowth?.analyst_buy_percent,
          analyst_count: foundGrowth?.analyst_count,
          news: foundGrowth?.news,
          market_cap: foundMarket.market_cap ? `$${(foundMarket.market_cap / 1e9).toFixed(2)}B` : undefined,
        });
      }
    }
    setDetailLoading(false);
  };

  // กรองรายการสินค้าและตลาด + รองรับการค้นหาภาษาไทยอัจฉริยะ
  const filteredMarkets = useMemo(() => {
    const rawQuery = searchQuery.trim().toLowerCase();

    return markets.filter((item) => {
      const symbol = (item.symbol || '').toLowerCase();
      const name = (item.name || '').toLowerCase();
      const asset = (item.asset || '').toLowerCase();

      // 1. กรองแท็บรายการโปรด
      if (activeTab === 'favorites' && !favorites.includes(item.symbol)) return false;

      // 2. ค้นหาด้วยคำค้น (รองรับไทย + อังกฤษ + synonyms)
      if (rawQuery !== '') {
        let isMatched = symbol.includes(rawQuery) || name.includes(rawQuery);

        // เช็คการจับคู่คำค้นภาษาไทย
        if (!isMatched) {
          // ก. เช็คจากหมวดหมู่ของ asset เช่น พิมพ์ "หุ้นไทย" หรือ "คริปโต" หรือ "กองทุน"
          const assetSynonyms = THAI_SEARCH_SYNONYMS[asset] || [];
          if (assetSynonyms.some((syn) => syn.includes(rawQuery) || rawQuery.includes(syn))) {
            isMatched = true;
          }

          // ข. เช็คจากชื่อย่อหุ้นตัวเฉพาะ เช่น พิมพ์ "ปตท" -> แมทช์ PTT.BK, "แอปเปิ้ล" -> AAPL
          if (!isMatched) {
            const itemSynonyms = THAI_SEARCH_SYNONYMS[item.symbol] || [];
            if (itemSynonyms.some((syn) => syn.includes(rawQuery) || rawQuery.includes(syn))) {
              isMatched = true;
            }
          }
        }

        if (!isMatched) return false;
      }

      // 3. ตัวกรองหมวดหมู่
      if (selectedCategory === 'high_growth') {
        const growth = growthMap[item.symbol];
        return growth && (growth.growth_score ?? 0) >= 80;
      }
      if (selectedCategory === 'us') return item.asset === 'us';
      if (selectedCategory === 'th') return item.asset === 'th';
      if (selectedCategory === 'etf') return item.asset === 'etf';
      if (selectedCategory === 'crypto') return item.asset === 'crypto';
      if (selectedCategory === 'fx') return item.asset === 'fx';

      return true;
    });
  }, [markets, favorites, activeTab, searchQuery, selectedCategory, growthMap]);

  // สรุปจำนวนแต่ละประเภท
  const categoryCounts = useMemo(() => {
    const counts: { [key: string]: number } = {
      all: markets.length,
      high_growth: Object.keys(growthMap).length,
      us: 0,
      th: 0,
      etf: 0,
      crypto: 0,
      fx: 0,
    };
    markets.forEach((m) => {
      if (counts[m.asset] !== undefined) {
        counts[m.asset]++;
      }
    });
    return counts;
  }, [markets, growthMap]);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0B132B]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/75 dark:bg-slate-900/75 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-300 flex items-center justify-center font-black text-white text-base shadow-sm">
              G
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              Growve
            </span>
            {serverOnline ? (
              <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-medium">
                <Wifi className="w-3 h-3" /> Live ({markets.length} assets)
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                <WifiOff className="w-3 h-3" /> Offline
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeTab === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              ตลาดทั้งหมด ({markets.length})
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeTab === 'favorites'
                  ? 'bg-white dark:bg-slate-700 text-amber-500 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>รายการโปรด ({favorites.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pb-20 pt-4">

        {/* แถบราคาตลาดเด่นๆ จาก GET /markets */}
        {markets.length > 0 && <MarketTicker markets={markets} />}

        {/* ข่าวฮิตเกาะกระแส */}
        <NewsCarousel stocks={growthStocksList} />

        {/* แจ้งเตือนกรณี Error */}
        {errorMessage && (
          <div className="my-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={fetchData}
              className="px-3 py-1 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-colors ml-2 shrink-0 cursor-pointer"
            >
              ลองใหม่
            </button>
          </div>
        )}

        {/* ช่องค้นหา & ตัวเลือกหมวดหมู่ */}
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          counts={categoryCounts}
        />

        {/* Section รายการสินทรัพย์และหุ้น */}
        <section className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-emerald-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {activeTab === 'favorites'
                  ? '⭐ รายการโปรดของคุณ'
                  : selectedCategory === 'high_growth'
                    ? '🔥 หุ้นน่าซื้อ โอกาสเติบโตสูง (US Growth Stocks)'
                    : selectedCategory === 'th'
                      ? '🇹🇭 หุ้นไทย (Thai Stocks)'
                      : selectedCategory === 'us'
                        ? '🇺🇸 หุ้นสหรัฐฯ (US Stocks)'
                        : selectedCategory === 'etf'
                          ? '📊 กองทุน ETF ที่ซื้อขายในตลาด'
                          : selectedCategory === 'crypto'
                            ? '🪙 เหรียญคริปโต (Cryptocurrency)'
                            : selectedCategory === 'fx'
                              ? '💱 อัตราแลกเปลี่ยน (Currencies / FX)'
                              : 'สินทรัพย์และหุ้นทั้งหมดในตลาด'}
              </h2>
            </div>
            <span className="text-xs text-slate-400">พบ {filteredMarkets.length} รายการ</span>
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-44 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse" />
              ))}
            </div>
          ) : filteredMarkets.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredMarkets.map((item) => (
                <DailyPickCard
                  key={item.symbol}
                  item={item}
                  growthData={growthMap[item.symbol]}
                  isFavorite={favorites.includes(item.symbol)}
                  onToggleFavorite={toggleFavorite}
                  onClickDetail={handleClickDetail}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
              <p className="text-slate-500 text-sm">
                {activeTab === 'favorites'
                  ? 'คุณยังไม่มีรายการในรายการโปรด กดปุ่ม ⭐ เพื่อบันทึกไว้ได้เลย'
                  : `ไม่พบรายการที่ตรงกับคำค้นหา "${searchQuery}"`}
              </p>
            </div>
          )}
        </section>
      </main>

      <StockDetailModal
        stock={selectedStock}
        isLoading={detailLoading}
        onClose={() => { setSelectedStock(null); setDetailLoading(false); }}
      />

      <AiChat />
    </div>
  );
}
