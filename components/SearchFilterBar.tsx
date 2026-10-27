'use client';

import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

export type CategoryType = 'all' | 'high_growth' | 'tech' | 'etf' | 'crypto' | 'dividend';

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
}

const categories = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'high_growth', label: '🔥 เติบโตสูง (High Growth)' },
  { id: 'tech', label: '💻 หุ้นเทคฯ (Tech)' },
  { id: 'etf', label: '📊 กองทุน (ETF)' },
  { id: 'crypto', label: '🪙 เหรียญคริปโต' },
  { id: 'dividend', label: '💰 ปันผลสม่ำเสมอ' },
];

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
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
          placeholder="ค้นหาชื่อหุ้น, ตัวย่อ (NVDA, TSLA, BTC), หรือกองทุน..."
          className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all shadow-xs"
        />
      </div>

      {/* แถบตัวเลือกหมวดหมู่ */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id as CategoryType)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/25 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

