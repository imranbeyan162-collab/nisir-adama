'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import {
  UserCheck,
  Phone,
  Play,
  Award,
  Shield,
  Quote,
  CheckCircle,
  Calendar,
  Sparkles,
} from 'lucide-react';

export default function CoachPage() {
  const { t } = useLanguage();
  const [coachMedia, setCoachMedia] = useState<any>(null);
  const [coachVideo, setCoachVideo] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/media?page=coach')
      .then((res) => res.json())
      .then((data) => {
        if (data?.items) {
          data.items.forEach((item: any) => {
            if (item.sectionKey === 'coach_profile_main') setCoachMedia(item);
            if (item.sectionKey === 'coach_interview_video') setCoachVideo(item);
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <UserCheck className="w-4 h-4" /> Academy Leadership
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight">
          {t('coach.title')}
        </h1>
        <p className="text-slate-300 text-base sm:text-lg">
          {t('coach.subtitle')}
        </p>
      </div>

      {/* 1. COACH FISHA BIOGRAPHY & PROFILE CARD */}
      <section className="p-8 sm:p-12 rounded-3xl bg-[#091224] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-slate-700 shadow-2xl relative group bg-slate-950">
              <img
                src={
                  coachMedia?.mediaUrl ||
                  '/images/coach-fisha.jpg'
                }
                alt="Coach Fisha Welde Meskel"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-6">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  Head Coach & Founder
                </span>
                <h3 className="text-2xl font-black text-white">
                  Fisha Welde Meskel
                </h3>
                <span className="text-xs text-slate-300">
                  Adama, Ethiopia • Manafesha Meda
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Founder & Technical Director
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
                Fisha Welde Meskel
              </h2>
            </div>

            <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>{t('coach.bio_p1')}</p>
              <p>{t('coach.bio_p2')}</p>
            </div>

            {/* Direct Contact Numbers */}
            <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="tel:+251911651214"
                className="p-4 rounded-2xl bg-slate-900 border border-slate-700 hover:border-amber-400/60 transition-colors group flex items-center gap-3"
              >
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Coach Line 1</div>
                  <div className="text-white font-black text-sm group-hover:text-amber-400 transition-colors font-mono">
                    +251 911 651 214
                  </div>
                </div>
              </a>

              <a
                href="tel:+251908171773"
                className="p-4 rounded-2xl bg-slate-900 border border-slate-700 hover:border-amber-400/60 transition-colors group flex items-center gap-3"
              >
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Coach Line 2</div>
                  <div className="text-white font-black text-sm group-hover:text-amber-400 transition-colors font-mono">
                    +251 908 171 773
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PHILOSOPHY & VIDEO EMBED */}
      <section className="p-8 sm:p-12 rounded-3xl bg-[#091224] border border-slate-800 shadow-2xl space-y-8">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Philosophy in Action
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            {t('coach.video_title')}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t('coach.video_desc')}
          </p>
        </div>

        {/* Video Player */}
        <div className="aspect-[16/9] max-w-4xl mx-auto rounded-3xl overflow-hidden border border-slate-700 shadow-2xl bg-black relative">
          <video
            controls
            playsInline
            poster={
              coachVideo?.thumbnail ||
              'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=1000&auto=format&fit=crop'
            }
            className="w-full h-full object-cover"
            src={
              coachVideo?.mediaUrl ||
              'https://assets.mixkit.co/videos/preview/mixkit-young-soccer-players-training-on-a-field-42417-large.mp4'
            }
          />
        </div>

        {/* Quote Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-700/80 max-w-4xl mx-auto relative flex items-start gap-4">
          <Quote className="w-10 h-10 text-amber-400 flex-shrink-0 opacity-80" />
          <div className="space-y-2">
            <h4 className="text-white font-extrabold text-base sm:text-lg italic">
              &quot;{t('coach.philosophy_quote')}&quot;
            </h4>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              — Coach Fisha Welde Meskel
            </span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/25 transition-all hover:scale-105"
        >
          <span>Register Trainee with Coach Fisha</span>
        </Link>
      </div>
    </div>
  );
}
