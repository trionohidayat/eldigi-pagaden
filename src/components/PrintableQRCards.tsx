'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useVote } from '@/context/VoteContext';
import { CrestSubang } from './CrestSubang';
import { generateQRCodeSVG } from '@/utils/qrHelper';
import { Printer, ArrowLeft, Search, QrCode } from 'lucide-react';

interface PrintableQRCardsProps {
  onClose?: () => void;
  isModal?: boolean;
}

export const PrintableQRCards: React.FC<PrintableQRCardsProps> = ({
  onClose
}) => {
  const { voters, tpsConfig } = useVote();
  const [qrSVGs, setQrSVGs] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Pre-generate QR Code SVGs for all voters
  useEffect(() => {
    let isMounted = true;
    async function generateAll() {
      const results: Record<string, string> = {};
      for (const voter of voters) {
        try {
          const svg = await generateQRCodeSVG(voter.nik);
          results[voter.nik] = svg;
        } catch (e) {
          console.error('Failed to generate QR for', voter.nik, e);
        }
      }
      if (isMounted) {
        setQrSVGs(results);
      }
    }
    generateAll();
    return () => {
      isMounted = false;
    };
  }, [voters]);

  const filteredVoters = voters.filter(v => {
    return (
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.nik.includes(searchQuery)
    );
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Non-print Top Controls Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 px-3 sm:px-8 py-3 sm:py-4 shadow-xs print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                title="Kembali"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            ) : (
              <Link
                href="/bilik"
                className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                title="Kembali ke Bilik Suara"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            )}
            <div>
              <h1 className="text-base sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
                <span>Kartu Pemilih &amp; QR Code Suara</span>
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 font-mono">
                {tpsConfig.tpsNumber} • {tpsConfig.desa}, Kec. {tpsConfig.kecamatan}
              </p>
            </div>
          </div>

          <div className="flex flex-col xs:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Search filter */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari nama atau NIK..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="w-full xs:w-auto justify-center px-4 sm:px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Kartu ({filteredVoters.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Printable Grid */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
        <div className="mb-6 print:hidden bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
          <span className="text-lg">🖨️</span>
          <div>
            <span className="font-bold">Panduan Cetak Panitia:</span> Lembar di bawah ini telah disesuaikan agar dapat langsung dicetak pada kertas A4 (tersusun rapi dalam 2 kolom per halaman). Warga membawa potongan kartu ini ke bilik suara lalu mengarahkannya ke kamera untuk membuka surat suara digital.
          </div>
        </div>

        {/* Printable Cards Grid (2 columns on A4) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4 print:p-0">
          {filteredVoters.map((voter, index) => (
            <div
              key={voter.nik}
              className="relative bg-white border-2 border-black rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-xs print:shadow-none print:border-black print:break-inside-avoid print:page-break-inside-avoid"
              style={{
                minHeight: '260px'
              }}
            >
              {/* Card Header with Logo */}
              <div className="flex items-center gap-3 pb-3 border-b-2 border-black">
                <CrestSubang size={42} className="flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-[10px] sm:text-[11px] font-bold text-black uppercase tracking-wider leading-tight">
                    PEMERINTAH KABUPATEN SUBANG
                  </div>
                  <div className="text-xs sm:text-sm font-black text-black uppercase tracking-tight">
                    KARTU PEMILIH TETAP (DPT) DIGITAL
                  </div>
                  <div className="text-[10px] text-slate-700 font-bold uppercase">
                    PILKADES DESA PAGADEN • {tpsConfig.tpsNumber}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono font-black border border-black px-1.5 py-0.5 bg-slate-100">
                    DPT #{index + 1}
                  </span>
                </div>
              </div>

              {/* Card Body: QR Code and Voter Details */}
              <div className="flex items-center gap-4 py-3">
                {/* QR Code Container */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 border-2 border-black p-1 bg-white flex items-center justify-center flex-shrink-0">
                  {qrSVGs[voter.nik] ? (
                    <div
                      className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                      dangerouslySetInnerHTML={{ __html: qrSVGs[voter.nik] }}
                    />
                  ) : (
                    <div className="text-[10px] font-mono text-slate-400 text-center animate-pulse">
                      Memuat QR...
                    </div>
                  )}
                </div>

                {/* Voter Bio */}
                <div className="flex-1 space-y-1">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                      Nama Lengkap:
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-black uppercase leading-tight font-sans">
                      {voter.name}
                    </h3>
                  </div>

                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                      NIK Pemilih:
                    </span>
                    <div className="text-xs sm:text-sm font-mono font-bold text-black tracking-wider">
                      {voter.nik}
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-700 font-medium">
                    <span className="font-bold">{voter.dusun}</span> • RT {voter.rt} / RW {voter.rw}
                  </div>

                  <div className="text-[10px] text-slate-500 italic pt-1">
                    Jenis Kelamin: {voter.gender === 'L' ? 'Laki-Laki' : 'Perempuan'} • Usia: {voter.age} Th
                  </div>
                </div>
              </div>

              {/* Card Footer: Instruction */}
              <div className="pt-2 border-t border-dashed border-slate-400 flex items-center justify-between text-[10px] text-slate-600">
                <span className="font-semibold">
                  👉 Arahkan QR Code ke kamera bilik suara untuk memilih.
                </span>
                <span className="font-mono font-bold text-[9px] text-black">
                  LUBER &amp; JURDIL
                </span>
              </div>

              {/* Cut Marks for Printing */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-mono text-slate-400 print:text-black">
                ✂ - - - - - - - - - - - - - - - - - - - - - - ✂
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
