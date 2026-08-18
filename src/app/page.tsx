'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import {
  Trophy,
  ArrowRight,
  Shield,
  GraduationCap,
  Play,
  CheckCircle,
  Users,
  Calendar,
  Sparkles,
  MapPin,
  Phone,
  ChevronRight,
} from 'lucide-react';

export default function HomePage() {
  const { t } = useLanguage();
  const [heroMedia, setHeroMedia] = useState<any>(null);
  const [gallerySnapshots, setGallerySnapshots] = useState<any[]>([]);

  useEffect(() => {
    // Fetch custom hero media from CMS if updated
    fetch('/api/admin/media?sectionKey=home_hero')
      .then((res) => res.json())
      .then((data) => {
        if (data?.item) setHeroMedia(data.item);
      })
      .catch(() => {});

    // Fetch featured gallery snapshots
    fetch('/api/admin/gallery?type=ALL')
      .then((res) => res.json())
      .then((data) => {
        if (data?.items) setGallerySnapshots(data.items.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  const stats = [
    {
      label: t('home.stats.players'),
      value: '250+',
      icon: Users,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
    },
    {
      label: t('home.stats.categories'),
      value: '4 Levels',
      sub: 'U10, U13, U15, 17',
      icon: Trophy,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
    },
    {
      label: t('home.stats.academic_avg'),
      value: '90%',
      sub: 'Rank 1st-5th Mandate',
      icon: GraduationCap,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      label: t('home.stats.founded'),
      value: '2013 E.C.',
      sub: 'Chapi Stadium, Adama',
      icon: Calendar,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
    },
  ];

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center -mt-16 sm:-mt-20 overflow-hidden">
        {/* Background Video / Photo Montage */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover filter brightness-[0.4] contrast-[1.1]"
            src={
              heroMedia?.mediaUrl ||
              'https://assets.mixkit.co/videos/preview/mixkit-young-soccer-players-training-on-a-field-42417-large.mp4'
            }
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050A14] via-[#050A14]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050A14] via-transparent to-[#050A14]/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
          {/* Club Badge Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/80 border border-amber-400/30 backdrop-blur-md mb-6 shadow-lg shadow-black/50 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold text-amber-400 tracking-wider uppercase">
              {t('branding.location')}
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-xs font-semibold text-slate-300">
              {t('branding.motto_short')}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tight leading-[1.08] mb-6 drop-shadow-2xl">
            {heroMedia?.title || t('home.hero_title')}
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-200 font-medium leading-relaxed mb-10 drop-shadow-md">
            {heroMedia?.subtitle || t('home.hero_tagline')}
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
              <Trophy className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>{t('home.register_cta')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/gallery"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 text-white border border-slate-700/80 hover:border-slate-500 font-bold text-sm uppercase tracking-wider backdrop-blur-md shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-amber-400 fill-current" />
              <span>{t('home.explore_gallery')}</span>
            </Link>

            <Link
              href="/why-join"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <span>{t('home.why_nisir_btn')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. ACADEMY SNAPSHOT HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-3xl bg-[#091224]/80 border border-slate-800/80 hover:border-amber-400/40 transition-all duration-300 shadow-xl relative overflow-hidden group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-400">
                    Verified
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-300">
                  {stat.label}
                </div>
                {stat.sub && (
                  <div className="text-[11px] text-slate-400 mt-1">{stat.sub}</div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. FOUNDING STORY & RESILIENCE TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#091224] via-[#0D1D3A] to-[#091224] border border-blue-900/30 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-wider">
                <Shield className="w-4 h-4" /> 2013 E.C. Founding Origin
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
                {t('home.quick_about_title')}
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {t('home.quick_about_desc')}
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors"
                >
                  <span>{t('home.quick_about_cta')}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/rules"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-slate-300 border border-slate-700 hover:text-white text-xs font-semibold"
                >
                  <span>View Academic & Discipline Rules</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl relative group">
                <img
                  src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=800&auto=format&fit=crop"
                  alt="COVID-Era Training Session"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <div className="text-xs text-slate-200">
                    <span className="font-bold text-amber-400 block uppercase">Historic Session • 2013 E.C.</span>
                    Masked drills protecting youth mental health during lockdown.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MOTTO BANNER */}
      <section className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 py-10 px-4 shadow-xl">
        <div className="max-w-5xl mx-auto text-center space-y-2">
          <span className="text-slate-950/70 text-xs font-black uppercase tracking-widest">
            Academy Core Motto
          </span>
          <h3 className="text-2xl sm:text-4xl font-black text-slate-950 uppercase tracking-tight">
            &quot;A Better Dream for a Better Life&quot;
          </h3>
          <p className="text-slate-900 font-semibold text-xs sm:text-sm">
            Strict academics • Elite football training • Brotherhood at Chapi Stadium
          </p>
        </div>
      </section>

      {/* 5. CINEMATIC GALLERY SNAPSHOT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Chapi Stadium Action
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              {t('home.featured_video_title')}
            </h2>
            <p className="text-slate-400 text-sm max-w-xl">
              {t('home.featured_video_subtitle')}
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-400/30 text-xs font-bold uppercase transition-all"
          >
            <span>View Full Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gallerySnapshots.map((item, idx) => (
            <div
              key={item.id || idx}
              className="group rounded-3xl bg-[#091224] border border-slate-800 overflow-hidden shadow-xl hover:border-amber-400/40 transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                <img
                  src={item.thumbnail || item.mediaUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {item.mediaType === 'video' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-amber-400/90 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                )}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                  {item.category}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-white font-bold text-base group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-slate-400 text-xs mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION FOR PARENTS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-950 via-[#0B1A2F] to-slate-950 border border-emerald-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider">
            <Trophy className="w-4 h-4" /> Trainee Enrollment Open
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            Register Your Child Today
          </h2>
          <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base leading-relaxed">
            Multi-child registration available. Age categories U10, U13, U15, and 17.
            Secure payment via Commercial Bank of Ethiopia (CBE) and Telebirr.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/register"
              className="px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all"
            >
              Start Online Registration
            </Link>
            <Link
              href="/contact"
              className="px-6 py-4 rounded-2xl bg-slate-900 text-slate-200 border border-slate-700 hover:text-white font-bold text-sm"
            >
              Contact Coach Directly
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
