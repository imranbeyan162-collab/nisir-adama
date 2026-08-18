'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import {
  Phone,
  MapPin,
  Send,
  CheckCircle,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Building,
} from 'lucide-react';

export default function ContactPage() {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, message }),
      });
      if (res.ok) {
        setSubmitted(true);
        setName('');
        setPhone('');
        setMessage('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Phone className="w-4 h-4" /> Get in Touch
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight">
          {t('contact.title')}
        </h1>
        <p className="text-slate-300 text-base sm:text-lg">
          {t('contact.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Direct Contacts & TikTok */}
        <div className="lg:col-span-5 space-y-6">
          {/* Coach Phone Numbers */}
          <div className="p-6 rounded-3xl bg-[#091224] border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Head Coach Direct Line
                </span>
                <h3 className="text-xl font-bold text-white">Coach Fisha Welde Meskel</h3>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href="tel:+251911651214"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:border-amber-400 text-white font-mono font-bold text-sm sm:text-base transition-colors group"
              >
                <span>+251 911 651 214</span>
                <span className="text-xs text-amber-400 uppercase group-hover:translate-x-1 transition-transform">
                  Call Now →
                </span>
              </a>

              <a
                href="tel:+251908171773"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:border-amber-400 text-white font-mono font-bold text-sm sm:text-base transition-colors group"
              >
                <span>+251 908 171 773</span>
                <span className="text-xs text-amber-400 uppercase group-hover:translate-x-1 transition-transform">
                  Call Now →
                </span>
              </a>
            </div>
          </div>

          {/* TikTok Account Promotion Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#120D1E] via-[#1F1030] to-[#0A0515] border border-pink-500/30 space-y-4 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-pink-400 font-bold text-xs uppercase tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
                <span>TikTok Channel</span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-300">@nisiradama</span>
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">
                {t('contact.tiktok_title')}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
                {t('contact.tiktok_desc')}
              </p>
            </div>

            <a
              href="https://www.tiktok.com/@nisiradama"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:from-pink-500 hover:to-amber-400 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <span>{t('contact.tiktok_btn')}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Instagram Account Promotion Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1A0B1E] via-[#2A0F2E] to-[#120518] border border-purple-500/30 space-y-4 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-500 animate-pulse" />
                <span>Instagram Profile</span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-300">@nisiradamafc</span>
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">
                Follow Us on Instagram
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
                Daily match highlights, training reels, academy news, and youth tournament coverage.
              </p>
            </div>

            <a
              href="https://www.instagram.com/nisiradamafc"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-600 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <span>Follow @nisiradamafc</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Physical Addresses */}
          <div className="p-6 rounded-3xl bg-[#091224] border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-start gap-3">
              <Building className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-white font-bold text-sm">{t('contact.office_title')}</h4>
                <p className="text-slate-300 text-xs mt-0.5">{t('contact.office_desc')}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-3 border-t border-slate-800">
              <MapPin className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-white font-bold text-sm">{t('contact.stadium_title')}</h4>
                <p className="text-slate-300 text-xs mt-0.5">{t('contact.stadium_desc')}</p>
                <Link href="/location" className="text-amber-400 text-xs font-semibold hover:underline block mt-1">
                  View Map & Arrival Guide →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Direct Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="p-8 sm:p-10 rounded-3xl bg-[#091224] border border-slate-800 shadow-2xl space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Direct Message
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                {t('contact.send_message')}
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Have questions about age brackets, training schedules, or enrollment? Send Coach Fisha a note.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-in fade-in duration-300">
                <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-white font-bold text-lg">Thank You!</h4>
                <p className="text-slate-300 text-xs sm:text-sm">
                  Your message has been received. Coach Fisha or staff will respond shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-emerald-400 border border-emerald-500/30 text-xs font-bold"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    {t('contact.name_label')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ato Daniel / W/ro Tigist"
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700 focus:border-amber-400 focus:outline-none text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    {t('contact.phone_label')} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0912 345 678"
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700 focus:border-amber-400 focus:outline-none text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    {t('contact.msg_label')}
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Inquire about trainee registration, schedules, or kit details..."
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700 focus:border-amber-400 focus:outline-none text-white text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending...' : t('contact.submit_btn')}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
