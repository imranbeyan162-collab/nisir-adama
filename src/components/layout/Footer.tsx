'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { Logo } from '../common/Logo';
import {
  Phone,
  MapPin,
  Shield,
  Trophy,
  ExternalLink,
  Mail,
  Heart,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#040812] border-t border-slate-800/80 text-slate-400 text-sm relative overflow-hidden">
      {/* Background Subtle Highlights */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          {/* Col 1: Academy Identity */}
          <div className="lg:col-span-4 space-y-4">
            <Logo size="lg" />
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm">
              Adama&apos;s premier youth football academy dedicated to tactical athletic mastery, academic excellence, and rock-solid discipline since 2013 E.C.
            </p>
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                Official Motto
              </div>
              <div className="text-white font-extrabold text-sm italic">
                &quot;A Better Dream for a Better Life&quot;
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Academy
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link href="/why-join" className="hover:text-amber-400 transition-colors">
                  {t('nav.why_join')}
                </Link>
              </li>
              <li>
                <Link href="/rules" className="hover:text-amber-400 transition-colors">
                  {t('nav.rules')}
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-amber-400 transition-colors">
                  {t('nav.gallery')}
                </Link>
              </li>
              <li>
                <Link href="/coach" className="hover:text-amber-400 transition-colors">
                  {t('nav.coach')}
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-amber-400 font-bold hover:underline">
                  {t('nav.register')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contact Details */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Academy Contacts
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-slate-300 font-semibold">Coach Fisha Welde Meskel</div>
                  <a href="tel:+251911651214" className="hover:text-amber-400 block font-mono">
                    +251 911 651 214
                  </a>
                  <a href="tel:+251908171773" className="hover:text-amber-400 block font-mono">
                    +251 908 171 773
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-slate-300 font-semibold">Training Pitch</div>
                  <div>Chapi Meda / Chapi Stadium, Adama</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-slate-300 font-semibold">Office Address</div>
                  <div>Franco Batu Tower, 2nd Floor, Adama</div>
                </div>
              </div>

              {/* TikTok Link */}
              <a
                href="https://www.tiktok.com/@nisiradama"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold transition-all group"
              >
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
                <span>TikTok: <span className="text-pink-400 font-mono">@nisiradama</span></span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Col 4: Imako Digital Marketing Agency Showcase */}
          <div className="lg:col-span-3">
            <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0B1528] to-[#0D1B36] border border-blue-900/40 shadow-xl space-y-3 relative overflow-hidden">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider">
                  Partner Agency
                </span>
              </div>

              <h4 className="text-white font-extrabold text-sm leading-snug">
                {t('agency.promo_title')}
              </h4>

              <p className="text-[11px] text-slate-300 leading-relaxed">
                {t('agency.promo_desc')}
              </p>

              <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px]">
                <div className="text-white font-semibold flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <a href="tel:+251912251113" className="hover:text-amber-400 font-mono">
                    +251 912 251 113
                  </a>
                  <span>/</span>
                  <a href="tel:+251921799925" className="hover:text-amber-400 font-mono">
                    +251 921 799 925
                  </a>
                </div>
                <div className="text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <a href="mailto:imranbeyan162@gmail.com" className="hover:text-amber-400 font-mono">
                    imranbeyan162@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Credit */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span>© 2026 Nisir Football Academy (Adama, Ethiopia). All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-slate-400 hover:text-amber-400 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>

            <span className="text-slate-700">•</span>

            <span className="text-slate-400">
              Crafted by{' '}
              <a
                href="mailto:imranbeyan162@gmail.com"
                className="text-amber-400 font-semibold hover:underline"
              >
                Imako Digital Marketing Agency
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
