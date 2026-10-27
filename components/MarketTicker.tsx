'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TickerItem {
  symbol: string;
  name: string;
  price: string;
  change: number; // e.g. +1.45 or -0.82
}

const marketData: TickerItem[] = [
  { symbol: 'USD/THB', name: 'ดอลลาร์/บาท', price: '36.85', change: 0.12 },
  { symbol: 'GOLD', name: 'ทองคำ (XAU/USD)', price: '$2,735.40', change: 0.85 },
  { symbol: 'BTC', name: 'Bitcoin', price: '$67,850', change: 3.42 },
  { symbol: 'ETH', name: 'Ethereum', price: '$2,540', change: -1.15 },
  { symbol: 'SOL', name: 'Solana', price: '$178.20', change: 4.80 },
  { symbol: 'EUR/THB', name: 'ยูโร/บาท', price: '39.80', change: -0.25 },
  { symbol: 'JPY/THB', name: 'เยน/บาท (100¥)', price: '24.15', change: 0.05 },
];

export const MarketTicker = () => {
  return (
    <div className="w-full bg-slate-100/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 py-2.5 overflow-x-auto no-scrollbar scroll-smooth">
      <div className="max-w-6xl mx-auto px-4 flex items-center gap-4 min-w-max">
        <div className="flex items-center gap-1.5 pr-2 border-r border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          ตลาดสด
        </div>

        {marketData.map((item) => {
          const isUp = item.change >= 0;
          return (
            <div
              key={item.symbol}
              className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 shadow-xs hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{item.symbol}</span>
                <span className="text-[10px] text-slate-400 -mt-0.5">{item.name}</span>
              </div>
              <div className="text-right ml-1">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">{item.price}</span>
                <div className={`flex items-center justify-end text-[10px] font-medium ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {isUp ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                  <span>{isUp ? `+${item.change}%` : `${item.change}%`}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

