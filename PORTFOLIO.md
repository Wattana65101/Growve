# 🌿 Growve — Intelligent Multi-Asset Analytics & Stock Screening Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![ApexCharts](https://img.shields.io/badge/ApexCharts-Visualizer-orange?style=flat)](https://apexcharts.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)

---

## 📌 บทคัดย่อโปรเจกต์ (Project Overview)

**Growve** คือเว็บแอปพลิเคชันแดชบอร์ดด้านการเงินและการลงทุนยุคใหม่ ออกแบบมาเพื่อช่วยให้นักลงทุนสามารถคัดกรอง ติดตาม และวิเคราะห์สินทรัพย์หลากหลายประเภทได้แบบเรียลไทม์ (Multi-Asset Real-Time Screener) ครอบคลุมทั้ง **หุ้นสหรัฐฯ (US Stocks)**, **หุ้นไทย (SET/MAI)**, **กองทุนรวม ETF**, **คริปโทเคอร์เรนซี (Cryptocurrency)** และ **อัตราแลกเปลี่ยน (Forex)**

ระบบมาพร้อมกับอัลกอริทึมจัดอันดับหุ้นเติบโตสูง (Growth Stock Scoring), กราฟเทคนิคัลอินเทอร์แอคทีฟความละเอียดสูงที่ลื่นไหลด้วย ApexCharts, การค้นหาคำศัพท์ภาษาไทยอัจฉริยะ (Semantic Search Synonyms) ตลอดจน AI ผู้ช่วยวิเคราะห์ข้อมูลการลงทุนแบบเรียลไทม์ผ่าน Server-Sent Events (SSE)

---

## ✨ ฟีเจอร์เด่นของระบบ (Key Features)

### 1. 🌐 ตลาดและข้อมูลสินทรัพย์รอบด้าน (Multi-Asset Real-Time Ticker & Market Feed)
- แสดงสถานะราคาและเปอร์เซ็นต์การเปลี่ยนแปลงของสินทรัพย์จาก 5 ตลาดหลักในหน้าเดียว
- แถบวิ่ง **Market Ticker** ด้านบนเพื่ออัปเดตราคาแบบสดๆ
- แบ่งแยกประเภทสินทรัพย์ชัดเจน (US, Thai, ETF, Crypto, FX)

### 2. 🚀 การจัดอันดับหุ้นเติบโต (Growth Watchlist & Scoring Engine)
- คัดกรองและประเมิน Growth Score (0 - 100) ของหุ้นรายตัว
- แสดงข้อมูลปัจจัยพื้นฐานสำคัญ:
  - การเติบโตของรายได้ (Revenue Growth YoY)
  - การเติบโตของกำไรต่อหุ้น (EPS Growth)
  - ความเห็นของนักวิเคราะห์และการแนะซื้อ (Analyst Consensus & Target Price)
  - ผลการดำเนินงานเทียบกับคาดการณ์ (Earnings Surprise %)

### 3. 📈 กราฟเทคนิคอลอัจฉริยะ (Interactive High-Performance ApexCharts)
- แสดงกราฟ Area Chart สีสันตามทิศทางราคา (เขียว/แดง) พร้อมเอฟเฟกต์ Gradient โปร่งใส
- **เลือกช่วงเวลาได้ยืดหยุ่น:** 1D, 1W, 1M, 3M, 1Y, 5Y
- **ปรับความละเอียดของข้อมูล (Interval):** 1m, 5m, 15m, 30m, 1h, 1d
- **ระบบ Interactive ควบคุมครบ:** รองรับการซูม (Zoom In / Out), ลากเลื่อนไทม์ไลน์ (Pan), และ Reset
- **Tooltip เชิงลึก:** ชี้ดูราคา Open, High, Low, Close, Volume พร้อมวันและเวลา
- **แถบแสดงระดับราคา (High / Low Bar):** แสดงตำแหน่งราคาปัจจุบันเมื่อเทียบกับราคาสูงสุดและต่ำสุดของช่วงเวลานั้น

### 4. 🔍 ระบบค้นหาคำภาษาไทยอัจฉริยะ (Smart Thai Search Synonyms)
- ค้นหาหุ้นได้ทั้งภาษาไทยและอังกฤษผ่านพจนานุกรม Synonyms ในตัว
- เช่น พิมพ์คำว่า *"ปตท"* จะจับคู่ `PTT.BK`, *"การ์ดจอ"* หรือ *"ชิป"* จะจับคู่ `NVDA`, หรือพิมพ์ประเภท *"หุ้นไทย"*, *"คริปโต"*, *"กองทุน"* ตัวกรองจะดึงสินทรัพย์ในหมวดนั้นขึ้นมาทันที

### 5. 📰 ข่าวสารและตัวเร่งราคา (Financial News Carousel & Catalysts)
- ดึงข่าวสารการเงินล่าสุดที่เกี่ยวข้องกับหุ้นแต่ละตัว พร้อมภาพปก แหล่งข่าว และเวลาที่เผยแพร่ เพื่อไม่ให้พลาดเหตุการณ์สำคัญในตลาด

