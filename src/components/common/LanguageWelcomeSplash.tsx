'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage, Locale } from '@/lib/i18n';
import { Logo } from './Logo';
import { Play, Volume2, VolumeX, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

interface LanguageWelcomeSplashProps {
  forceOpen?: boolean;
  onComplete?: () => void;
}

export function LanguageWelcomeSplash({ forceOpen = false, onComplete }: LanguageWelcomeSplashProps) {
  const { locale, setLocale, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [stage, setStage] = useState<'SELECT_LANGUAGE' | 'PLAYING_VIDEO' | 'FINISHED'>('SELECT_LANGUAGE');
  const [selectedLang, setSelectedLang] = useState<Locale>('om');
  const [videoProgress, setVideoProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(15);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Check if first-time visitor
  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      setStage('SELECT_LANGUAGE');
      return;
    }

    const hasChosen = localStorage.getItem('nisir_welcome_completed');
    if (!hasChosen) {
      setIsOpen(true);
    }
  }, [forceOpen]);

  // Video sources per language (high quality, fast loading sports montage)
  const languageVideos: Record<Locale, { src: string; title: string; subtitle: string }> = {
    om: {
      src: 'https://assets.mixkit.co/videos/preview/mixkit-young-soccer-players-training-on-a-field-42417-large.mp4',
      title: 'Baga Gara Akaadaamii Kubbaa Miilaa Nisir Dhuftan!',
      subtitle: 'Adaamaa Istaadiyeemii Manafashaa — Abjuu Gaarii Jireenya Gaariif',
    },
    am: {
      src: 'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-kicking-a-ball-in-a-stadium-41121-large.mp4',
      title: 'እንኳን ወደ ንስር እግር ኳስ አካዳሚ በደህና መጡ!',
      subtitle: 'መናፈሻ ሜዳ፣ አዳማ — የተሻለ ህልም ለተሻለ ህይወት',
    },
    en: {
      src: 'https://assets.mixkit.co/videos/preview/mixkit-coach-talking-with-a-group-of-young-soccer-players-42416-large.mp4',
      title: 'Welcome to Nisir Football Academy Adama!',
      subtitle: 'Manafesha Meda, Adama — A Better Dream for a Better Life',
    },
  };

  const handleSelectLanguage = (lang: Locale) => {
    setSelectedLang(lang);
    setLocale(lang);
    setStage('PLAYING_VIDEO');
    setTimeRemaining(15);
  };

  // Video playback timer & progress
  useEffect(() => {
    if (stage !== 'PLAYING_VIDEO') return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          finishWelcome();
          return 0;
        }
        return prev - 1;
      });
      setVideoProgress((prev) => Math.min(prev + 100 / 15, 100));
    }, 1000);

    return () => clearInterval(interval);
  }, [stage]);

  const finishWelcome = () => {
    localStorage.setItem('nisir_welcome_completed', 'true');
    setStage('FINISHED');
    setTimeout(() => {
      setIsOpen(false);
      if (onComplete) onComplete();
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050A14] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {stage === 'SELECT_LANGUAGE' && (
        <div className="relative z-10 max-w-xl w-full mx-4 p-6 sm:p-10 bg-[#0B1528]/95 border border-slate-700/60 rounded-3xl shadow-2xl backdrop-blur-2xl text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="flex justify-center mb-6">
            <Logo size="xl" showSubtitle={false} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wide mb-2">
            NISIR FOOTBALL ACADEMY
          </h1>
          <p className="text-amber-400 font-semibold text-sm sm:text-base mb-6 tracking-wide">
            &quot;A Better Dream for a Better Life&quot; • Adama, Ethiopia
          </p>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-6" />

          <p className="text-slate-300 text-sm sm:text-base font-medium mb-6">
            Please choose your preferred language to begin / Afaan filadhaa / ቋንቋ ይምረጡ:
          </p>

          <div className="grid grid-cols-1 gap-3.5 sm:gap-4 mb-8">
            {/* Afaan Oromoo Button */}
            <button
              onClick={() => handleSelectLanguage('om')}
              className="group flex items-center justify-between p-4 rounded-2xl bg-slate-900/90 hover:bg-gradient-to-r hover:from-amber-600/30 hover:to-amber-500/20 border border-slate-700/80 hover:border-amber-500/60 transition-all duration-300 shadow-md text-left"
            >
              <div className="flex items-center gap-3.5">
                <span className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center border border-amber-500/30 text-sm">
                  AO
                </span>
                <div>
                  <div className="text-white font-bold text-base group-hover:text-amber-300 transition-colors">
                    Afaan Oromoo
                  </div>
                  <div className="text-slate-400 text-xs">Oromiyaa • Adaamaa</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </button>

            {/* Amharic Button */}
            <button
              onClick={() => handleSelectLanguage('am')}
              className="group flex items-center justify-between p-4 rounded-2xl bg-slate-900/90 hover:bg-gradient-to-r hover:from-emerald-600/30 hover:to-emerald-500/20 border border-slate-700/80 hover:border-emerald-500/60 transition-all duration-300 shadow-md text-left"
            >
              <div className="flex items-center gap-3.5">
                <span className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center border border-emerald-500/30 text-sm">
                  አማ
                </span>
                <div>
                  <div className="text-white font-bold text-base group-hover:text-emerald-300 transition-colors">
                    አማርኛ (Amharic)
                  </div>
                  <div className="text-slate-400 text-xs">ኢትዮጵያ • አዳማ</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </button>

            {/* English Button */}
            <button
              onClick={() => handleSelectLanguage('en')}
              className="group flex items-center justify-between p-4 rounded-2xl bg-slate-900/90 hover:bg-gradient-to-r hover:from-blue-600/30 hover:to-blue-500/20 border border-slate-700/80 hover:border-blue-500/60 transition-all duration-300 shadow-md text-left"
            >
              <div className="flex items-center gap-3.5">
                <span className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center border border-blue-500/30 text-sm">
                  EN
                </span>
                <div>
                  <div className="text-white font-bold text-base group-hover:text-blue-300 transition-colors">
                    English
                  </div>
                  <div className="text-slate-400 text-xs">International • Academy Profile</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Academy welcome video plays automatically upon language selection.</span>
          </div>
        </div>
      )}

      {stage === 'PLAYING_VIDEO' && (
        <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-10 animate-in fade-in duration-700">
          {/* Background Video */}
          <video
            ref={videoRef}
            src={languageVideos[selectedLang].src}
            autoPlay
            playsInline
            muted={isMuted}
            onEnded={finishWelcome}
            className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-[0.75] contrast-[1.05]"
          />

          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70 z-[1]" />

          {/* Top Bar with Badge & Audio Toggle */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <Logo size="sm" showSubtitle={false} />
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                {languageVideos[selectedLang].title}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md transition-all shadow-lg"
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-slate-300" /> : <Volume2 className="w-5 h-5 text-amber-400" />}
              </button>
            </div>
          </div>

          {/* Center Title & Info */}
          <div className="relative z-10 max-w-3xl mx-auto text-center my-auto px-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-sm">
              <Play className="w-3.5 h-3.5 fill-current" /> Official Welcome Video
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight drop-shadow-lg mb-3">
              {languageVideos[selectedLang].title}
            </h2>
            <p className="text-slate-200 text-base sm:text-xl font-medium drop-shadow-md">
              {languageVideos[selectedLang].subtitle}
            </p>
          </div>

          {/* Bottom Progress Bar & Countdown (Per Specification: no skip button, plays smoothly) */}
          <div className="relative z-10 max-w-xl w-full mx-auto bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Loading Official Experience...
              </span>
              <span>{timeRemaining}s remaining</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-500 transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${videoProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
