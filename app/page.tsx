'use client';

import React, { useState, useMemo } from 'react';
import { Hero } from '@/components/Hero';
import { DailyPickCard, PickItem } from '@/components/DailyPickCard';
import { MarketTicker } from '@/components/MarketTicker';
import { NewsCarousel } from '@/components/NewsCarousel';
import { SearchFilterBar, CategoryType } from '@/components/SearchFilterBar';
import { BarChart3, Star, Sparkles } from 'lucide-react';

const initialPicks: PickItem[] = [
  {
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    category: 'tech',
    price: '$128.50',
    change: '+4.25%',
    isPositive: true,
    growthScore: 94,
    priceTarget: '$160.00',
    peRatio: '42.8',
    revenueGrowth: '122%',
    tags: ['AI', 'HighGrowth', 'Bullish', 'Semiconductor'],
    isHighGrowth: true,
    trendData: [
      { date: 'Day 1', value: 115 },
      { date: 'Day 2', value: 119 },
      { date: 'Day 3', value: 122 },
      { date: 'Day 4', value: 120 },
      { date: 'Day 5', value: 125 },
      { date: 'Day 6', value: 128 },
    ],
  },
  {
    ticker: 'PLTR',
    name: 'Palantir Technologies',
    category: 'tech',
    price: '$42.15',
    change: '+3.10%',
    isPositive: true,
    growthScore: 89,
    priceTarget: '$52.00',
    peRatio: '68.4',
    revenueGrowth: '27%',
    tags: ['BigData', 'EnterpriseAI', 'HighMargin'],
    isHighGrowth: true,
    trendData: [
      { date: 'Day 1', value: 34 },
      { date: 'Day 2', value: 36 },
      { date: 'Day 3', value: 38 },
      { date: 'Day 4', value: 37 },
      { date: 'Day 5', value: 40 },
      { date: 'Day 6', value: 42 },
    ],
  },
  {
    ticker: 'QQQ',
    name: 'Invesco QQQ Trust (Nasdaq 100 ETF)',
    category: 'etf',
    price: '$485.20',
    change: '+1.45%',
    isPositive: true,
    growthScore: 85,
    priceTarget: '$530.00',
    peRatio: '31.2',
    revenueGrowth: '16%',
    tags: ['TechETF', 'IndexFund', 'Popular'],
    isHighGrowth: false,
    trendData: [
      { date: 'Day 1', value: 468 },
      { date: 'Day 2', value: 472 },
      { date: 'Day 3', value: 478 },
      { date: 'Day 4', value: 475 },
      { date: 'Day 5', value: 480 },
      { date: 'Day 6', value: 485 },
    ],
  },
  {
    ticker: 'BTC',
    name: 'Bitcoin (Spot)',
    category: 'crypto',
    price: '$67,850',
    change: '+3.42%',
    isPositive: true,
    growthScore: 91,
    priceTarget: '$80,000',
    peRatio: '-',
    revenueGrowth: '45%',
    tags: ['DigitalGold', 'HalvingPlay', 'CryptoKing'],
    isHighGrowth: true,
    trendData: [
      { date: 'Day 1', value: 62000 },
      { date: 'Day 2', value: 63500 },
      { date: 'Day 3', value: 65000 },
      { date: 'Day 4', value: 64200 },
      { date: 'Day 5', value: 66800 },
      { date: 'Day 6', value: 67850 },
    ],
  },
  {
    ticker: 'TSLA',
    name: 'Tesla, Inc.',
    category: 'tech',
    price: '$218.80',
    change: '+1.85%',
    isPositive: true,
    growthScore: 82,
    priceTarget: '$260.00',
    peRatio: '55.2',
    revenueGrowth: '18%',
    tags: ['EV', 'Robotaxi', 'TechPioneer'],
    isHighGrowth: false,
    trendData: [
      { date: 'Day 1', value: 195 },
      { date: 'Day 2', value: 202 },
      { date: 'Day 3', value: 210 },
      { date: 'Day 4', value: 208 },
      { date: 'Day 5', value: 214 },
      { date: 'Day 6', value: 218 },
    ],
  },
  {
    ticker: 'JNJ',
    name: 'Johnson & Johnson',
    category: 'dividend',
    price: '$162.30',
    change: '-0.35%',
    isPositive: false,
    growthScore: 68,
    priceTarget: '$175.00',
    peRatio: '16.5',
    revenueGrowth: '5.2%',
    tags: ['DividendAristocrat', 'Defensive', 'Healthcare'],
    isHighGrowth: false,
    trendData: [
      { date: 'Day 1', value: 165 },
      { date: 'Day 2', value: 164 },
      { date: 'Day 3', value: 163 },
      { date: 'Day 4', value: 164 },
      { date: 'Day 5', value: 163 },
      { date: 'Day 6', value: 162 },
    ],
  },
];

