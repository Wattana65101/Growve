'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Flame } from 'lucide-react';
import { StockGrowth } from '@/lib/api';

interface NewsCarouselProps {
  stocks?: StockGrowth[];
}

interface CompactNewsItem {
  headlineTh: string;
  author: string;
  timeText: string;
  readTime: string;
  source: string;
  url: string;
}

export const NewsCarousel: React.FC<NewsCarouselProps> = ({ stocks = [] }) => {
  // ข่าวภาษาไทยรูปแบบกะทัดรัด พร้อมชื่อผู้เขียน วันที่ เวลา และระยะเวลาอ่าน
  const newsList: CompactNewsItem[] = [
    {
      headlineTh: 'Alphabet และ Microsoft เตรียมรายงานผลประกอบการ; การตัดสินใจของเฟดกำลังจะเกิดขึ้น - อะไรบ้างที่ส่งผลต่อตลาด',
      author: 'สกอตต์ คาโนว์สกี',
      timeText: 'วันพุธที่ 28 ตุลาคม 2569 เวลา 16:17 น. GMT+7',
      readTime: 'ใช้เวลาอ่าน 6 นาที',
      source: 'Yahoo Finance',
      url: 'https://finance.yahoo.com',
    },
    {
      headlineTh: 'NVIDIA เปิดตัวสถาปัตยกรรมชิป AI รุ่นใหม่ ยอดจองล่วงหน้าทะลุเป้า หนุนกลุ่มเซมิคอนดักเตอร์พุ่งแรง',
      author: 'เดวิด รอยเตอร์',
      timeText: 'วันพุธที่ 28 ตุลาคม 2569 เวลา 15:30 น. GMT+7',
      readTime: 'ใช้เวลาอ่าน 4 นาที',
      source: 'Reuters',
      url: 'https://reuters.com',
    },
    {
      headlineTh: 'Tesla ขยายบริการ Robotaxi ไร้คนขับเชิงพาณิชย์สู่เมืองใหญ่ รับกระแสตลาด AI Mobility',
      author: 'เจมส์ มิลเลอร์',
      timeText: 'วันพุธที่ 28 ตุลาคม 2569 เวลา 14:00 น. GMT+7',
      readTime: 'ใช้เวลาอ่าน 5 นาที',
      source: 'Bloomberg',
      url: 'https://bloomberg.com',
    },
    {
      headlineTh: 'ราคาทองคำทำสถิติสูงสุดใหม่ (All-Time High) รับแรงซื้อสินทรัพย์ปลอดภัยจากความตึงเครียดภูมิรัฐศาสตร์',
      author: 'ไมเคิล บราวน์',
      timeText: 'วันพุธที่ 28 ตุลาคม 2569 เวลา 12:45 น. GMT+7',
      readTime: 'ใช้เวลาอ่าน 3 นาที',
      source: 'CNBC',
      url: 'https://cnbc.com',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // เลื่อนอัตโนมัติทุก 4.5 วินาที
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % newsList.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [newsList.length]);

  const current = newsList[currentIndex];

  return (
    <div className="w-full bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 rounded-2xl p-3 sm:p-3.5 my-6 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        
        {/* ฝั่งซ้าย: ป้ายข่าวฮิต + หัวข้อข่าวแปลไทยเต็มๆ */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-xs font-bold shadow-xs shrink-0">
            <Flame className="w-3.5 h-3.5 animate-bounce" />
            <span>ข่าวฮิต</span>
          </div>

          <a
            href={current.url}
            target="_blank"
            rel="noopener noreferrer"
            title={current.headlineTh}
            className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate hover:text-emerald-500 transition-colors cursor-pointer"
          >
            {current.headlineTh}
          </a>
        </div>

        {/* ฝั่งขวา: ผู้เขียน • เวลา • ระยะเวลาอ่าน • แหล่งข่าว (เลื่อนตามอัตโนมัติ) */}
        <div className="flex items-center gap-2.5 shrink-0 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 pl-1 sm:pl-0">
          <span className="font-medium text-slate-700 dark:text-slate-300 hidden md:inline">
            {current.author}
          </span>
          <span className="text-slate-300 dark:text-slate-700 hidden md:inline">•</span>
          
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{current.readTime}</span>
          </div>

          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            {current.source}
          </span>

          {/* จุด pagination เล็กๆ */}
          <div className="hidden lg:flex items-center gap-1 ml-1">
            {newsList.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentIndex ? 'w-4 bg-emerald-500' : 'w-1.5 bg-slate-300 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
