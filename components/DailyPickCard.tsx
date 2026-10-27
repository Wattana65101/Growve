'use client';

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowUpRight, ArrowDownRight, Star } from "lucide-react";

export interface PickItem {
  ticker: string;
  name: string;
  category: 'tech' | 'etf' | 'crypto' | 'dividend';
  price: string;
  change: string;
  isPositive: boolean;
  growthScore: number;
  priceTarget: string;
  peRatio: string;
  revenueGrowth: string;
  tags: string[];
  isHighGrowth?: boolean;
  trendData: { date: string; value: number }[];
}

interface DailyPickCardProps {
  pick: PickItem;
  isFavorite: boolean;
  onToggleFavorite: (ticker: string) => void;
}

export const DailyPickCard: React.FC<DailyPickCardProps> = ({ pick, isFavorite, onToggleFavorite }) => {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-emerald-500/40 dark:hover:border-emerald-500/30">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{pick.ticker}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                Growth {pick.growthScore}/100
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{pick.name}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-base font-semibold text-slate-900 dark:text-white">{pick.price}</div>
              <div className={`text-xs font-medium flex items-center justify-end ${pick.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                {pick.isPositive ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                {pick.change}
              </div>
            </div>

            {/* ปุ่มกด Favorite รายการโปรด */}
            <button
              onClick={() => onToggleFavorite(pick.ticker)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isFavorite ? "นำออกจากรายการโปรด" : "เพิ่มเป็นรายการโปรด"}
            >
              <Star
                className={`w-5 h-5 transition-transform active:scale-125 ${
                  isFavorite
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-300 dark:text-slate-600 hover:text-amber-400'
                }`}
              />
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-5 py-2">
        {/* Metric Badges */}
        <div className="grid grid-cols-2 gap-2 my-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div>
            <p className="text-[11px] text-slate-400">เป้าหมาย (Target)</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{pick.priceTarget}</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-400">เติบโตรายได้ (YoY)</p>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">+{pick.revenueGrowth}</p>
          </div>
        </div>

        {/* Sparkline Chart */}
        <div className="h-20 w-full mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={pick.trendData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`grad-${pick.ticker}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={pick.isPositive ? "#10B981" : "#F43F5E"} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={pick.isPositive ? "#10B981" : "#F43F5E"} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" hide />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg bg-slate-900 px-2.5 py-1 text-xs text-white shadow">
                        ${payload[0].value}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={pick.isPositive ? "#10B981" : "#F43F5E"} 
                strokeWidth={2} 
                fillOpacity={1} 
                fill={`url(#grad-${pick.ticker})`} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-2 flex flex-wrap gap-1.5 border-t border-slate-100 dark:border-slate-800/60 mt-2">
        {pick.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-[11px] font-normal py-0">
            #{tag}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  );
};
