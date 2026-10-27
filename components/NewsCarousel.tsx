'use client';

import React, { useState, useEffect } from 'react';
import { Newspaper, ChevronRight, Clock, Flame } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  category: string;
  hoursAgo: number;
  impact: 'positive' | 'neutral' | 'negative';
}

const newsList: NewsItem[] = [
  {
    id: '1',
    title: 'Fed ส่งสัญญาณตรึงหรือลดดอกเบี้ยต่อเนื่อง หนุนสินทรัพย์เสี่ยงและหุ้นเทคโนโลยีพุ่งแรง',
    source: 'Bloomberg',
    category: 'นโยบายการเงิน',
    hoursAgo: 1,
    impact: 'positive'
  },
  {
    id: '2',
    title: 'NVIDIA เปิดตัวชิปรุ่นใหม่สำหรับ Data Center ยอดสั่งจองทะลุเป้า หนุน Sentiment AI ทั่วโลก',
    source: 'Reuters',
    category: 'หุ้นเทคฯ',
    hoursAgo: 2,
    impact: 'positive'
  },
  {
    id: '3',
    title: 'ราคาทองคำทำสถิติสูงสุดใหม่ (All-Time High) รับแรงซื้อสินทรัพย์ปลอดภัยจากความตึงเครียดภูมิรัฐศาสตร์',
    source: 'CNBC',
    category: 'ทองคำ/สินค้าโภคภัณฑ์',
    hoursAgo: 4,
    impact: 'positive'
  },
  {
    id: '4',
    title: 'Bitcoin พักฐานแถว $67,000 นักวิเคราะห์ชี้เป็นจังหวะสะสมก่อนรอบ Halving Cycle ถัดไป',
    source: 'CoinDesk',
    category: 'คริปโต',
    hoursAgo: 5,
    impact: 'neutral'
  },
  {
    id: '5',
    title: 'กระแสเงินทุนไหลเข้ากองทุนดัชนี Tech ETF สหรัฐฯ พุ่งแตะระดับสูงสุดในรอบ 6 เดือน',
    source: 'Financial Times',
    category: 'กองทุนรวม',
    hoursAgo: 7,
    impact: 'positive'
  }
];

export const NewsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // เลื่อนอัตโนมัติทุก 4 วินาที
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % newsList.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = newsList[currentIndex];

  return (
    <div className="w-full bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 rounded-2xl p-3.5 sm:p-4 my-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* หัวข้อ Badge ข่าวฮิต */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-xs font-bold shadow-xs">
            <Flame className="w-3.5 h-3.5 animate-bounce" />
            <span>ข่าวฮิตเกาะกระแส</span>
          </div>
          <span className="text-xs text-slate-400">เลื่อนอัตโนมัติ</span>
        </div>

        {/* เนื้อหาข่าวที่เลื่อนได้ */}
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-2 transition-all duration-500 ease-in-out">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
              {current.category}
            </span>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate hover:text-emerald-500 transition-colors cursor-pointer">
              {current.title}
            </p>
          </div>
        </div>

        {/* ข้อมูลเวลา & แหล่งข่าว */}
        <div className="flex items-center gap-3 shrink-0 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{current.hoursAgo} ชั่วโมงที่แล้ว</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="font-medium text-slate-700 dark:text-slate-300">{current.source}</span>
          
          {/* จุด pagination เล็กๆ */}
          <div className="hidden md:flex items-center gap-1 ml-2">
            {newsList.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? 'w-4 bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

