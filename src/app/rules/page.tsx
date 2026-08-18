'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import {
  ShieldAlert,
  GraduationCap,
  Ban,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Trophy,
  ArrowRight,
} from 'lucide-react';

export default function RulesPage() {
  const { t } = useLanguage();

  const academicTiers = [
    {
      age: 'Ages 6 – 11 (U10 Category)',
      rank: 'Must Rank 1st – 5th in Class',
      desc: 'Foundational years where core reading, arithmetic, and study discipline are cemented.',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
    {
      age: 'Ages 11 – 13 (U13 Category)',
      rank: 'Must Rank 1st – 10th in Class',
      desc: 'Transition to middle school requires active time-management between homework and football.',
      badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    },
    {
      age: 'Ages 14 – 16 (U15 & 17 Categories)',
      rank: 'Must Rank 1st – 20th in Class',
      desc: 'National examination preparation and competitive tournament balance.',
      badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    },
  ];

  const forbiddenItems = [
    {
      title: t('rules.forbidden_1'),
      desc: 'Addictive mobile gaming damages eyesight, concentration, and sleep cycles.',
    },
    {
      title: t('rules.forbidden_2'),
      desc: 'Commercial gaming parlors and arcade houses promote distraction and peer delinquency.',
    },
    {
      title: t('rules.forbidden_3'),
      desc: 'PlayStation and console addictions waste vital study and rest hours.',
    },
    {
      title: t('rules.forbidden_4'),
      desc: 'Commercial pool tables and foosball spots foster gambling environments.',
    },
    {
      title: t('rules.forbidden_5'),
      desc: 'Unsupervised street football risks severe injury and ruins structured athletic development.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" /> Official Academy Policy Document
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight">
          {t('rules.title')}
        </h1>
        <p className="text-slate-300 text-base sm:text-lg">
          {t('rules.subtitle')}
        </p>
      </div>

      {/* MOTTO BANNER CALLOUT */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 shadow-2xl text-center space-y-2">
        <span className="text-xs font-black uppercase tracking-widest text-slate-900/80">
          Core Commitment
        </span>
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
          &quot;A Better Dream for a Better Life&quot;
        </h2>
        <p className="text-sm font-semibold text-slate-900 max-w-2xl mx-auto">
          Every parent and player signs this agreement upon enrollment to ensure an elite, distraction-free environment.
        </p>
      </div>

      {/* SECTION 1: PARENTAL DISCLOSURE UPON JOINING */}
      <section className="p-8 sm:p-10 rounded-3xl bg-[#091224] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
            <FileText className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            {t('rules.enrollment_title')}
          </h2>
        </div>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          {t('rules.enrollment_desc')} Full transparency regarding past behavioral records, school performance, and any chronic medical conditions ensures our coaching staff can nurture each trainee safely and effectively.
        </p>
      </section>

      {/* SECTION 2: MANDATORY ACADEMIC STANDARDS BY AGE */}
      <section className="p-8 sm:p-10 rounded-3xl bg-[#091224] border border-slate-800 shadow-xl space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              {t('rules.academic_title')}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              {t('rules.academic_desc')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {academicTiers.map((tier, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${tier.badge}`}>
                  {tier.age}
                </span>
                <h4 className="text-white font-black text-lg">{tier.rank}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{tier.desc}</p>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Term report cards audited
              </div>
            </div>
          ))}
        </div>

        {/* Overall School Target */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 text-center text-sm font-bold text-emerald-300">
          🎯 {t('rules.academic_target')}
        </div>
      </section>

      {/* SECTION 3: STRICTLY FORBIDDEN ACTIVITIES */}
      <section className="p-8 sm:p-10 rounded-3xl bg-[#091224] border border-red-900/30 shadow-xl space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-red-500/10 text-red-400">
            <Ban className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              {t('rules.forbidden_title')}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              {t('rules.forbidden_desc')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {forbiddenItems.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/80 border border-red-500/20 space-y-2 hover:border-red-500/50 transition-colors"
            >
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{item.title}</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-xs text-red-300">
          ⚠️ {t('rules.consequences')}
        </div>
      </section>

      {/* Bottom Registration Link */}
      <div className="text-center pt-6">
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/25 transition-all hover:scale-105"
        >
          <Trophy className="w-4 h-4" />
          <span>I Agree & Wish to Register Trainee</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
