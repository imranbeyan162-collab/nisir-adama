import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Nisir Football Academy — Adama, Ethiopia | Better Dream Better Life',
  description:
    'Official website and registration portal for Nisir Football Academy in Adama at Manafesha Meda. Elite youth training, academic excellence, and discipline since 2013 E.C.',
  icons: {
    icon: '/nisir-logo.png',
    shortcut: '/nisir-logo.png',
    apple: '/nisir-logo.png',
  },
  keywords: [
    'Nisir Football Academy',
    'Adama Football',
    'Manafesha Meda',
    'Ethiopian Youth Soccer',
    'Coach Fisha Welde Meskel',
    'Imako Digital Marketing Agency',
  ],
  openGraph: {
    title: 'Nisir Football Academy — Adama, Ethiopia',
    description: 'A Better Dream for a Better Life — Grassroots Football and Academic Excellence.',
    images: ['/nisir-logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#050A14] text-slate-100 antialiased selection:bg-amber-500 selection:text-black">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1 pt-16 sm:pt-20">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
