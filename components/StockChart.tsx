'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { TrendingUp, TrendingDown, Loader2, Clock } from 'lucide-react';
import { getStockHistory, TimeRange, Interval, HistoricalPoint } from '@/lib/api';

// ApexCharts ต้อง dynamic import เพราะใช้ window (ไม่ทำงานบน SSR)
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface StockChartProps {
  symbol: string;
  currentPrice?: number;
}

const TIME_RANGES: { label: string; value: TimeRange }[] = [
  { label: '1D', value: '1D' },
  { label: '1W', value: '1W' },
  { label: '1M', value: '1M' },
  { label: '3M', value: '3M' },
  { label: '1Y', value: '1Y' },
  { label: '5Y', value: '5Y' },
];

// Interval options ที่แสดงให้เลือกสำหรับแต่ละ range
const INTERVAL_OPTIONS: Record<TimeRange, { label: string; value: Interval }[]> = {
  '1D': [
    { label: '1 นาที', value: '1m' },
    { label: '5 นาที', value: '5m' },
    { label: '15 นาที', value: '15m' },
    { label: '30 นาที', value: '30m' },
    { label: '1 ชม.', value: '1h' },
  ],
  '1W': [
    { label: '5 นาที', value: '5m' },
    { label: '15 นาที', value: '15m' },
    { label: '30 นาที', value: '30m' },
    { label: '1 ชม.', value: '1h' },
  ],
  '1M': [
    { label: '30 นาที', value: '30m' },
    { label: '1 ชม.', value: '1h' },
    { label: '1 วัน', value: '1d' },
  ],
  '3M': [
    { label: '1 ชม.', value: '1h' },
    { label: '1 วัน', value: '1d' },
  ],
  '1Y': [
    { label: '1 วัน', value: '1d' },
  ],
  '5Y': [
    { label: '1 วัน', value: '1d' },
  ],
};

// Default interval สำหรับแต่ละ range
const DEFAULT_INTERVAL: Record<TimeRange, Interval> = {
  '1D': '5m',
  '1W': '30m',
  '1M': '1d',
  '3M': '1d',
  '1Y': '1d',
  '5Y': '1d',
};

