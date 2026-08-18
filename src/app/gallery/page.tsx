'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n';
import {
  Play,
  Image as ImageIcon,
  Video,
  X,
  Maximize2,
  Calendar,
  Tag,
  Sparkles,
  Trophy,
} from 'lucide-react';

export default function GalleryPage() {
  const { t } = useLanguage();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PHOTO' | 'VIDEO' | 'MATCH' | 'TRAINING' | 'COVID'>('ALL');
  const [selectedMedia, setSelectedMedia] = useState<any | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/gallery?type=ALL');
      const data = await res.json();
      if (data?.items) {
        setItems(data.items);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'PHOTO') return item.mediaType === 'photo';
    if (activeFilter === 'VIDEO') return item.mediaType === 'video';
    if (activeFilter === 'MATCH') return item.category === 'Match';
    if (activeFilter === 'TRAINING') return item.category === 'Training';
    if (activeFilter === 'COVID') return item.category === 'COVID-Era';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" /> Academy Media Center
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight">
          {t('gallery.title')}
        </h1>
        <p className="text-slate-300 text-base sm:text-lg">
          {t('gallery.subtitle')}
        </p>
      </div>

      {/* Filter Tabs (Photos & Videos Presented Together Per Specification) */}
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {[
          { key: 'ALL', label: t('gallery.filter_all') },
          { key: 'PHOTO', label: t('gallery.filter_photos') },
          { key: 'VIDEO', label: t('gallery.filter_videos') },
          { key: 'MATCH', label: t('gallery.filter_matches') },
          { key: 'TRAINING', label: t('gallery.filter_training') },
          { key: 'COVID', label: t('gallery.filter_covid') },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key as any)}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
              activeFilter === f.key
                ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/25 scale-105'
                : 'bg-[#091224] text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-24 text-center text-slate-400 text-sm">
          Loading academy media archives...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-24 text-center text-slate-400 text-sm">
          {t('gallery.no_items')}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedMedia(item)}
              className="group cursor-pointer rounded-3xl bg-[#091224] border border-slate-800 hover:border-amber-400/50 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Media Thumbnail Container */}
              <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                <img
                  src={item.thumbnail || item.mediaUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Video Play Indicator */}
                {item.mediaType === 'video' ? (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                    <div className="w-14 h-14 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                  </div>
                ) : (
                  <div className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  <Tag className="w-3 h-3" />
                  <span>{item.category}</span>
                </div>
              </div>

              {/* Card Footer Info */}
              <div className="p-5 space-y-2">
                <h3 className="text-white font-bold text-base group-hover:text-amber-400 transition-colors line-clamp-1">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-850">
                  <span className="capitalize font-semibold text-slate-400 flex items-center gap-1">
                    {item.mediaType === 'video' ? <Video className="w-3.5 h-3.5 text-amber-400" /> : <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />}
                    {item.mediaType}
                  </span>
                  <span className="text-amber-400/90 font-bold group-hover:translate-x-0.5 transition-transform">
                    {item.mediaType === 'video' ? t('gallery.watch_video') : t('gallery.view_full')} →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIGHTBOX / FULLSCREEN MEDIA MODAL */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
          <div className="relative max-w-5xl w-full bg-[#0B1528] border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {selectedMedia.category} • {selectedMedia.mediaType}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  {selectedMedia.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMedia(null)}
                className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Media Body */}
            <div className="flex-1 bg-black flex items-center justify-center overflow-hidden">
              {selectedMedia.mediaType === 'video' ? (
                <video
                  src={selectedMedia.videoUrl || selectedMedia.mediaUrl}
                  controls
                  autoPlay
                  className="max-h-[65vh] w-full object-contain"
                />
              ) : (
                <img
                  src={selectedMedia.mediaUrl}
                  alt={selectedMedia.title}
                  className="max-h-[65vh] w-full object-contain"
                />
              )}
            </div>

            {/* Modal Description */}
            {selectedMedia.description && (
              <div className="p-4 sm:p-6 bg-slate-900/90 border-t border-slate-800 text-slate-300 text-sm">
                {selectedMedia.description}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
