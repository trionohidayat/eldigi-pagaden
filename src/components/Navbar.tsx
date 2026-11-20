'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useVote } from '@/context/VoteContext';
import {
  Vote,
  Users,
  BarChart3,
  BookOpen,
  ArrowLeft,
  QrCode,
  Menu,
  X,
  Volume2,
  VolumeX
} from 'lucide-react';
import { CrestSubang } from './CrestSubang';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { totalVotes, isVoiceEnabled, toggleVoice } = useVote();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hide Navbar completely on voting ballot and print screens to keep them 100% minimalist
  if (pathname === '/' || pathname === '/bilik' || pathname === '/cetak-qr') {
    return null;
  }

  const navLinks = [
    { href: '/bilik', label: 'Surat Suara (Bilik)', shortLabel: 'Bilik', icon: Vote, highlight: true },
    { href: '/kpps', label: 'Meja KPPS', shortLabel: 'KPPS', icon: Users },
    { href: '/cetak-qr', label: 'Cetak Kartu QR', shortLabel: 'Cetak QR', icon: QrCode },
    { href: '/rekapitulasi', label: 'Rekapitulasi', shortLabel: 'Rekap', icon: BarChart3, badge: totalVotes },
    { href: '/panduan', label: 'Panduan', shortLabel: 'Panduan', icon: BookOpen }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs print:hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Back to Ballot Link */}
          <Link
            href="/bilik"
            className="flex items-center gap-2 text-slate-700 hover:text-black font-bold text-xs sm:text-sm group flex-shrink-0"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 group-hover:bg-red-50 group-hover:text-red-600 flex items-center justify-center transition">
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <CrestSubang size={22} className="flex-shrink-0" />
            <span className="hidden sm:inline">Kembali ke Surat Suara</span>
            <span className="sm:hidden font-bold">Bilik Suara</span>
          </Link>

          {/* Desktop Navigation Links (md and up) */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : link.highlight
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  {typeof link.badge === 'number' && link.badge > 0 && (
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            {/* Google Voice Toggle */}
            <button
              type="button"
              onClick={toggleVoice}
              title={isVoiceEnabled ? 'Matikan Panduan Suara Google Voice' : 'Aktifkan Panduan Suara Google Voice'}
              className={`p-2 rounded-lg border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ml-1 ${
                isVoiceEnabled
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {isVoiceEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <span className="text-[11px]">Suara: On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" />
                  <span className="text-[11px]">Suara: Off</span>
                </>
              )}
            </button>
          </nav>

          {/* Mobile Menu Button (below md) */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              type="button"
              onClick={toggleVoice}
              title="Toggle Suara"
              className={`p-2 rounded-xl border text-xs font-bold transition flex items-center cursor-pointer ${
                isVoiceEnabled
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}
            >
              {isVoiceEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 transition flex items-center gap-1.5"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <>
                  <Menu className="w-5 h-5" />
                  {typeof totalVotes === 'number' && totalVotes > 0 && (
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {totalVotes}
                    </span>
                  )}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Quick-Nav Scrollbar (always visible on small screens for 1-tap switching) */}
        <div className="flex md:hidden items-center gap-1.5 overflow-x-auto no-scrollbar py-2 border-t border-slate-100">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition flex-shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : link.highlight
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.shortLabel || link.label}</span>
                {typeof link.badge === 'number' && link.badge > 0 && (
                  <span className="bg-amber-500 text-white text-[9px] font-bold px-1.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-1.5">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : link.highlight
                      ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                  {typeof link.badge === 'number' && link.badge > 0 && (
                    <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {link.badge} suara
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
