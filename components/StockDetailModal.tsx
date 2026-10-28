'use client';

import React from 'react';
import { X, ArrowUpRight, ArrowDownRight, TrendingUp, BarChart3, DollarSign, Calendar, Activity, Users, ExternalLink, Newspaper, Image as ImageIcon } from 'lucide-react';
import { StockDetail } from '@/lib/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface StockDetailModalProps {
  stock: StockDetail | null;
  isLoading: boolean;
  onClose: () => void;
}

export const StockDetailModal: React.FC<StockDetailModalProps> = ({ stock, isLoading, onClose }) => {
  if (!stock && !isLoading) return null;

  const symbol = stock?.symbol || stock?.ticker || 'N/A';
  const name = stock?.name && stock.name !== symbol ? stock.name : '';
  
  const changePercent = stock?.change_percent != null ? stock.change_percent : (typeof stock?.change === 'number' ? stock.change : 0);
  const isUp = changePercent >= 0;
  const changeText = `${isUp ? '+' : ''}${changePercent.toFixed(2)}%`;

  const rawPrice = stock?.price ?? 0;
  const priceText = typeof rawPrice === 'number' ? `$${rawPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : String(rawPrice);

  const rawTarget = stock?.target_price ?? stock?.price_target;
  const targetText = rawTarget ? (typeof rawTarget === 'number' ? `$${rawTarget.toLocaleString()}` : String(rawTarget)) : '-';

  const trendData = stock?.trend_data || stock?.trend_history || [];
  const newsList = stock?.news || [];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading && (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-400">กำลังโหลดข้อมูล...</p>
          </div>
        )}

        {stock && !isLoading && (
          <>
            {/* Header: เอา Growth 53/100 ออก และถ้าชื่อซ้ำกับตัวย่อจะไม่แสดงบรรทัดซ้ำ */}
            <div className="flex items-start justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{symbol}</h2>
                {name && <p className="text-sm text-slate-500 mt-0.5">{name}</p>}
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Price */}
            <div className="px-5 py-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">
                  {priceText}
                </span>
                <span className={`text-sm font-semibold flex items-center ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {changeText}
                </span>
              </div>
            </div>

            {/* Sparkline Chart */}
            {trendData.length > 0 && (
              <div className="px-5 h-40 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                    <defs>
                      <linearGradient id="detailGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={isUp ? "#10B981" : "#F43F5E"} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={isUp ? "#10B981" : "#F43F5E"} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                    <YAxis hide domain={['dataMin', 'dataMax']} />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke={isUp ? "#10B981" : "#F43F5E"} strokeWidth={2} fill="url(#detailGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 px-5 pb-5">
              {[
                { icon: TrendingUp, label: 'รายได้เติบโต YoY', value: stock.revenue_growth_percent != null ? `+${stock.revenue_growth_percent}%` : '-' },
                { icon: BarChart3, label: 'EPS เติบโต', value: stock.eps_growth_percent != null ? `${stock.eps_growth_percent}%` : '-' },
                { icon: Users, label: 'มตินักวิเคราะห์แนะซื้อ', value: stock.analyst_buy_percent != null ? `${stock.analyst_buy_percent}% (${stock.analyst_count || 0} คน)` : '-' },
                { icon: Activity, label: 'Earnings Surprise', value: stock.earnings_surprise_percent != null ? `+${stock.earnings_surprise_percent}%` : '-' },
                { icon: DollarSign, label: 'เป้าหมายราคา', value: targetText },
                { icon: Calendar, label: 'ความครบถ้วนของข้อมูล', value: stock.data_coverage ? `${stock.data_coverage}%` : '-' },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 mb-1">
                    <item.icon className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[11px] text-slate-400">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.value}</span>
                </div>
              ))}
            </div>

            {/* ส่วนแสดงข่าวทั้งหมดที่เกี่ยวข้องพร้อมรูปภาพ */}
            {newsList.length > 0 && (
              <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <Newspaper className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">ข่าวด่วนล่าสุด ({newsList.length})</h3>
                </div>

                <div className="space-y-3">
                  {newsList.map((n, i) => (
                    <a
                      key={i}
                      href={n.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-emerald-500/40 transition-all group"
                    >
                      {n.image ? (
                        <img
                          src={n.image}
                          alt={n.headline}
                          className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{n.source}</span>
                          {n.datetime && (
                            <span>{new Date(n.datetime * 1000).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 group-hover:text-emerald-500 transition-colors">
                          {n.headline}
                        </p>
                      </div>

                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 shrink-0 self-center ml-1" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            {stock.disclaimer && (
              <div className="px-5 pb-5">
                <p className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  ⚠️ {stock.disclaimer}
                </p>
              </div>
            )}

            {/* Tags */}
            {stock.tags && stock.tags.length > 0 && (
              <div className="px-5 pb-5 flex flex-wrap gap-1.5">
                {stock.tags.map((tag: string) => (
                  <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
