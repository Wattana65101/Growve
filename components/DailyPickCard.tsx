'use client';

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Star } from "lucide-react";
import { MarketItem, StockGrowth } from "@/lib/api";

interface DailyPickCardProps {
  item: MarketItem;
  growthData?: StockGrowth;
  isFavorite: boolean;
  onToggleFavorite: (symbol: string) => void;
  onClickDetail: (symbol: string) => void;
}

export const DailyPickCard: React.FC<DailyPickCardProps> = ({
  item,
  growthData,
  isFavorite,
  onToggleFavorite,
  onClickDetail,
}) => {
  const symbol = item.symbol || 'N/A';
  // ถ้าชื่อที่มาจาก backend ดันเป็นตัวย่อซ้ำกัน ให้ซ่อนชื่อบรรทัดล่างไปเลย
  const name = item.name && item.name !== symbol ? item.name : '';

  const changePercent = item.change_percent ?? 0;
  const isUp = changePercent >= 0;
  const changeText = `${isUp ? '+' : ''}${changePercent.toFixed(2)}%`;

  const curr = item.currency === 'THB' ? '฿' : item.currency === 'USD' ? '$' : `${item.currency} `;
  const priceFormatted = typeof item.price === 'number'
    ? `${curr}${item.price < 1 ? item.price.toFixed(4) : item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : String(item.price);

  return (
    <Card
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-emerald-500/40 dark:hover:border-emerald-500/30 cursor-pointer flex flex-col justify-between"
      onClick={() => onClickDetail(symbol)}
    >
      <div>
        <CardHeader className="p-5 pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              
              {/* โลโก้หรือธงชาติจริงในกล่องสี่เหลี่ยม */}
              {item.image ? (
                <img
                  src={item.image}
                  alt={symbol}
                  className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700 p-0.5 bg-white dark:bg-slate-800"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : item.asset === 'us' ? (
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200/80 dark:border-slate-700 shadow-2xs overflow-hidden">
                  <svg className="w-6 h-4 rounded-xs shadow-2xs" viewBox="0 0 640 480">
                    <g fillRule="evenodd">
                      <path fill="#bd3d44" d="M0 0h640v480H0"/>
                      <path stroke="#fff" strokeWidth="37" d="M0 55.5h640M0 129.5h640M0 203.5h640M0 277.5h640M0 351.5h640M0 425.5h640"/>
                      <path fill="#192f5d" d="M0 0h260v260H0z"/>
                      <circle cx="130" cy="130" r="10" fill="#fff"/>
                    </g>
                  </svg>
                </div>
              ) : item.asset === 'th' ? (
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200/80 dark:border-slate-700 shadow-2xs overflow-hidden">
                  <svg className="w-6 h-4 rounded-xs shadow-2xs" viewBox="0 0 640 480">
                    <g fillRule="evenodd">
                      <path fill="#f4f5f8" d="M0 0h640v480H0z"/>
                      <path fill="#2d2a4a" d="M0 160h640v160H0z"/>
                      <path fill="#a51931" d="M0 0h640v80H0zm0 400h640v80H0z"/>
                    </g>
                  </svg>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200/80 dark:border-slate-700">
                  {symbol.slice(0, 3)}
                </div>
              )}

              {/* สัญลักษณ์หุ้น (ถ้าชื่อซ้ำกับตัวย่อจะไม่แสดงซ้ำสองบรรทัด) */}
              <div className="min-w-0">
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white truncate block">
                  {symbol}
                </span>
                {name && <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{name}</p>}
              </div>
            </div>

            {/* Favorite button */}
            <button
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(symbol); }}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              title={isFavorite ? "นำออกจากรายการโปรด" : "เพิ่มเป็นรายการโปรด"}
            >
              <Star className={`w-5 h-5 transition-transform active:scale-125 ${
                isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600 hover:text-amber-400'
              }`} />
            </button>
          </div>
        </CardHeader>

        <CardContent className="px-5 py-2">
          {/* แถบราคาและ % เปลี่ยนแปลง */}
          <div className="flex items-baseline justify-between my-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">ราคาล่าสุด</p>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {priceFormatted}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">24H เปลี่ยนแปลง</p>
              <div className={`text-sm font-bold flex items-center justify-end mt-0.5 ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                {isUp ? <ArrowUpRight className="h-4 w-4 mr-0.5" /> : <ArrowDownRight className="h-4 w-4 mr-0.5" />}
                {changeText}
              </div>
            </div>
          </div>

          {/* ข้อมูล Growth เพิ่มเติมเฉพาะหุ้นสหรัฐที่มีข้อมูลจาก /stocks/growth */}
          {growthData && (
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs">
              {growthData.revenue_growth_percent != null && (
                <div>
                  <span className="text-[10px] text-slate-400">YoY รายได้:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 ml-1">
                    +{growthData.revenue_growth_percent.toFixed(1)}%
                  </span>
                </div>
              )}
              {growthData.analyst_buy_percent != null && (
                <div>
                  <span className="text-[10px] text-slate-400">นักวิเคราะห์:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 ml-1">
                    แนะซื้อ {growthData.analyst_buy_percent.toFixed(0)}%
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </div>

      <CardFooter className="p-5 pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800/60 mt-2">
        <span>{item.exchange || item.currency}</span>
        {item.market_cap ? (
          <span>Cap: ${(item.market_cap / 1e9).toFixed(1)}B</span>
        ) : (
          <span className="text-emerald-500 font-medium">ดูข้อมูลเชิงลึก →</span>
        )}
      </CardFooter>
    </Card>
  );
};
