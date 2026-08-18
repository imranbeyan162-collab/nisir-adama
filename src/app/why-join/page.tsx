'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import {
  Trophy,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Play,
  ArrowRight,
  CheckCircle,
  Quote,
  Star,
} from 'lucide-react';

export default function WhyJoinPage() {
  const { t } = useLanguage();
  const [testimonial1, setTestimonial1] = useState<any>(null);
  const [testimonial2, setTestimonial2] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/media?page=why_join')
      .then((res) => res.json())
      .then((data) => {
        if (data?.items) {
          data.items.forEach((item: any) => {
            if (item.sectionKey === 'why_join_testimonial_1') setTestimonial1(item);
            if (item.sectionKey === 'why_join_testimonial_2') setTestimonial2(item);
          });
        }
      })
      .catch(() => {});
  }, []);

  const pillars = [
    {
      title: t('why_join.pillar1_title'),
      desc: t('why_join.pillar1_desc'),
      icon: Trophy,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      border: 'border-amber-500/30',
    },
    {
      title: t('why_join.pillar2_title'),
      desc: t('why_join.pillar2_desc'),
      icon: GraduationCap,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      border: 'border-blue-500/30',
    },
    {
      title: t('why_join.pillar3_title'),
      desc: t('why_join.pillar3_desc'),
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      border: 'border-emerald-500/30',
    },
    {
      title: t('why_join.pillar4_title'),
      desc: t('why_join.pillar4_desc'),
      icon: Sparkles,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
      border: 'border-purple-500/30',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Page Heading */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Trophy className="w-4 h-4" /> Proven Pathway to Excellence
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight">
          {t('why_join.title')}
        </h1>
        <p className="text-slate-300 text-base sm:text-lg">
          {t('why_join.subtitle')}
        </p>
      </div>

      {/* 1. CORE PILLARS OF WHY CHOOSE NISIR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {pillars.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className={`p-8 rounded-3xl bg-[#091224] border ${p.border} space-y-4 shadow-xl hover:translate-y-[-2px] transition-transform`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3.5 rounded-2xl ${p.bg} ${p.color}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white">{p.title}</h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{p.desc}</p>
            </div>
          );
        })}
      </div>

      {/* 2. STUDENT & PARENT VIDEO TESTIMONIALS (Balancing School & Football) */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Real Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            {t('why_join.testimonials_title')}
          </h2>
          <p className="text-slate-400 text-sm">
            {t('why_join.testimonials_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Student Video Testimonial */}
          <div className="rounded-3xl bg-[#091224] border border-slate-800 p-6 space-y-4 shadow-2xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-bold text-emerald-400 uppercase px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                  U15 Captain • Rank 2nd in Class
                </span>
              </div>
              <h4 className="text-white font-bold text-lg">
                {testimonial1?.title || 'Amanuel — Balancing Terminal Exams & Football'}
              </h4>
              <p className="text-slate-300 text-sm italic">
                &quot;Before joining Nisir, I was wasting 4 hours every evening on phone games. Coach Fisha taught us that our real match begins in the classroom. Today I maintain a 92% average while captaining our youth squad at Chapi Stadium.&quot;
              </p>
            </div>

            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-black border border-slate-700 relative mt-4">
              <video
                controls
                playsInline
                poster={
                  testimonial1?.thumbnail ||
                  'https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=800&auto=format&fit=crop'
                }
                className="w-full h-full object-cover"
                src={
                  testimonial1?.mediaUrl ||
                  'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-kicking-a-ball-in-a-stadium-41121-large.mp4'
                }
              />
            </div>
          </div>

          {/* Parent Testimonial */}
          <div className="rounded-3xl bg-[#091224] border border-slate-800 p-6 space-y-4 shadow-2xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-bold text-blue-400 uppercase px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20">
                  Parent Perspective
                </span>
              </div>
              <h4 className="text-white font-bold text-lg">
                {testimonial2?.title || 'W/ro Selamawit — Life Transformation in Discipline'}
              </h4>
              <p className="text-slate-300 text-sm italic">
                &quot;Nisir Academy solved the biggest battle parents face today: addiction to mobile screens and gaming parlors. The strict rule forbidding PlayStation and gaming centers gave my son his focus back. He wakes up excited for training and finishes all homework on time.&quot;
              </p>
            </div>

            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950 border border-slate-700 relative mt-4">
              <img
                src={
                  testimonial2?.mediaUrl ||
                  'https://images.unsplash.com/photo-1543807535-eceef0bc6599?q=80&w=800&auto=format&fit=crop'
                }
                alt="Parent Testimonial"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                <span className="text-xs text-amber-300 font-semibold">
                  Parent of 2 Trainees (U10 & U13 Squads)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STRONG CALL-TO-ACTION TO REGISTER */}
      <section className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 text-center space-y-6 shadow-2xl">
        <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
          Ready to Build Your Child&apos;s Future?
        </h2>
        <p className="max-w-2xl mx-auto font-bold text-sm sm:text-base text-slate-900 leading-relaxed">
          Enroll in Nisir Football Academy today. Secure online multi-child registration with bank/telebirr verification.
        </p>
        <div>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-black text-sm uppercase tracking-wider shadow-2xl hover:scale-105 transition-all"
          >
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Proceed to Registration Form</span>
            <ArrowRight className="w-5 h-5 text-amber-400" />
          </Link>
        </div>
      </section>
    </div>
  );
}
