'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export function Logo({ size = 'md', showSubtitle = true }: LogoProps) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-13 h-13',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const textClasses = {
    sm: 'text-base font-bold',
    md: 'text-xl font-extrabold',
    lg: 'text-2xl font-black',
    xl: 'text-3xl font-black',
  };

  return (
    <Link href="/" className="flex items-center gap-3 group focus:outline-none">
      {/* Official Circular Nisir Eagle Emblem */}
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-[2px] shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300 flex-shrink-0 relative`}
      >
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border border-amber-300/60 shadow-inner">
          <img
            src="/nisir-logo.png"
            alt="Nisir Adama Football Academy Official Emblem"
            className="w-full h-full object-contain p-0.5"
          />
        </div>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`${textClasses[size]} tracking-tight text-white group-hover:text-amber-400 transition-colors uppercase font-black`}
          >
            NISIR
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 tracking-wider uppercase">
            ADAMA S.A
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[11px] font-semibold text-slate-300 tracking-wide uppercase">
            Football Academy • Adama
          </span>
        )}
      </div>
    </Link>
  );
}
