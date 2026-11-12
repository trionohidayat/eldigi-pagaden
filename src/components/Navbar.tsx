'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useVote } from '@/context/VoteContext';
import {
  Vote,
  Users,
  BarChart3,
  BookOpen,
  ArrowLeft,
  ShieldCheck,
  QrCode
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { totalVotes } = useVote();

  // Hide Navbar completely on voting ballot and print screens to keep them 100% minimalist
  if (pathname === '/' || pathname === '/bilik' || pathname === '/cetak-qr') {
    return null;
  }

  const navLinks = [
    { href: '/bilik', label: 'Surat Suara (Bilik)', icon: Vote, highlight: true },
    { href: '/kpps', label: 'Meja KPPS', icon: Users },
    { href: '/cetak-qr', label: 'Cetak Kartu QR', icon: QrCode },
    { href: '/rekapitulasi', label: 'Rekapitulasi', icon: BarChart3, badge: totalVotes },
    { href: '/panduan', label: 'Panduan', icon: BookOpen }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Back to Ballot Link */}
          <Link
            href="/bilik"
            className="flex items-center gap-2 text-slate-700 hover:text-black font-bold text-sm group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-red-50 group-hover:text-red-600 flex items-center justify-center transition">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span>Kembali ke Surat Suara</span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
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
          </nav>
        </div>
      </div>
    </header>
  );
};
