'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useVote } from '@/context/VoteContext';
import {
  Menu,
  X,
  Users,
  BarChart3,
  BookOpen,
  RotateCcw,
  Globe,
  Vote,
  ShieldCheck,
  CheckCircle2,
  Printer
} from 'lucide-react';

export const KioskDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const {
    language,
    toggleLanguage,
    resetAllData,
    totalVotes,
    tpsConfig
  } = useVote();

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = resetAllData(pin);
    if (success) {
      setResetSuccess(true);
      setPin('');
      setPinError(false);
      setTimeout(() => {
        setResetSuccess(false);
        setShowResetModal(false);
      }, 1200);
    } else {
      setPinError(true);
    }
  };

  return (
    <>
      {/* Subtle floating admin icon in the top-right corner */}
      <div className="absolute top-3 right-3 z-30 print:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          title="Menu Petugas KPPS & Pengaturan"
          className="p-2 rounded-full bg-white/70 hover:bg-white text-slate-500 hover:text-black border border-slate-300/60 shadow-sm opacity-40 hover:opacity-100 transition-all active:scale-95"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Slide-over Drawer for KPPS & Panitia */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
          <div className="w-80 sm:w-96 bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h3 className="font-black text-slate-900 text-base">Menu Panitia &amp; TPS</h3>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {tpsConfig.tpsNumber} • {tpsConfig.desa}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Menu */}
              <div className="mt-5 space-y-2">
                <Link
                  href="/bilik"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl bg-red-50 text-red-900 font-bold text-sm border border-red-200 hover:bg-red-100 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Vote className="w-4 h-4 text-red-600" />
                    <span>Layar Surat Suara (Bilik)</span>
                  </div>
                  <span className="text-[10px] bg-red-200 text-red-800 px-2 py-0.5 rounded-full font-bold">
                    Aktif
                  </span>
                </Link>

                <Link
                  href="/kpps"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold text-sm transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span>Meja KPPS (Verifikasi DPT)</span>
                  </div>
                </Link>

                <Link
                  href="/rekapitulasi"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold text-sm transition"
                >
                  <div className="flex items-center gap-2.5">
                    <BarChart3 className="w-4 h-4 text-slate-500" />
                    <span>Rekapitulasi &amp; Quick Count</span>
                  </div>
                  {totalVotes > 0 && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                      {totalVotes} Suara
                    </span>
                  )}
                </Link>

                <Link
                  href="/panduan"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold text-sm transition"
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-slate-500" />
                    <span>Panduan Tata Cara Memilih</span>
                  </div>
                </Link>

                <Link
                  href="/cetak-qr"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold text-sm transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Printer className="w-4 h-4 text-emerald-600" />
                    <span>Cetak Kartu QR Pemilih</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    Siap Cetak
                  </span>
                </Link>
              </div>

              {/* Settings Group */}
              <div className="mt-6 pt-5 border-t border-slate-200 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Pengaturan Kiosk
                </span>

                {/* Language Switch */}
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-sm font-semibold text-slate-700 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-slate-500" />
                    <span>Bahasa Sistem</span>
                  </div>
                  <span className="text-xs font-mono font-bold bg-slate-100 px-2.5 py-1 rounded-md text-slate-800">
                    {language === 'su' ? 'Basa Sunda' : 'Indonesia'}
                  </span>
                </button>
              </div>
            </div>

            {/* Bottom Actions: Reset Panitia */}
            <div className="pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setShowResetModal(true);
                }}
                className="w-full py-2.5 px-3 rounded-xl border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Data Suara (Panitia)</span>
              </button>
              <p className="text-[10px] text-slate-400 text-center mt-2">
                ElDigi Pagaden • TPS Digital Desa Pagaden
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PIN Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 text-rose-600">
                <RotateCcw className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 text-base">Reset Data Suara</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowResetModal(false);
                  setPinError(false);
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Digunakan panitia desa untuk mengosongkan kembali data suara sebelum sesi berikutnya.
            </p>

            {resetSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>Data simulasi berhasil dikosongkan!</span>
              </div>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Masukkan PIN Panitia:
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={e => {
                      setPin(e.target.value);
                      setPinError(false);
                    }}
                    placeholder="PIN: 1234"
                    className="w-full text-center tracking-widest text-lg font-mono px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                    autoFocus
                  />
                </div>

                {pinError && (
                  <p className="text-xs text-rose-600 text-center font-semibold">
                    PIN salah! Gunakan PIN default 1234.
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowResetModal(false);
                      setPinError(false);
                    }}
                    className="flex-1 py-2 px-3 border border-slate-300 rounded-xl text-slate-700 font-semibold text-xs hover:bg-slate-100 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold text-xs shadow transition"
                  >
                    Kosongkan Data
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