export default function Home() {
  const [favorites, setFavorites] = useState<string[]>(['NVDA']);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');

  const toggleFavorite = (ticker: string) => {
    setFavorites((prev) =>
      prev.includes(ticker) ? prev.filter((t) => t !== ticker) : [...prev, ticker]
    );
  };

  // กรองรายการตาม Tab, Search และ หมวดหมู่
  const filteredPicks = useMemo(() => {
    return initialPicks.filter((item) => {
      // 1. ตรวจสอบ Tab รายการโปรด
      if (activeTab === 'favorites' && !favorites.includes(item.ticker)) {
        return false;
      }

      // 2. ตรวจสอบ Search Query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchTicker = item.ticker.toLowerCase().includes(query);
        const matchName = item.name.toLowerCase().includes(query);
        const matchTags = item.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchTicker && !matchName && !matchTags) return false;
      }

      // 3. ตรวจสอบ Filter หมวดหมู่
      if (selectedCategory === 'high_growth') {
        return item.growthScore >= 88 || item.isHighGrowth;
      }
      if (selectedCategory !== 'all') {
        return item.category === selectedCategory;
      }

      return true;
    });
  }, [favorites, activeTab, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0B132B]">
      {/* 1. แถบราคาตลาดสด: สกุลเงิน ทองคำ และคริปโต */}
      <MarketTicker />

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
          </div>

          {/* สลับ Tab ดูรายการทั่วไป หรือ รายการโปรด */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              หุ้นทั้งหมด
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'favorites'
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

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 pb-20">
        {/* Hero Section */}
        <Hero />

        {/* 2. ข่าวฮิตเกาะกระแส เลื่อนเองอัตโนมัติ */}
        <NewsCarousel />

        {/* 3. ช่องค้นหา & ตัวเลือกหมวดหมู่ (กองทุน หุ้นเทค เหรียญ เติบโตสูง ฯลฯ) */}
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* 4. Section แสดงรายการหุ้น / หุ้นน่าซื้อเติบโตสูง */}
        <section className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-emerald-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {activeTab === 'favorites'
                  ? '⭐ หุ้นในรายการโปรดของคุณ'
                  : selectedCategory === 'high_growth'
                  ? '🔥 หุ้นน่าซื้อ โอกาสเติบโตสูง (Growth Score 88+)'
                  : 'หุ้นเด็ดน่าซื้อรายวัน (Daily Growth Picks)'}
              </h2>
            </div>
            <span className="text-xs text-slate-400">พบ {filteredPicks.length} รายการ</span>
          </div>

          {/* Cards Grid */}
          {filteredPicks.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPicks.map((pick) => (
                <DailyPickCard
                  key={pick.ticker}
                  pick={pick}
                  isFavorite={favorites.includes(pick.ticker)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
              <p className="text-slate-500 text-sm">
                {activeTab === 'favorites'
                  ? 'คุณยังไม่มีหุ้นในรายการโปรด กดปุ่ม ⭐ บนการ์ดหุ้นเพื่อบันทึกไว้ได้เลย'
                  : 'ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหา'}
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
