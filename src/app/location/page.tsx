'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import {
  MapPin,
  Navigation,
  Car,
  Users,
  Phone,
  ArrowRight,
  ExternalLink,
  Building,
  Compass,
} from 'lucide-react';

export default function LocationPage() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings) {
          setSettings(data.settings);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const coordinates = settings.coordinates || `8°33'56.9"N 39°15'56.2"E`;
  const latitude = settings.latitude || '8.565806';
  const longitude = settings.longitude || '39.265611';

  const mapEmbedUrl =
    settings.map_embed_url ||
    `https://maps.google.com/maps?q=${latitude},${longitude}&hl=en&z=17&output=embed`;

  const directMapsUrl =
    settings.google_maps_direct_url ||
    `https://www.google.com/maps?q=${latitude},${longitude}`;

  const trainingGround = settings.training_ground || 'Chapi Meda / Chapi Stadium, Adama';
  const officeAddress = settings.office_address || 'Franco Batu Tower, 2nd Floor, Adama, Ethiopia';
  const directions1 = settings.location_directions_1 || `Located at Chapi Meda / Chapi Stadium in Adama at GPS Coordinates: ${coordinates}.`;
  const directions2 = settings.location_directions_2 || t('location.dir_2');
  const directions3 = settings.location_directions_3 || t('location.dir_3');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <MapPin className="w-4 h-4" /> Training Grounds & Location
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight">
          {t('location.title')}
        </h1>
        <p className="text-slate-300 text-base sm:text-lg">
          {t('location.subtitle')}
        </p>
      </div>

      {/* 1. EXACT PIN INTERACTIVE GOOGLE MAP */}
      <section className="rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-[#091224] p-4 space-y-4">
        <div className="aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden bg-slate-950 relative">
          <iframe
            title="Nisir Academy Chapi Stadium Map"
            src={mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          {/* Floating Location Pill */}
          <div className="absolute top-4 left-4 p-4 rounded-2xl bg-[#070D1B]/95 backdrop-blur-md border border-slate-700/80 text-xs shadow-2xl space-y-1.5 max-w-xs sm:max-w-sm">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>GPS PINNED LOCATION</span>
            </div>
            <h3 className="font-extrabold text-white text-sm">
              {trainingGround}
            </h3>
            <div className="text-amber-300 font-mono text-xs font-bold bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-800">
              📍 {coordinates}
            </div>
            <a
              href={directMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-emerald-400 font-bold hover:underline pt-1 text-xs"
            >
              <span>Open in Google Maps / Navigation</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* 2. GPS COORDINATES & DIRECTIONS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-[#091224] border border-slate-800 space-y-3 shadow-xl">
          <div className="p-3 w-fit rounded-2xl bg-amber-500/10 text-amber-400">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Exact Coordinates</h3>
          <p className="text-amber-300 font-mono text-sm font-bold">
            {coordinates}
          </p>
          <p className="text-slate-400 text-xs">
            Decimal: {latitude}, {longitude} (Adama, Oromia)
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#091224] border border-slate-800 space-y-3 shadow-xl">
          <div className="p-3 w-fit rounded-2xl bg-blue-500/10 text-blue-400">
            <Car className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Transport & Access</h3>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {directions2}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#091224] border border-slate-800 space-y-3 shadow-xl">
          <div className="p-3 w-fit rounded-2xl bg-emerald-500/10 text-emerald-400">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Parent Viewing Stands</h3>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {directions3}
          </p>
        </div>
      </div>

      {/* 3. PHYSICAL OFFICE & TRAINING GROUND SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-3xl bg-[#091224] border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Pitch Location</span>
              <h4 className="text-white font-black text-lg">{trainingGround}</h4>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
            <div className="text-slate-300">
              <strong>GPS:</strong> <span className="font-mono text-amber-400">{coordinates}</span>
            </div>
            <div className="text-slate-400">
              Adama, Ethiopia • Chapi Meda Sports Complex
            </div>
          </div>
          <a
            href={directMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:underline"
          >
            <span>Navigate on Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="p-8 rounded-3xl bg-[#091224] border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Office Location</span>
              <h4 className="text-white font-black text-lg">Franco Batu Tower</h4>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
            <div className="text-slate-300">
              <strong>Address:</strong> {officeAddress}
            </div>
            <div className="text-slate-400">
              Open for in-person parent consultations and enrollment.
            </div>
          </div>
          <a
            href="tel:+251911651214"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:underline"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Office: +251 911 651 214</span>
          </a>
        </div>
      </div>

      {/* Action Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-500/20 via-[#0B1A2F] to-slate-900 border border-amber-400/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-1 text-center md:text-left">
          <h4 className="text-white font-black text-xl">Need Directions or Arrival Guidance?</h4>
          <p className="text-slate-300 text-xs sm:text-sm">
            Coordinates: <span className="font-mono text-amber-300 font-bold">{coordinates}</span> • Call Coach: +251 911 651 214
          </p>
        </div>

        <div className="flex gap-3">
          <a
            href={directMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Navigation className="w-4 h-4" />
            <span>Start Navigation</span>
          </a>

          <Link
            href="/register"
            className="px-6 py-3 rounded-2xl bg-amber-400 text-slate-950 text-xs font-black uppercase hover:bg-amber-300 transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <span>Register Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
