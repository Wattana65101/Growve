'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { MarketItem } from '@/lib/api';

interface MarketTickerProps {
  markets: MarketItem[];
}

const SVG_LOGOS: { [symbol: string]: React.ReactNode } = {
  'NVDA': (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#76B900">
      <path d="M8.93 6.07c-2.3 0-4.17 1.87-4.17 4.18s1.87 4.18 4.17 4.18c1.37 0 2.58-.66 3.34-1.68.32-.43.51-.96.51-1.53 0-.58-.19-1.11-.51-1.54-.76-1.02-1.97-1.68-3.34-1.68zm-.01-2.58c3.73 0 6.75 3.02 6.75 6.76s-3.02 6.76-6.75 6.76-6.75-3.02-6.75-6.76 3.02-6.76 6.75-6.76zm8.85 2.1c-.8.88-1.29 2.05-1.29 3.33 0 1.28.49 2.45 1.29 3.33 1.21-1.02 1.99-2.56 1.99-4.28s-.78-3.26-1.99-4.28z"/>
    </svg>
  ),
  'PTT.BK': (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#00569B"/>
      <path d="M12 5c-3 4-4 7-2 9s6 1 6-2-2-5-4-7z" fill="#ED1C24"/>
      <circle cx="12" cy="12" r="2.5" fill="#FFFFFF"/>
    </svg>
  ),
  'SPY': (
    <div className="w-5 h-5 rounded-md bg-[#002D62] text-white font-black text-[9px] flex items-center justify-center tracking-tighter">
      SPY
    </div>
  ),
  'GLD': (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="goldGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FDE047"/>
          <stop offset="50%" stopColor="#EAB308"/>
          <stop offset="100%" stopColor="#CA8A04"/>
        </linearGradient>
      </defs>
      <rect x="3" y="6" width="18" height="12" rx="2" fill="url(#goldGrad2)" stroke="#B45309" strokeWidth="1"/>
      <path d="M6 10h12M6 14h12" stroke="#FEF08A" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  'BTC': (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#F7931A">
      <circle cx="12" cy="12" r="11" fill="#F7931A"/>
      <path d="M15.5 10.2c.2-1.3-.8-2-2.2-2.5l.5-1.8-1.1-.3-.4 1.8c-.3-.1-.6-.2-.9-.2l.4-1.8-1.1-.3-.5 1.8c-.3-.1-.5-.1-.7-.2l-1.5-.4-.3 1.2s.8.2.8.2c.4.1.5.4.4.6l-1 4.1c.1 0 .1.1.2.1-.1 0-.1 0-.2-.1l-.6 2.3c0 .2-.2.5-.6.4 0 0-.8-.2-.8-.2l-.6 1.4 1.4.3c.3.1.5.1.8.2l-.5 1.9 1.1.3.5-1.8c.3.1.6.2.9.2l-.5 1.8 1.1.3.5-1.8c1.9.4 3.3.2 3.9-1.5.5-1.4 0-2.2-1-2.7.7-.3 1.3-.9 1.4-2.1zm-2.4 4.5c-.3 1.4-2.6.6-3.3.4l.6-2.4c.7.2 3 .6 2.7 2zm.3-4.5c-.3 1.2-2.2.6-2.8.5l.5-2.2c.6.2 2.6.5 2.3 1.7z" fill="#FFF"/>
    </svg>
  ),
  'ETH': (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="11" fill="#627EEA"/>
      <path d="M12 4l-4.5 7.5L12 14l4.5-2.5L12 4z" fill="#FFF" fillOpacity="0.8"/>
      <path d="M12 14l-4.5-2.5L12 20l4.5-8.5L12 14z" fill="#FFF"/>
    </svg>
  ),
  'SOL': (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="11" fill="#14F195"/>
      <path d="M7 16h8l2-2H9l-2 2zm0-4h8l2-2H9l-2 2zm2-6l-2 2h8l2-2H9z" fill="#9945FF"/>
    </svg>
  ),
};

export const MarketTicker: React.FC<MarketTickerProps> = ({ markets }) => {
  if (!markets || markets.length === 0) {
    return null;
  }

  const targetSymbols = ['NVDA', 'PTT.BK', 'SPY', 'GLD', 'BTC', 'ETH', 'SOL'];
  const displayList = targetSymbols
    .map((sym) => markets.find((m) => m.symbol === sym))
    .filter((m): m is MarketItem => m !== undefined);

  if (displayList.length === 0) return null;

  // ทำการเบิ้ลรายการ 2 ชุดเพื่อให้ Animation เลื่อนไหลลื่นต่อเนื่อง (Infinite Loop)
  const marqueeList = [...displayList, ...displayList];

  return (
    <div className="w-full py-2 overflow-hidden">
      {/* ซ่อน Scrollbar 100% และเลื่อนเองอัตโนมัติอย่างนุ่มนวล (เอาเมาส์ชี้เพื่อหยุดได้) */}
      <div className="max-w-6xl mx-auto px-4 overflow-hidden">
        <div className="animate-marquee gap-3 py-1">
          {marqueeList.map((item, index) => {
            const symbol = item.symbol;
            const changePercent = item.change_percent ?? 0;
            const isUp = changePercent >= 0;
            const changeText = `${isUp ? '+' : ''}${changePercent.toFixed(2)}%`;

            const curr = item.currency === 'THB' ? '฿' : item.currency === 'USD' ? '$' : '';
            const priceFormatted = typeof item.price === 'number'
              ? `${curr}${item.price < 1 ? item.price.toFixed(3) : item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : String(item.price);

            const svgLogo = SVG_LOGOS[symbol];

            return (
              <div
                key={`${symbol}-${index}`}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs hover:border-emerald-400 dark:hover:border-emerald-600 transition-all shrink-0 min-w-[155px]"
              >
                {/* โลโก้คมชัด */}
                <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700/40 p-1 shrink-0 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                  {svgLogo || (
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {symbol.slice(0, 2)}
                    </span>
                  )}
                </div>

                {/* ตัวย่อ & ราคา */}
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
                    {symbol}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    {priceFormatted}
                  </span>
                </div>

                {/* % เปลี่ยนแปลง */}
                <div className={`ml-auto flex items-center text-[11px] font-bold shrink-0 ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  <span>{changeText}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
