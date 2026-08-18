'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import {
  Shield,
  Heart,
  Target,
  Trophy,
  Play,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function AboutPage() {
  const { t } = useLanguage();
  const [covidMedia1, setCovidMedia1] = useState<any>(null);
  const [covidMedia2, setCovidMedia2] = useState<any>(null);
  const [coachVideoMedia, setCoachVideoMedia] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/media?page=about')
      .then((res) => res.json())
      .then((data) => {
        if (data?.items) {
          data.items.forEach((item: any) => {
            if (item.sectionKey === 'about_covid_1') setCovidMedia1(item);
            if (item.sectionKey === 'about_covid_2') setCovidMedia2(item);
            if (item.sectionKey === 'about_coach_video') setCoachVideoMedia(item);
          });
        }
      })
      .catch(() => {});
  }, []);

  const values = [
    {
      title: t('about.values.discipline'),
      desc: 'Uncompromising standard on punctuality, respectful behavior, and focus on and off the pitch.',
      color: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    },
    {
      title: t('about.values.academic'),
      desc: 'Mandatory ranking criteria (1st-5th in class for U10, 1st-10th for U13, up to 90% school average). School comes first.',
      color: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
    },
    {
      title: t('about.values.character'),
      desc: 'Nurturing honest, respectful young leaders who represent Adama and their families with pride.',
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    },
    {
      title: t('about.values.community'),
      desc: 'Fostering lifelong brotherhood and mutual support among teammates from diverse backgrounds.',
      color: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Shield className="w-4 h-4" /> Official Academy History
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight">
          {t('about.title')}
        </h1>
        <p className="text-slate-300 text-base sm:text-lg">
          {t('about.subtitle')}
        </p>
      </div>

      {/* 1. FOUNDING STORY (2013 E.C. / COVID-19 Period) */}
      <section className="p-8 sm:p-12 rounded-3xl bg-[#091224] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest">
              <Calendar className="w-4 h-4" /> Established 2013 E.C. • Adama, Ethiopia
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              {t('about.founding_story_title')}
            </h2>
            <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>{t('about.founding_story_p1')}</p>
              <p>{t('about.founding_story_p2')}</p>
            </div>

            {/* Note on 2012 / 2013 E.C. Badge timeline */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/60 text-xs text-slate-400 space-y-1">
              <span className="font-bold text-amber-400 uppercase tracking-wider block">
                Timeline & Emblem Heritage
              </span>
              <p>
                While the academy emblem preserves the historical &quot;Since 2012&quot; foundational roots,
                official team operations and structured youth cohort training at Manafesha Meda commenced in
                <strong> 2013 E.C. (2020 G.C.)</strong> during the COVID-19 pandemic.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-700 shadow-2xl group">
              <img
                src={
                  covidMedia1?.mediaUrl ||
                  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop'
                }
                alt="Founding Training Session"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5">
                <div className="text-xs text-white">
                  <span className="font-bold text-amber-400 block uppercase">Manafesha Meda • 2013 E.C.</span>
                  Initial cohort training with discipline and hope.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DEDICATED COVID-ERA CHALLENGES & PHOTO GALLERY BLOCK */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Historic Archives
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            {t('about.covid_gallery_title')}
          </h2>
          <p className="text-slate-400 text-sm">
            {t('about.covid_gallery_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Masked Training Photo 1 */}
          <div className="rounded-3xl bg-[#091224] border border-slate-800 p-4 space-y-3 group shadow-xl">
            <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-950">
              <img
                src={
                  covidMedia1?.mediaUrl ||
                  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop'
                }
                alt="Masked Training Session"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="px-2 pb-2">
              <h4 className="text-white font-bold text-base">
                {covidMedia1?.title || 'Masked Drills at Manafesha Meda'}
              </h4>
              <p className="text-slate-400 text-xs mt-1">
                {covidMedia1?.caption ||
                  'Players adhering strictly to distance rules and hygiene protocols during early morning sessions in 2013 E.C.'}
              </p>
            </div>
          </div>

          {/* Masked Training Photo 2 */}
          <div className="rounded-3xl bg-[#091224] border border-slate-800 p-4 space-y-3 group shadow-xl">
            <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-950">
              <img
                src={
                  covidMedia2?.mediaUrl ||
                  'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=800&auto=format&fit=crop'
                }
                alt="COVID Precautions in Action"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="px-2 pb-2">
              <h4 className="text-white font-bold text-base">
                {covidMedia2?.title || 'Psychological Resilience & Fitness'}
              </h4>
              <p className="text-slate-400 text-xs mt-1">
                {covidMedia2?.caption ||
                  'Football provided our youth with essential social connection, outdoor sunlight, and relief from lockdown stress.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EMBEDDED VIDEO OF COACH SPEAKING ABOUT EARLY CHALLENGES */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0B1528] to-[#080E1C] border border-slate-800 shadow-2xl space-y-8">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Play className="w-3.5 h-3.5 fill-current" /> Video Interview
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            {t('about.coach_early_challenges_title')}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t('about.coach_early_challenges_desc')}
          </p>
        </div>

        <div className="aspect-[16/9] max-w-4xl mx-auto rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-black relative group">
          <video
            controls
            playsInline
            poster={
              coachVideoMedia?.thumbnail ||
              'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1000&auto=format&fit=crop'
            }
            className="w-full h-full object-cover"
            src={
              coachVideoMedia?.mediaUrl ||
              'https://assets.mixkit.co/videos/preview/mixkit-coach-talking-with-a-group-of-young-soccer-players-42416-large.mp4'
            }
          />
        </div>
      </section>

      {/* 4. ACADEMY MOTTO PROMINENT SHOWCASE */}
      <section className="rounded-3xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 p-8 sm:p-12 text-center text-slate-950 shadow-2xl space-y-3">
        <span className="text-slate-950/70 font-black text-xs uppercase tracking-widest">
          The Nisir Creed
        </span>
        <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
          &quot;A Better Dream for a Better Life&quot;
        </h3>
        <p className="max-w-2xl mx-auto font-bold text-sm sm:text-base text-slate-900">
          We believe sport is not a distraction from school — it is the greatest teacher of focus, time management, and moral strength.
        </p>
      </section>

      {/* 5. MISSION & CORE VALUES */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Our Foundation
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            {t('about.mission_title')}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t('about.mission_text')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl bg-[#091224] border ${v.color} space-y-3 shadow-xl`}
            >
              <CheckCircle2 className="w-6 h-6" />
              <h4 className="text-white font-black text-lg">{v.title}</h4>
              <p className="text-slate-400 text-xs leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Bottom */}
      <div className="text-center pt-8">
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/25 transition-all hover:scale-105"
        >
          <Trophy className="w-4 h-4" />
          <span>Register Trainee Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