const formatPrice = (v: number) =>
  `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** ตรวจว่า interval เป็นแบบ intraday หรือไม่ */
const isIntradayInterval = (interval: Interval) => interval !== '1d';
const hasTimeInfo = (dateStr: string): boolean => {
  if (!dateStr) return false;
  return dateStr.includes('T') || dateStr.includes(':');
};

/** แปลง date string เป็น timestamp โดยป้องกัน timezone shift ถ้าเป็นแค่วันที่ล้วน */
const parseDateToTimestamp = (dateStr: string): number => {
  if (!dateStr) return Date.now();
  if (!hasTimeInfo(dateStr)) {
    // กรณี "2026-11-25" ให้ parse เป็นเวลาเที่ยงวัน Local เพื่อไม่ให้เพี้ยนข้ามวัน
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]), 12, 0, 0).getTime();
    }
  }
  return new Date(dateStr).getTime();
};

export const StockChart: React.FC<StockChartProps> = ({ symbol, currentPrice }) => {
  const [range, setRange] = useState<TimeRange>('1D');
  const [interval, setInterval] = useState<Interval>(DEFAULT_INTERVAL['1D']);
  const [data, setData] = useState<HistoricalPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async (r: TimeRange, iv: Interval) => {
    setLoading(true);
    setError(null);
    try {
      const history = await getStockHistory(symbol, r, iv);
      setData(history);
    } catch (err: any) {
      console.warn('Failed to fetch history:', err);
      setError('ไม่สามารถโหลดข้อมูลย้อนหลังได้');
      setData([]);
    }
    setLoading(false);
  }, [symbol]);

  // เมื่อเปลี่ยน range → reset interval เป็น default ของ range นั้น
  const handleRangeChange = useCallback((newRange: TimeRange) => {
    const newInterval = DEFAULT_INTERVAL[newRange];
    setRange(newRange);
    setInterval(newInterval);
  }, []);

  useEffect(() => {
    fetchHistory(range, interval);
  }, [range, interval, fetchHistory]);

  const stats = useMemo(() => {
    if (data.length < 2) return null;
    const firstClose = data[0].close;
    const lastClose = data[data.length - 1].close;
    const change = lastClose - firstClose;
    const changePercent = (change / firstClose) * 100;
    const highest = Math.max(...data.map((d) => d.high));
    const lowest = Math.min(...data.map((d) => d.low));
    return { firstClose, lastClose, change, changePercent, highest, lowest };
  }, [data]);

  const isUp = stats ? stats.change >= 0 : true;
  const mainColor = isUp ? '#10B981' : '#F43F5E';
  const intraday = isIntradayInterval(interval);

  // สร้าง series data สำหรับ ApexCharts area chart
  const seriesData = useMemo(() => {
    return data.map((d) => ({
      x: parseDateToTimestamp(d.date),
      y: d.close,
    }));
  }, [data]);

  // ตรวจว่าในชุดข้อมูลนี้มีเวลาจริงระบุมาหรือไม่ (ไม่ใช่แค่วันที่ล้วน)
  const dataHasRealTime = useMemo(() => {
    return data.some((d) => hasTimeInfo(d.date));
  }, [data]);

  // Tooltip format แยกตาม interval/range
  const tooltipXFormat = useMemo(() => {
    if (intraday && dataHasRealTime) return 'dd MMM yyyy · HH:mm';
    if (range === '1M' || range === '3M') return 'dd MMM yyyy';
    return "MMM 'yy";
  }, [range, intraday, dataHasRealTime]);

  // Datetime formatter สำหรับ XAxis
  const datetimeFormatter = useMemo(() => {
    if (intraday && dataHasRealTime) {
      return {
        year: 'yyyy',
        month: "MMM 'yy",
        day: 'dd MMM',
        hour: 'HH:mm',
        minute: 'HH:mm',
      };
    }
    return {
      year: 'yyyy',
      month: "MMM 'yy",
      day: 'dd MMM',
      hour: 'HH:mm',
    };
  }, [intraday, dataHasRealTime]);

  const chartOptions: ApexCharts.ApexOptions = useMemo(() => ({
    chart: {
      type: 'area',
      height: 320,
      fontFamily: 'inherit',
      toolbar: {
        show: true,
        tools: {
          download: false,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
        autoSelected: 'pan',
      },
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: true,
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 400,
        dynamicAnimation: { speed: 300 },
      },
      background: 'transparent',
      selection: {
        enabled: true,
        stroke: { color: mainColor, width: 1 },
        fill: { color: mainColor, opacity: 0.1 },
      },
    },
    colors: [mainColor],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: 'rgba(148, 163, 184, 0.15)',
      strokeDashArray: 3,
      xaxis: { lines: { show: intraday } },
      yaxis: { lines: { show: true } },
      padding: { left: 8, right: 8 },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: '#94a3b8',
          fontSize: '10px',
        },
        datetimeUTC: false,
        datetimeFormatter: datetimeFormatter as any,
        rotate: intraday ? -45 : 0,
        rotateAlways: false,
      },
      axisBorder: { show: false },
      axisTicks: { show: intraday, color: 'rgba(148, 163, 184, 0.3)' },
      crosshairs: {
        show: true,
        stroke: { color: mainColor, width: 1, dashArray: 3 },
      },
      tooltip: {
        enabled: true,
        formatter: (val: string) => {
          const d = new Date(val);
          if (intraday && dataHasRealTime) {
            return d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
          }
          return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
        },
      },
      tickAmount: intraday ? 12 : undefined,
    },
    yaxis: {
      labels: {
        style: {
          colors: '#94a3b8',
          fontSize: '10px',
        },
        formatter: (val: number) => `$${val.toFixed(2)}`,
        offsetX: -4,
      },
      forceNiceScale: true,
      tickAmount: 6,
    },
    tooltip: {
      enabled: true,
      shared: false,
      intersect: false,
      theme: 'dark',
      style: { fontSize: '11px' },
      x: {
        show: true,
        format: tooltipXFormat,
      },
      y: {
        formatter: (val: number) => formatPrice(val),
        title: { formatter: () => (intraday && dataHasRealTime) ? 'ราคา' : 'ราคาปิด' },
      },
      marker: { show: true },
      custom: function({ series: s, seriesIndex, dataPointIndex, w }: any) {
        const point = data[dataPointIndex];
        if (!point) return '';
        const d = new Date(point.date);
        const pointHasTime = hasTimeInfo(point.date);

        let headerStr: string;
        if (pointHasTime) {
          const timeStr = d.toLocaleTimeString('th-TH', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
          const dateStr = d.toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });
          headerStr = `${dateStr} · ${timeStr}`;
        } else {
          // ถ้าไม่มีเวลาส่งมาจาก backend แสดงแค่วันที่ ไม่หลอกตาว่า 07:00:00
          headerStr = d.toLocaleDateString('th-TH', {
            weekday: 'short',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });
        }

        const vol = point.volume != null
          ? (point.volume >= 1e6 ? `${(point.volume / 1e6).toFixed(1)}M` : point.volume.toLocaleString())
          : '-';

        return `<div style="padding:8px 12px;font-size:11px;line-height:1.6;min-width:160px">
          <div style="font-weight:700;color:#e2e8f0;margin-bottom:2px">${headerStr}</div>
          <div style="display:grid;grid-template-columns:auto 1fr;gap:2px 12px;color:#94a3b8">
            <span>Open</span><span style="text-align:right;color:#e2e8f0;font-weight:600">${formatPrice(point.open)}</span>
            <span>High</span><span style="text-align:right;color:#10B981;font-weight:600">${formatPrice(point.high)}</span>
            <span>Low</span><span style="text-align:right;color:#F43F5E;font-weight:600">${formatPrice(point.low)}</span>
            <span>Close</span><span style="text-align:right;color:#e2e8f0;font-weight:600">${formatPrice(point.close)}</span>
            <span>Volume</span><span style="text-align:right;color:#cbd5e1;font-weight:600">${vol}</span>
          </div>
        </div>`;
      },
    },
    annotations: stats ? {
      yaxis: [{
        y: stats.firstClose,
        borderColor: '#94a3b8',
        strokeDashArray: 4,
        label: {
          text: (intraday && dataHasRealTime) ? `เปิด ${formatPrice(stats.firstClose)}` : `เริ่มต้น ${formatPrice(stats.firstClose)}`,
          borderColor: 'transparent',
          style: {
            color: '#94a3b8',
            background: 'transparent',
            fontSize: '10px',
            padding: { left: 4, right: 4, top: 2, bottom: 2 },
          },
          position: 'front',
        },
      }],
    } : undefined,
    markers: {
      size: 0,
      strokeWidth: 2,
      hover: { size: 4, sizeOffset: 2 },
    },
  }), [mainColor, stats, datetimeFormatter, tooltipXFormat, intraday, data, dataHasRealTime]);

  const series: Array<{ name: string; data: Array<{ x: number; y: number }> }> = useMemo(() => [
    { name: symbol, data: seriesData },
  ], [symbol, seriesData]);

  const availableIntervals = INTERVAL_OPTIONS[range];

  return (
    <div className="w-full">
      {/* Time range selector + Stats */}
      <div className="flex items-center justify-between px-1 mb-2">
        {/* Stats summary */}
        <div className="flex items-center gap-2 text-xs">
          {stats && (
            <>
              <span className={`flex items-center gap-0.5 font-semibold ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {isUp ? '+' : ''}{stats.changePercent.toFixed(2)}%
              </span>
              <span className="text-slate-400">
                ({isUp ? '+' : ''}{formatPrice(stats.change)})
              </span>
            </>
          )}
        </div>

        {/* Range buttons */}
        <div className="flex gap-0.5 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          {TIME_RANGES.map((tr) => (
            <button
              key={tr.value}
              onClick={() => handleRangeChange(tr.value)}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                range === tr.value
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              {tr.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interval selector — เลือกความละเอียดของข้อมูล */}
      {availableIntervals.length > 1 && (
        <div className="flex items-center gap-2 px-1 mb-2">
          <Clock className="w-3 h-3 text-slate-400" />
          <span className="text-[10px] text-slate-400 mr-1">ความละเอียด:</span>
          <div className="flex gap-0.5">
            {availableIntervals.map((iv) => (
              <button
                key={iv.value}
                onClick={() => setInterval(iv.value)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all cursor-pointer ${
                  interval === iv.value
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 border border-transparent'
                }`}
              >
                {iv.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Intraday hint */}
      {intraday && !loading && data.length > 0 && (
        <p className="text-[10px] text-slate-400 px-1 mb-1 flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          ข้อมูลทุก {availableIntervals.find(i => i.value === interval)?.label || interval} — ซูมเข้าเพื่อดูเวลาละเอียดยิ่งขึ้น ({data.length} จุดข้อมูล)
        </p>
      )}

      {/* Chart area */}
      <div className="w-full" style={{ minHeight: 320 }}>
        {loading ? (
          <div className="h-[320px] flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
            <span className="ml-2 text-xs text-slate-400">กำลังโหลดกราฟ...</span>
          </div>
        ) : error ? (
          <div className="h-[320px] flex flex-col items-center justify-center text-xs text-slate-400">
            <p>{error}</p>
            <button
              onClick={() => fetchHistory(range, interval)}
              className="mt-2 px-3 py-1 rounded-lg bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600 transition-colors cursor-pointer"
            >
              ลองใหม่
            </button>
          </div>
        ) : data.length === 0 ? (
          <div className="h-[320px] flex items-center justify-center text-xs text-slate-400">
            ไม่มีข้อมูลราคาย้อนหลังสำหรับช่วงเวลานี้
          </div>
        ) : (
          <Chart
            options={chartOptions}
            series={series}
            type="area"
            height={320}
            width="100%"
          />
        )}
      </div>

      {/* High / Low bar */}
      {stats && data.length > 0 && (
        <div className="flex items-center justify-between mt-1 px-1 text-[11px] text-slate-400">
          <span>Low: <span className="text-rose-500 font-semibold">{formatPrice(stats.lowest)}</span></span>
          <div className="flex-1 mx-3 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
            {(() => {
              const pct = ((stats.lastClose - stats.lowest) / (stats.highest - stats.lowest)) * 100;
              return (
                <div
                  className="absolute top-0 left-0 h-full rounded-full"
                  style={{
                    width: `${Math.max(2, Math.min(100, pct))}%`,
                    background: `linear-gradient(90deg, ${isUp ? '#10B981' : '#F43F5E'}88, ${mainColor})`,
                  }}
                />
              );
            })()}
          </div>
          <span>High: <span className="text-emerald-500 font-semibold">{formatPrice(stats.highest)}</span></span>
        </div>
      )}
    </div>
  );
};
