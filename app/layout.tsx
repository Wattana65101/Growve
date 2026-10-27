import './globals.css';
import { Inter } from 'next/font/google';
import { PropsWithChildren } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Growve – Daily Growth Stock Picker',
  description: 'มองเห็นโอกาส คัดหุ้นเติบโตน่าซื้อรายวัน สไตล์ Clean FinTech',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="th" className={inter.className} suppressHydrationWarning>
      <head />
      <body className="min-h-screen bg-slate-50 dark:bg-[#0B132B] text-slate-900 dark:text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
