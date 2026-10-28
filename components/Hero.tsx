export const Hero = () => (
  <section className="relative overflow-hidden pt-10 pb-6 md:pt-14 md:pb-10 text-center">
    {/* Subtle Glow Background */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

    <div className="relative z-10 max-w-3xl mx-auto px-4">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
        มองเห็นโอกาส คัดหุ้นเติบโต <br />
        <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 bg-clip-text text-transparent">
          น่าซื้อรายวัน สไตล์คนรุ่นใหม่
        </span>
      </h1>

      <p className="mt-5 text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
        ระบบคัดกรองหุ้น Growth Stock ด้วยคะแนนการเติบโต ข้อมูลงบการเงิน และสัญญาณโมเมนตัม เข้าใจง่าย ดีไซน์มินิมอลแบบ Dime
      </p>
    </div>
  </section>
);
