'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage, Locale } from '@/lib/i18n';
import { Logo } from '../common/Logo';
import {
  Globe,
  Menu,
  X,
  Phone,
  Shield,
  Trophy,
  ChevronDown,
  Sparkles,
  UserCheck,
} from 'lucide-react';

interface NavbarProps {
  onReplaySplash?: () => void;
}

export function Navbar({ onReplaySplash }: NavbarProps) {
  const pathname = usePathname();
  const { locale, setLocale, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/about', label: t('nav.about') },
    { href: '/why-join', label: t('nav.why_join') },
    { href: '/rules', label: t('nav.rules') },
    { href: '/gallery', label: t('nav.gallery') },
    { href: '/coach', label: t('nav.coach') },
    { href: '/contact', label: t('nav.contact') },
    { href: '/location', label: t('nav.location') },
  ];

  const languages: { code: Locale; label: string; short: string; flag: string }[] = [
    { code: 'om', label: 'Afaan Oromoo', short: 'AO', flag: '🌳' },
    { code: 'am', label: 'አማርኛ (Amharic)', short: 'አማ', flag: '🇪🇹' },
    { code: 'en', label: 'English', short: 'EN', flag: '🌐' },
  ];

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#070D1B]/95 backdrop-blur-xl border-b border-slate-800/80 shadow-xl shadow-black/40 py-2.5'
          : 'bg-gradient-to-b from-[#050A14]/90 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Club Logo */}
        <Logo size="md" />

        {/* Desktop Nav Links */}
        <nav className="hidden xl:flex items-center gap-1.5 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-xl text-xs lg:text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'text-amber-400 bg-amber-400/10 border border-amber-400/20 shadow-sm shadow-amber-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & Language Switcher */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-600 text-xs font-semibold transition-all shadow-sm"
              title="Change Language"
            >
              <Globe className="w-4 h-4 text-amber-400" />
              <span>{currentLang.short}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#0B1528] border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden py-1.5 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Language / Afaan / ቋንቋ
                </div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLocale(lang.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors ${
                      locale === lang.code
                        ? 'bg-amber-500/15 text-amber-400 font-bold'
                        : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </span>
                    {locale === lang.code && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  </button>
                ))}
                {onReplaySplash && (
                  <button
                    onClick={() => {
                      setLangDropdownOpen(false);
                      onReplaySplash();
                    }}
                    className="w-full mt-1 border-t border-slate-800 pt-2 pb-1 px-3.5 text-left text-[11px] text-amber-400/90 hover:text-amber-300 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" /> Replay Welcome Video
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quick Call Coach Hotline */}
          <a
            href="tel:+251911651214"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 text-xs font-semibold transition-all"
            title="Call Coach Fisha"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>0911 651 214</span>
          </a>

          {/* Register CTA Button */}
          <Link
            href="/register"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>{t('nav.register')}</span>
          </Link>
        </div>

        {/* Mobile Menu & Language Toggle */}
        <div className="flex xl:hidden items-center gap-2">
          {/* Mobile Language Button */}
          <button
            onClick={() => {
              const next: Record<Locale, Locale> = { om: 'am', am: 'en', en: 'om' };
              setLocale(next[locale]);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-900 text-amber-400 border border-slate-700 text-xs font-bold"
          >
            {currentLang.short}
          </button>

          <Link
            href="/register"
            className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-extrabold text-xs uppercase"
          >
            {t('nav.register')}
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#070D1B]/98 border-b border-slate-800 px-5 pt-3 pb-6 space-y-2 backdrop-blur-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-2 gap-2 py-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLocale(lang.code);
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-left flex items-center gap-2 ${
                  locale === lang.code
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>

          <div className="h-px bg-slate-800 my-2" />

          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  isActive
                    ? 'bg-amber-400/10 text-amber-400 font-bold border border-amber-400/20'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 text-slate-400 hover:text-amber-400 text-xs font-semibold border border-slate-800"
            >
              <Shield className="w-4 h-4 text-slate-400" />
              <span>{t('nav.admin')}</span>
            </Link>

            <a
              href="tel:+251911651214"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold"
            >
              <Phone className="w-4 h-4" />
              <span>Coach Hotline: 0911 651 214</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
