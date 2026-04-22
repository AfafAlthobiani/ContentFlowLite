import type {Metadata} from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'ContentFlow Lite | مخطط محتوى شبكات التواصل الاجتماعي',
  description: 'منصة فاخرة لتخطيط وإدارة محتوى شبكات التواصل الاجتماعي.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ar" dir="rtl" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased bg-[#FDFCFB] text-[#121212]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
