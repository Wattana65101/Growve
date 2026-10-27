import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

export const Hero = () => (
  <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-24 text-center">
    {/* Subtle Glow Background */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

    <div className="relative z-10 max-w-3xl mx-auto px-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-6">
        <Sparkles className="h-3.5 w-3.5" />
        <span>Growve AI Engine 2.0 • อัปเดตรายวัน</span>
      </div>

      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
        มองเห็นโอกาส คัดหุ้นเติบโต <br />
        <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 bg-clip-text text-transparent">
          น่าซื้อรายวัน สไตล์คนรุ่นใหม่
        </span>
      </h1>

      <p className="mt-5 text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
        ระบบคัดกรองหุ้น Growth Stock ด้วยคะแนนการเติบโต ข้อมูลงบการเงิน และสัญญาณโมเมนตัม เข้าใจง่าย ดีไซน์มินิมอลแบบ Dime
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button size="lg" className="shadow-lg shadow-emerald-500/20">
          <TrendingUp className="mr-2 h-4 w-4" /> ดูหุ้นเด็ดประจำวัน
        </Button>
        <Button variant="outline" size="lg">
          <ShieldCheck className="mr-2 h-4 w-4 text-emerald-500" /> ทำความรู้จัก Growth Score
        </Button>
      </div>
    </div>
  </section>
);
