-- ========================================================
-- Growve Database Schema (Supabase Initial Design)
-- ========================================================

-- 1. ตารางเก็บข้อมูลหุ้น (stocks)
CREATE TABLE IF NOT EXISTS public.stocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticker VARCHAR(20) NOT NULL UNIQUE,       -- เช่น NVDA, PLTR, TSLA
    name VARCHAR(255) NOT NULL,              -- เช่น NVIDIA Corporation
    sector VARCHAR(100),                     -- เช่น Technology, Semiconductor
    current_price NUMERIC(12, 2) NOT NULL,   -- ราคาปัจจุบัน
    pe_ratio NUMERIC(8, 2),                  -- P/E Ratio
    revenue_growth_yoy NUMERIC(6, 2),        -- YoY Growth rate (%)
    market_cap VARCHAR(50),                  -- ขนาดมูลค่าตลาด
    logo_url TEXT,                           -- รูปโลโก้
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ตารางคัดหุ้นน่าซื้อรายวัน (daily_picks)
CREATE TABLE IF NOT EXISTS public.daily_picks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stock_id UUID NOT NULL REFERENCES public.stocks(id) ON DELETE CASCADE,
    pick_date DATE NOT NULL DEFAULT CURRENT_DATE,
    growth_score INTEGER NOT NULL CHECK (growth_score BETWEEN 0 AND 100), -- คะแนน 0 - 100
    target_price NUMERIC(12, 2) NOT NULL,    -- ราคาเป้าหมาย
    catalyst_summary TEXT,                   -- ปัจจัยบวก/เหตุผลที่น่าซื้อ
    tags TEXT[],                             -- ตัวอย่าง: ARRAY['HighGrowth', 'Bullish', 'AI']
    trend_history JSONB,                     -- ข้อมูลกราฟย้อนหลังสั้นๆ [{ date: "...", value: 120 }, ...]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(stock_id, pick_date)
);

-- 3. ตารางข้อมูลโปรไฟล์ผู้ใช้งาน (profiles / users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    subscription_tier VARCHAR(20) DEFAULT 'free', -- free หรือ pro
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ตาราง Watchlist สำหรับผู้ใช้กดบันทึกหุ้นที่สนใจ
CREATE TABLE IF NOT EXISTS public.user_watchlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stock_id UUID NOT NULL REFERENCES public.stocks(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, stock_id)
);

-- Row Level Security (RLS)
ALTER TABLE public.stocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_picks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_watchlists ENABLE ROW LEVEL SECURITY;

-- นโยบายการเข้าถึงข้อมูล (Policies)
-- ทุกคนอ่านข้อมูลหุ้นและ Daily Picks ได้ (Public Read)
CREATE POLICY "Public stocks are viewable by everyone" ON public.stocks FOR SELECT USING (true);
CREATE POLICY "Daily picks are viewable by everyone" ON public.daily_picks FOR SELECT USING (true);

-- ผู้ใช้ดูและแก้ไขเฉพาะโปรไฟล์ของตัวเอง
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Watchlist เฉพาะของตนเอง
CREATE POLICY "Users can manage own watchlist" ON public.user_watchlists FOR ALL USING (auth.uid() = user_id);