### 6. 🤖 ผู้ช่วย AI ด้านการลงทุน (Growve AI Streaming Assistant)
- ปรึกษาและสอบถามข้อมูลหุ้น กองทุน หรือแนวโน้มตลาดผ่านหน้าต่างแชท AI
- สตรีมข้อความแบบเรียลไทม์ (Server-Sent Events: SSE) อักษรขึ้นทีละตัวแบบพิมพ์ดีด
- ระบบเก็บและล้าง Session ประวัติการสนทนาส่วนบุคคล

### 7. ⭐ รายการโปรดส่วนตัว (Watchlist / Favorites)
- บันทึกหุ้นหรือสินทรัพย์ที่ติดตามไว้ใน Favorites ผ่าน LocalStorage ทำให้ข้อมูลยังคงอยู่เมื่อกลับมาใช้งานใหม่

---

## 🏗️ สถาปัตยกรรมระบบ (System Architecture & Integrations)

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Browser                        │
│            Next.js 14 (App Router) + Tailwind CSS           │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
         REST API (HTTP)                Server-Sent Events (SSE)
         Header: X-API-Key                     Stream
               ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Growve Backend Server                    │
│                 (FastAPI / Python, Port 8000)               │
│                                                             │
│  • /markets                   • /stocks/{symbol}            │
│  • /stocks/growth             • /stocks/{symbol}/history    │
│  • /health                    • /chat/stream                │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌─────────────────────────────┐┌──────────────────────────────┐
│  Database & Data Providers  ││       AI & Cloud Model       │
│  • Supabase (PostgreSQL)    ││  • LLM (Gemini / OpenAI API) │
│  • Yahoo Finance / Finnhub  ││  • Financial Analysis Prompt │
└─────────────────────────────┘└──────────────────────────────┘
```

### รายละเอียดการเชื่อมต่อ (Integration Details):
| องค์ประกอบ | เทคโนโลยี / แหล่งที่มา | วัตถุประสงค์ |
|---|---|---|
| **Frontend Framework** | Next.js 14 (React 18, TypeScript) | โครงสร้างเว็บแอปพลิเคชันแบบ SPA & SSR มีประสิทธิภาพสูง |
| **Styling** | Tailwind CSS + Lucide Icons | ตกแต่งหน้าจอ ออกแบบ Responsive และ Dark Mode ในตัว |
| **Data Visualization** | ApexCharts + React-ApexCharts | กราฟราคาเชิงเทคนิคอล รองรับ Zoom, Pan, Tooltip |
| **Backend REST API** | FastAPI / Python (หรือ Node.js) | จัดเตรียมข้อมูลราคา ข้อมูลหุ้นพื้นฐาน และประวัติราคาย้อนหลัง |
| **Authentication / Security** | API Key (`X-API-Key`) | ป้องกันและตรวจสอบสิทธิ์การเรียกใช้งาน API ปลายทาง |
| **AI Stream Engine** | Server-Sent Events (SSE) | ถ่ายทอดข้อความตอบกลับจากโมเดลปัญญาประดิษฐ์แบบ Real-time Stream |
| **Database** | Supabase (PostgreSQL) | บันทึกและดึงข้อมูลโครงสร้างผู้ใช้และสินทรัพย์ |
| **Client Storage** | Browser `localStorage` | เก็บ Session ID ของ AI Chat และรายการ Watchlist ของผู้ใช้ |

---

## 🛠️ แนะนำการติดตั้งและการใช้งานเบื้องต้น (Getting Started)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. ตั้งค่าตัวแปรสภาพแวดล้อม (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_KEY=your_api_key_here
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. รันโปรเจกต์ในโหมดพัฒนา
```bash
npm run dev
```
เปิดบราวเซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

---

## 🌟 จุดเด่นและทักษะที่นำเสนอใน Portfolio (Portfolio Highlights)

1. **Full-Stack Integration Mastery:** มีความเข้าใจในการเชื่อมต่อ Frontend เข้ากับ Backend REST API แบบมีระบบรักษาความปลอดภัย (Custom Header Token) และการจัดการข้อผิดพลาด (Graceful Fallback & Error Handling)
2. **Advanced Data Visualization:** ความสามารถในการจัดการข้อมูลสถิติ Time-Series ซับซ้อนด้วย ApexCharts โดยใช้เทคนิค Dynamic Client-Side Rendering ป้องกันปัญหา SSR ของ Next.js
3. **Generative AI Real-Time Application:** พัฒนาฟีเจอร์ AI Assistant ที่ใช้สถาปัตยกรรม Server-Sent Events (SSE) ควบคุม Reader Buffer เพื่อแสดงผลตัวอักษรแบบสดใหม่
4. **Clean Code & Robust Typing:** เขียนโค้ดด้วย TypeScript 100% ประกาศ Interfaces ครอบคลุมทุก Layer ปราศจาก Type Error
5. **Modern UX/UI Craftsmanship:** ออกแบบหน้าตาที่เป็นมิตร สะอาดตา ใช้งานได้จริงบนทุกขนาดหน้าจอ ทั้ง Desktop, Tablet และ Mobile พร้อมรองรับ Dark Mode เต็มรูปแบบ
