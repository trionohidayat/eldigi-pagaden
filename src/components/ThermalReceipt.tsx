'use client';

import React, { useEffect, useState } from 'react';
import { LastVoteInfo } from '@/context/VoteContext';
import { CrestSubang } from './CrestSubang';
import confetti from 'canvas-confetti';
import { Printer, ArrowRight } from 'lucide-react';

interface ThermalReceiptProps {
  lastVote: LastVoteInfo;
  onFinish: () => void;
  language?: 'id' | 'su';
  autoResetSeconds?: number;
}

export const ThermalReceipt: React.FC<ThermalReceiptProps> = ({
  lastVote,
  onFinish,
  autoResetSeconds = 7
}) => {
  const [countdown, setCountdown] = useState(autoResetSeconds);
  const [isPrinted, setIsPrinted] = useState(false);

  useEffect(() => {
    // Subtle celebratory confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 }
      });
    } catch {}

    const timer = setTimeout(() => {
      setIsPrinted(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Countdown timer to automatically reset to QR scan gate
  useEffect(() => {
    if (countdown <= 0) {
      onFinish();
      return;
    }
    const interval = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown, onFinish]);

  const handleManualPrint = () => {
    window.print();
  };

  const displayNumber = parseInt(lastVote.candidateNumber, 10) || lastVote.candidateNumber;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between items-center py-6 px-4 select-none overflow-y-auto"
      style={{
        background: 'linear-gradient(180deg, #cbe8d6 0%, #e0f2e7 22%, #f5faf7 48%, #ffffff 75%)'
      }}
    >
      {/* Top Header */}
      <div className="flex flex-col items-center text-center mt-2 print:hidden">
        <CrestSubang size={52} className="drop-shadow-xs mb-2" />
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wider text-black font-sans uppercase">
          STRUK BUKTI SUARA DIGITAL (VVPAT)
        </h1>
        <p className="text-xs sm:text-sm font-semibold tracking-widest text-black font-sans uppercase mt-0.5">
          PEMILIHAN KEPALA DESA PAGADEN • {lastVote.tps}
        </p>

        {/* Printing status pill */}
        <div className="mt-3 inline-flex items-center gap-2 bg-white/90 border border-emerald-400 text-emerald-950 px-4 py-1.5 rounded-full text-xs font-bold shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            {isPrinted
              ? 'Struk Fisik Berhasil Dicetak'
              : 'Sedang Mencetak Struk Suara (VVPAT)...'}
          </span>
        </div>
      </div>

      {/* Minimalist Virtual Thermal Paper Receipt */}
      <div className="my-auto w-full max-w-sm flex flex-col items-center">
        {/* Sleek Minimalist Printer Output Slot */}
        <div className="w-72 sm:w-80 h-3 bg-black rounded-t-md shadow-md border-b border-slate-700 print:hidden" />

        {/* Crisp White Thermal Paper */}
        <div
          id="vvpat-receipt"
          className="w-72 sm:w-80 bg-white border-2 border-black p-5 text-black font-mono text-xs shadow-xl select-none relative animate-in slide-in-from-top-6 duration-700"
          style={{
            touchAction: 'manipulation'
          }}
        >
          {/* Receipt Header */}
          <div className="text-center pb-3 border-b-2 border-dashed border-black">
            <h4 className="font-extrabold text-xs uppercase tracking-wider">
              PEMERINTAH KABUPATEN SUBANG
            </h4>
            <div className="font-black text-xs uppercase">
              PILKADES DESA PAGADEN
            </div>
            <div className="text-[10px] text-slate-700 font-bold uppercase mt-0.5">
              BUKTI PEMUNGUTAN SUARA DIGITAL (VVPAT)
            </div>
          </div>

          {/* Metadata Section */}
          <div className="py-2.5 border-b border-dashed border-black space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-600">TPS:</span>
              <span className="font-bold">{lastVote.tps}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Waktu:</span>
              <span className="font-semibold">{lastVote.timestamp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">No. Bukti:</span>
              <span className="font-mono font-bold text-black">{lastVote.receiptCode}</span>
            </div>
          </div>

          {/* Chosen Candidate Minimalist Box */}
          <div className="my-3 p-3 bg-slate-50 border-2 border-black text-center">
            <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
              PILIHAN KEPALA DESA:
            </div>
            <div className="text-2xl sm:text-3xl font-black text-black my-1 font-sans">
              NOMOR {displayNumber}
            </div>
            <div className="text-xs sm:text-sm font-bold text-black uppercase border-t border-black/20 pt-1 font-sans">
              {lastVote.candidateName}
              {lastVote.candidateTitle ? `, ${lastVote.candidateTitle}` : ''}
            </div>
          </div>

          {/* Barcode representation */}
          <div className="pt-2 border-t border-dashed border-black flex flex-col items-center text-center">
            <div className="w-full flex justify-center items-center h-6 gap-0.5 my-1">
              {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2, 1, 4, 2, 1, 3].map((w, idx) => (
                <div
                  key={idx}
                  className="bg-black h-full"
                  style={{ width: `${w * 1.5}px` }}
                />
              ))}
            </div>
            <div className="text-[9px] font-mono text-slate-600 tracking-wider">
              HASH: {lastVote.receiptCode}
            </div>
            <p className="text-[9px] text-slate-600 italic mt-2 leading-tight">
              &quot;Struk fisik ini adalah bukti sah pilihan Anda. Masukkan ke dalam kotak suara fisik.&quot;
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Action & Countdown Bar */}
      <div className="w-full max-w-sm flex flex-col items-center gap-2 mb-2 print:hidden">
        <p className="text-xs text-slate-600 text-center">
          Silakan ambil struk kertas, lalu masukkan ke kotak suara fisik.
        </p>

        <div className="w-full flex gap-2">
          {/* Optional manual print */}
          <button
            type="button"
            onClick={handleManualPrint}
            className="flex-1 py-2.5 px-3 border border-slate-400 bg-white hover:bg-slate-100 text-black text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-700" />
            <span>Cetak Fisik</span>
          </button>

          {/* Selesai / Pemilih Berikutnya */}
          <button
            type="button"
            onClick={onFinish}
            className="flex-1 py-2.5 px-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
          >
            <span>Selesai</span>
            <span className="font-mono bg-red-800/80 px-1.5 py-0.5 rounded text-[10px]">
              {countdown}s
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="text-[11px] text-slate-500 font-medium">
          Otomatis kembali ke pemindaian QR dalam <span className="font-bold text-black">{countdown}</span> detik
        </div>
      </div>
    </div>
  );
};
