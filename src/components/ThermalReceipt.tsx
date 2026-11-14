'use client';

import React, { useEffect, useState } from 'react';
import { LastVoteInfo } from '@/context/VoteContext';
import { CrestSubang } from './CrestSubang';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { Printer, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ThermalReceiptProps {
  lastVote: LastVoteInfo;
  voterName?: string;
  onFinish: () => void;
  language?: 'id' | 'su';
  autoResetSeconds?: number;
}

export const ThermalReceipt: React.FC<ThermalReceiptProps> = ({
  lastVote,
  voterName,
  onFinish,
  language = 'id',
  autoResetSeconds = 5
}) => {
  const [countdown, setCountdown] = useState(autoResetSeconds);
  const [isPrinted, setIsPrinted] = useState(false);
  const [qrSvg, setQrSvg] = useState<string>(() => {
    try {
      let initialSvg = '';
      QRCode.toString(
        lastVote.receiptCode,
        {
          type: 'svg',
          margin: 1,
          color: { dark: '#000000', light: '#ffffff' }
        },
        (err, str) => {
          if (!err && str) initialSvg = str;
        }
      );
      return initialSvg;
    } catch {
      return '';
    }
  });

  useEffect(() => {
    if (!qrSvg) {
      QRCode.toString(
        lastVote.receiptCode,
        {
          type: 'svg',
          margin: 1,
          color: { dark: '#000000', light: '#ffffff' }
        },
        (err, str) => {
          if (!err && str) setQrSvg(str);
        }
      );
    }
  }, [lastVote.receiptCode, qrSvg]);

  useEffect(() => {
    // Subtle celebratory confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.4 }
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

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between items-center py-3 sm:py-6 px-3 sm:px-4 select-none overflow-y-auto"
      style={{
        background: 'linear-gradient(180deg, #cbe8d6 0%, #e0f2e7 22%, #f5faf7 48%, #ffffff 75%)'
      }}
    >
      {/* Top Header: Terima Kasih, Pilihan Anda Tersimpan & Crest */}
      <div className="flex flex-col items-center text-center mt-1 sm:mt-2 landscape:mt-0 print:hidden">
        <CrestSubang size={46} className="drop-shadow-xs mb-1.5 sm:scale-115 landscape:scale-80" />

        {/* Animated Checkmark Circle */}
        <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center my-1 shadow-sm">
          <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
        </div>

        {/* Main Title: TERIMA KASIH */}
        <h1 className="text-xl sm:text-3xl md:text-4xl landscape:text-lg sm:landscape:text-2xl font-black tracking-wider text-black font-sans uppercase">
          {language === 'su' ? 'HATUR NUHUN' : 'TERIMA KASIH'}
        </h1>

        {/* Subtitle: Pilihan Anda Tersimpan */}
        <p className="text-sm sm:text-lg md:text-xl landscape:text-xs sm:landscape:text-base font-extrabold text-emerald-800 font-sans tracking-wide mt-0.5">
          {language === 'su' ? 'Pilihan Anjeun Parantos Kasimpen' : 'Pilihan Anda Tersimpan'}
        </p>

        {/* Subtitle explanation */}
        <p className="text-[11px] sm:text-xs text-slate-600 font-medium mt-0.5 max-w-sm">
          {language === 'su'
            ? 'Hak sora anjeun parantos hasil kacatet sacara sah, aman, sareng rahasia.'
            : 'Hak suara Anda telah berhasil tercatat dalam sistem secara sah, aman, dan rahasia.'}
        </p>

        {/* Voter & TPS info badges */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5 text-[11px] sm:text-xs">
          {voterName && (
            <span className="font-bold text-slate-900 bg-white/90 border border-slate-300 px-2.5 py-0.5 rounded-full shadow-2xs">
              Pemilih: {voterName}
            </span>
          )}
          <span className="bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold px-2.5 py-0.5 rounded-full shadow-2xs">
            {lastVote.tps}
          </span>
        </div>

        {/* Printing status pill */}
        <div className="mt-2 inline-flex items-center gap-2 bg-white/90 border border-emerald-400 text-emerald-950 px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            {isPrinted
              ? 'Struk Fisik Berhasil Dicetak'
              : 'Sedang Mencetak Struk Suara (VVPAT)...'}
          </span>
        </div>

        <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">
          STRUK BUKTI SUARA DIGITAL (VVPAT)
        </p>
      </div>

      {/* Minimalist Virtual Thermal Paper Receipt */}
      <div className="my-auto py-3 w-full max-w-sm flex flex-col items-center">
        {/* Sleek Minimalist Printer Output Slot */}
        <div className="w-68 xs:w-72 sm:w-80 h-2.5 sm:h-3 bg-black rounded-t-md shadow-md border-b border-slate-700 print:hidden" />

        {/* Crisp White Thermal Paper */}
        <div
          id="vvpat-receipt"
          className="w-68 xs:w-72 sm:w-80 bg-white border-2 border-black p-4 sm:p-5 text-black font-mono text-xs shadow-xl select-none relative animate-in slide-in-from-top-6 duration-700"
          style={{
            touchAction: 'manipulation'
          }}
        >
          {/* Receipt Header */}
          <div className="text-center pb-3 border-b-2 border-dashed border-black flex flex-col items-center">
            <div className="mb-1.5 flex justify-center">
              <CrestSubang size={36} />
            </div>
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

          {/* Verification Section: QR Code & Barcode (Kerahasiaan Suara Terjaga - Tanpa Informasi Calon) */}
          <div className="pt-3 pb-1 flex flex-col items-center text-center">
            {/* QR Code representation */}
            {qrSvg && (
              <div
                className="w-24 h-24 sm:w-28 sm:h-28 mx-auto flex items-center justify-center p-1 bg-white border border-black/20 rounded-xs mb-2 [&>svg]:w-full [&>svg]:h-full"
                dangerouslySetInnerHTML={{ __html: qrSvg }}
              />
            )}

            {/* Barcode representation */}
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
            <p className="text-[9px] text-slate-600 italic mt-2.5 leading-tight">
              &quot;Struk fisik ini adalah bukti sah pilihan Anda. Masukkan ke dalam kotak suara fisik.&quot;
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Action & Countdown Bar */}
      <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center gap-1.5 sm:gap-2 mb-2 pb-safe print:hidden">
        {/* Animated Countdown Progress Bar */}
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${(countdown / (autoResetSeconds || 5)) * 100}%` }}
          />
        </div>

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
            <span>Scan QR Baru</span>
            <span className="font-mono bg-red-800/80 px-1.5 py-0.5 rounded text-[10px]">
              {countdown}s
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="text-[11px] text-slate-600 font-medium text-center">
          Otomatis kembali ke halaman scan QR dalam{' '}
          <span className="font-bold text-red-600 font-mono text-xs">{countdown}</span> detik
        </div>
      </div>
    </div>
  );
};
