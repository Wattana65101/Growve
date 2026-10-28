'use client';

import React from 'react';
import { Search } from 'lucide-react';

export type CategoryType = 'all' | 'high_growth' | 'us' | 'th' | 'etf' | 'crypto' | 'fx';

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  counts?: { [key: string]: number };
}

// หมวดหมู่พร้อมธงชาติแท้แบบ SVG ไม่ใช้ emoji ที่ Windows เรนเดอร์เป็นตัวหนังสือ US/TH
const categories: { id: CategoryType; label: string; flagType?: 'us' | 'th' }[] = [
  { id: 'all', label: 'All' },
  { id: 'high_growth', label: 'High Growth' },
  { id: 'us', label: 'US Stocks', flagType: 'us' },
  { id: 'th', label: 'Thai Stocks', flagType: 'th' },
  { id: 'etf', label: 'ETF' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'fx', label: 'Currencies (FX)' },
];

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  counts,
}) => {
  return (
    <div className="w-full space-y-3.5 my-6">
      {/* กล่องค้นหา */}
      <div className="relative flex items-center">
        <div className="absolute left-4 pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by symbol (NVDA, PTT.BK, SPY, BTC) or company name..."
          className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all shadow-xs"
        />
      </div>

      {/* แถบหมวดหมู่พร้อมรูปธงชาติจริง (ไม่ซ้ำคำว่า US) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const count = counts ? counts[cat.id] : undefined;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/25 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {/* ธงชาติสหรัฐฯ SVG */}
              {cat.flagType === 'us' && (
                <svg className="w-4 h-3 rounded-2xs overflow-hidden shrink-0 shadow-2xs" viewBox="0 0 640 480">
                  <g fillRule="evenodd">
                    <path fill="#bd3d44" d="M0 0h640v480H0"/>
                    <path stroke="#fff" strokeWidth="37" d="M0 55.5h640M0 129.5h640M0 203.5h640M0 277.5h640M0 351.5h640M0 425.5h640"/>
                    <path fill="#192f5d" d="M0 0h260v260H0z"/>
                    <circle cx="130" cy="130" r="10" fill="#fff"/>
                  </g>
                </svg>
              )}

              {/* ธงชาติไทย SVG */}
              {cat.flagType === 'th' && (
                <svg className="w-4 h-3 rounded-2xs overflow-hidden shrink-0 shadow-2xs" viewBox="0 0 640 480">
                  <g fillRule="evenodd">
                    <path fill="#f4f5f8" d="M0 0h640v480H0z"/>
                    <path fill="#2d2a4a" d="M0 160h640v160H0z"/>
                    <path fill="#a51931" d="M0 0h640v80H0zm0 400h640v80H0z"/>
                  </g>
                </svg>
              )}

              <span>{cat.label}</span>

              {count !== undefined && count > 0 && (
                <span className={`ml-0.5 text-[10px] ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
