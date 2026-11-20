'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useVote } from '@/context/VoteContext';
import { CrestSubang } from './CrestSubang';
import { generateQRCodeSVG } from '@/utils/qrHelper';
import { Printer, ArrowLeft, Search, FileText } from 'lucide-react';

interface PrintableQRCardsProps {
  onClose?: () => void;
  isModal?: boolean;
}

/**
 * Thumb guide vector illustration matching the physical invitation
 * Shows a thumb positioned upright at the bottom edge of the paper
 */
const ThumbGuideGraphic: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 52 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-9 h-12 sm:w-10 sm:h-13 flex-shrink-0 ${className}`}
    aria-label="Posisi Ibu Jari pada Ujung Kertas"
  >
    {/* Base shadow */}
    <ellipse cx="26" cy="62" rx="15" ry="2" fill="#E2E8F0" />

    {/* Thumb skin / contour */}
    <path
      d="M14 64V32C14 24 19 17 26 17C33 17 38 24 38 32V64"
      fill="#F6C492"
      stroke="#1E293B"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Fingernail */}
    <path
      d="M19 25C19 21.5 22 20 26 20C30 20 33 21.5 33 25V30C33 31.5 30 32.5 26 32.5C22 32.5 19 31.5 19 30V25Z"
      fill="#FDF2E9"
      stroke="#94A3B8"
      strokeWidth="1.5"
    />

    {/* Knuckle creases */}
    <path
      d="M20 42C22.5 44 29.5 44 32 42"
      stroke="#D97706"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
    <path
      d="M21 46C23.5 47.5 28.5 47.5 31 46"
      stroke="#D97706"
      strokeWidth="1.25"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Authentic Purple Official Stamp of Panitia Pemilihan Kepala Desa
 */
const PanitiaStamp: React.FC<{ desaName?: string; className?: string }> = ({
  desaName = 'PAGADEN',
  className = ''
}) => {
  return (
    <div className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}>
      {/* Circular Official Stamp */}
      <svg
        viewBox="0 0 160 160"
        className="w-24 h-24 sm:w-28 sm:h-28 opacity-85 -rotate-8 text-purple-700 filter drop-shadow-2xs"
        fill="currentColor"
      >
        {/* Outer Ring */}
        <circle cx="80" cy="80" r="74" fill="none" stroke="currentColor" strokeWidth="2.5" />
        {/* Middle Ring */}
        <circle cx="80" cy="80" r="67" fill="none" stroke="currentColor" strokeWidth="1.2" />
        {/* Inner Dashed Ring */}
        <circle cx="80" cy="80" r="47" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" />

        {/* Circular Path Top & Bottom */}
        <defs>
          <path
            id="stampPathTop"
            d="M 22 80 A 58 58 0 0 1 138 80"
            fill="none"
          />
          <path
            id="stampPathBottom"
            d="M 24 80 A 56 56 0 0 0 136 80"
            fill="none"
          />
        </defs>

        {/* Top Text: PANITIA PEMILIHAN KEPALA DESA */}
        <text fontSize="10" fontWeight="900" letterSpacing="1.1" fill="currentColor">
          <textPath href="#stampPathTop" startOffset="50%" textAnchor="middle">
            PANITIA PEMILIHAN KEPALA DESA
          </textPath>
        </text>

        {/* Bottom Text: KABUPATEN SUBANG */}
        <text fontSize="9.5" fontWeight="900" letterSpacing="1.8" fill="currentColor">
          <textPath href="#stampPathBottom" startOffset="50%" textAnchor="middle">
            • KAB. SUBANG •
          </textPath>
        </text>

        {/* Center Stars & Village Badge */}
        <g transform="translate(80, 80) scale(0.9)">
          <path
            d="M 0 -13 L 3 -4 L 11 -4 L 5 2 L 7 10 L 0 5 L -7 10 L -5 2 L -11 -4 L -3 -4 Z"
            fill="currentColor"
          />
          <text
            x="0"
            y="6"
            textAnchor="middle"
            fontSize="10"
            fontWeight="900"
            letterSpacing="0.8"
            fill="currentColor"
          >
            PILKADES
          </text>
          <text
            x="0"
            y="17"
            textAnchor="middle"
            fontSize="9"
            fontWeight="800"
            letterSpacing="1"
            fill="currentColor"
          >
            {desaName.toUpperCase()}
          </text>
        </g>
      </svg>

      {/* Realistic Blue/Violet Handwritten Signature Stroke */}
      <svg
        viewBox="0 0 140 70"
        className="absolute w-24 h-12 text-blue-900 pointer-events-none -rotate-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 45 C30 20, 25 55, 45 35 C55 25, 50 50, 70 30 C85 15, 75 45, 95 38 C105 35, 115 40, 125 35" />
        <path d="M40 50 L95 20" strokeWidth="2" />
        <path d="M20 52 C50 50, 90 48, 120 46" strokeWidth="1.5" />
      </svg>
    </div>
  );
};

export const PrintableQRCards: React.FC<PrintableQRCardsProps> = ({
  onClose
}) => {
  const { voters, tpsConfig } = useVote();
  const [qrSVGs, setQrSVGs] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [dusunFilter, setDusunFilter] = useState<string>('all');
  const [printLayout, setPrintLayout] = useState<'a5_two_cols' | 'a4_single'>('a5_two_cols');

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

  const uniqueDusuns = Array.from(new Set(voters.map(v => v.dusun)));

  const filteredVoters = voters.filter(v => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.nik.includes(searchQuery);
    const matchesDusun = dusunFilter === 'all' || v.dusun === dusunFilter;
    return matchesSearch && matchesDusun;
  });

  const handlePrint = () => {
    window.print();
  };

  const cleanDesaName = tpsConfig.desa.replace(/^desa\s+/i, '');

  return (
    <div className="w-full min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Print CSS Stylesheet */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
          body {
            background: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
          .page-break {
            page-break-after: always;
            break-after: page;
          }
        }
      `}</style>

      {/* Non-print Top Controls Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 px-3 sm:px-8 py-3 sm:py-4 shadow-xs print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                title="Kembali"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            ) : (
              <Link
                href="/bilik"
                className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                title="Kembali ke Layar Bilik Suara"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            )}
            <div>
              <h1 className="text-base sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
                <span>Surat Undangan Pemungutan Suara (C6 Digital)</span>
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 font-mono">
                {tpsConfig.tpsNumber} • Desa {cleanDesaName}, Kec. {tpsConfig.kecamatan}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Filter Dusun */}
            <select
              value={dusunFilter}
              onChange={e => setDusunFilter(e.target.value)}
              className="py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">Semua Dusun ({voters.length})</option>
              {uniqueDusuns.map(dusun => (
                <option key={dusun} value={dusun}>
                  {dusun}
                </option>
              ))}
            </select>

            {/* Search filter */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari nama atau NIK..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
              />
            </div>

            {/* Layout Toggle */}
            <div className="inline-flex rounded-xl border border-slate-300 bg-slate-100 p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPrintLayout('a5_two_cols')}
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                  printLayout === 'a5_two_cols'
                    ? 'bg-white text-black shadow-xs font-bold'
                    : 'text-slate-600 hover:text-black'
                }`}
              >
                2 Undangan / Lembar
              </button>
              <button
                type="button"
                onClick={() => setPrintLayout('a4_single')}
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                  printLayout === 'a4_single'
                    ? 'bg-white text-black shadow-xs font-bold'
                    : 'text-slate-600 hover:text-black'
                }`}
              >
                1 Halaman Penuh
              </button>
            </div>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="w-full sm:w-auto justify-center px-4 sm:px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Undangan ({filteredVoters.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Info Banner for Panitia */}
        <div className="mb-6 print:hidden bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
          <span className="text-xl">📋</span>
          <div className="space-y-1">
            <div className="font-bold text-amber-950">
              Format Surat Undangan Pemungutan Suara Kepada Pemilih (C6 Digital):
            </div>
            <p className="text-[12px] leading-relaxed text-amber-900">
              Surat undangan ini dirancang persis sesuai spesifikasi formulir resmi: dilengkapi **Kop Lambang Daerah**, **Kotak Rahasia Merah**, **QR Code Pemilih di sudut kiri atas**, **Detail Waktu &amp; Bilik Suara**, **Cap Stempel Panitia**, serta **Petunjuk Posisi Ibu Jari di Ujung Bawah** agar saat warga memegang kertas di depan kamera bilik suara, kode QR tidak tertutup tangan.
            </p>
          </div>
        </div>

        {/* Invitation Letters Grid */}
        <div
          className={
            printLayout === 'a5_two_cols'
              ? 'grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4 print:p-0'
              : 'grid grid-cols-1 gap-8 max-w-3xl mx-auto print:gap-0 print:p-0'
          }
        >
          {filteredVoters.map((voter, index) => {
            const bilikNumber = (index % 3) + 1;
            const dptNumber = String(900 + index + 1); // Exact 900-series DPT number format as seen in photo

            return (
              <div
                key={voter.nik}
                className="relative bg-white border-2 border-black rounded-xs p-4 sm:p-5 flex flex-col justify-between shadow-md print:shadow-none print:border-2 print:border-black print:break-inside-avoid print:page-break-inside-avoid text-black font-sans"
                style={{
                  minHeight: printLayout === 'a4_single' ? '920px' : '520px'
                }}
              >
                {/* TOP HEADER: Kop Surat Undangan */}
                <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-2.5">
                  {/* Left: Lambang Daerah Subang */}
                  <div className="w-14 sm:w-16 flex-shrink-0 flex items-center justify-start">
                    <CrestSubang size={46} className="sm:scale-105" />
                  </div>

                  {/* Center: Title */}
                  <div className="text-center flex-1 px-1">
                    <h2 className="text-xs sm:text-sm md:text-base font-black tracking-tight uppercase leading-tight text-black font-sans">
                      SURAT UNDANGAN
                    </h2>
                    <h2 className="text-xs sm:text-sm md:text-base font-black tracking-tight uppercase leading-tight text-black font-sans">
                      PEMUNGUTAN SUARA
                    </h2>
                    <h3 className="text-[11px] sm:text-xs font-black tracking-wider uppercase leading-tight text-black font-sans mt-0.5">
                      KEPADA PEMILIH
                    </h3>
                  </div>

                  {/* Right: No Urut DPT */}
                  <div className="w-18 sm:w-20 flex-shrink-0 text-center font-sans">
                    <div className="text-[10px] sm:text-[11px] font-bold text-black uppercase leading-tight">
                      No Urut DPT
                    </div>
                    <div className="text-lg sm:text-2xl font-black text-black leading-none mt-0.5 font-mono">
                      {dptNumber}
                    </div>
                  </div>
                </div>

                {/* ROW 2: QR Code (Left) & Two Outlined Warning Boxes (Right) */}
                <div className="flex items-center gap-3 sm:gap-4 mb-2.5">
                  {/* High Quality Square QR Code */}
                  <div className="w-26 h-26 sm:w-30 sm:h-30 border-2 border-black p-1 bg-white flex items-center justify-center flex-shrink-0">
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

                  {/* Two Stacked Outlined Boxes */}
                  <div className="flex-1 flex flex-col justify-center gap-2">
                    {/* Top Box: Red Border, Red Bold Text */}
                    <div className="border-[1.5px] border-red-600 bg-red-50/40 py-1.5 px-2 text-center rounded-2xs">
                      <span className="text-[10px] sm:text-[11px] font-extrabold text-red-600 tracking-wide uppercase font-sans">
                        SURAT UNDANGAN INI BERSIFAT RAHASIA
                      </span>
                    </div>

                    {/* Bottom Box: Black Border, Black Text */}
                    <div className="border border-black py-1.5 px-2 text-center rounded-2xs bg-white">
                      <span className="text-[10px] sm:text-[11px] font-bold text-black font-sans leading-tight">
                        Tunjukan QRcode berikut saat akan memilih
                      </span>
                    </div>
                  </div>
                </div>

                {/* NOTICE BODY PARAGRAPH */}
                <div className="text-[10.5px] sm:text-[11.5px] text-black leading-relaxed font-sans mb-1.5">
                  <p className="mb-0.5">
                    Bersama ini diberitahukan bahwa Panitia Pemilihan mengundang Saudara/i
                  </p>
                  <div className="flex flex-wrap items-baseline gap-1.5 mb-0.5">
                    <span className="font-extrabold uppercase text-black text-[11px] sm:text-[12px]">
                      {voter.name}
                    </span>
                    <span className="text-[10.5px] text-slate-800">
                      (NIK: <span className="font-mono font-bold tracking-wider">{voter.nik}</span>)
                    </span>
                    <span className="text-[10.5px] text-slate-800">
                      untuk memberikan suara pada pemilihan:
                    </span>
                  </div>
                  <p className="font-black uppercase tracking-tight text-black text-[11px] sm:text-[12px]">
                    PEMILIHAN KEPALA DESA {cleanDesaName.toUpperCase()} yang akan dilaksanakan pada:
                  </p>
                </div>

                {/* ALIGNED DETAILS TABLE */}
                <table className="w-full text-[10.5px] sm:text-[11.5px] font-sans text-black mb-1.5">
                  <tbody>
                    <tr>
                      <td className="w-28 sm:w-32 font-medium py-0.5">Hari/Tanggal</td>
                      <td className="w-3 text-center">:</td>
                      <td className="font-bold py-0.5">Minggu, 08 November 2026</td>
                    </tr>
                    <tr>
                      <td className="font-medium py-0.5">Pukul</td>
                      <td className="text-center">:</td>
                      <td className="font-bold py-0.5">07:00 s/d 13:00 WIB</td>
                    </tr>
                    <tr>
                      <td className="font-medium py-0.5">Nomor TPS</td>
                      <td className="text-center">:</td>
                      <td className="font-bold py-0.5">{tpsConfig.tpsNumber}</td>
                    </tr>
                    <tr>
                      <td className="font-medium py-0.5 align-top">Alamat TPS</td>
                      <td className="text-center align-top">:</td>
                      <td className="font-bold py-0.5 uppercase leading-tight">
                        {voter.dusun} RT. {voter.rt} RW. {voter.rw} DESA {cleanDesaName.toUpperCase()} KEC. {tpsConfig.kecamatan.toUpperCase()}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium py-0.5">Nomor Bilik Suara</td>
                      <td className="text-center">:</td>
                      <td className="font-bold py-0.5">Bilik Suara Nomor {bilikNumber}</td>
                    </tr>
                  </tbody>
                </table>

                {/* CATATAN RESMI */}
                <div className="text-[9.5px] sm:text-[10px] text-justify leading-tight text-slate-900 font-sans border-t border-b border-dashed border-slate-400 py-1.5 my-1.5">
                  <span className="font-bold">Catatan : </span>
                  Surat Undangan ini beserta KTP Elektronik harus dibawa pada saat pencoblosan dan tidak boleh diwakilkan. Surat Undangan ini tidak boleh disebarluaskan, duplikasi atau diperlihatkan kepada pihak yang tidak berkepentingan.
                </div>

                {/* SIGNATURES & OFFICIAL STAMP */}
                <div className="grid grid-cols-2 gap-3 text-[10px] sm:text-[11px] font-sans text-black pt-1 mb-1">
                  {/* Left: Yang Menerima */}
                  <div className="flex flex-col justify-between text-center min-h-[80px]">
                    <div>
                      <div className="text-slate-600">........................ 2026</div>
                      <div className="font-medium">Yang Menerima,</div>
                    </div>
                    <div className="font-bold pt-4 text-[10px] sm:text-[11px]">
                      ( {voter.name} )
                    </div>
                  </div>

                  {/* Right: Panitia Pemilihan + Purple Stamp */}
                  <div className="flex flex-col justify-between text-center relative min-h-[80px]">
                    <div>
                      <div>{cleanDesaName}, 02 November 2026</div>
                      <div className="font-bold uppercase tracking-wider">PANITIA PEMILIHAN</div>
                    </div>

                    {/* Official Purple Stamp & Signature */}
                    <div className="relative flex items-center justify-center my-0.5 h-10">
                      <PanitiaStamp
                        desaName={cleanDesaName}
                        className="absolute -top-6"
                      />
                    </div>

                    <div>
                      <div className="font-bold underline uppercase text-[10px] sm:text-[11px]">
                        Drs. H. Maman Suryaman, S.Pd.I
                      </div>
                      <div className="text-[8.5px] sm:text-[9px] text-slate-600 font-mono">
                        Tgl cetak: 02/11/2026 15:14 WIB
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTTOM INSTRUCTION: Kotak Panduan Pegang Surat & Ikon Jempol */}
                <div className="flex items-center justify-start gap-2.5 sm:gap-3 pt-1.5 border-t-2 border-black mt-auto">
                  {/* Outlined Instruction Box */}
                  <div className="border border-black p-1.5 sm:p-2 text-[8.5px] sm:text-[9px] leading-tight font-sans text-black max-w-[210px] text-center font-bold bg-white">
                    Letakan posisi tangan ditengah-tengah ujung bawah persis seperti pada gambar untuk memudahkan proses scan QRCode
                  </div>

                  {/* Thumb Illustration resting upright on the bottom edge */}
                  <div className="flex items-end justify-start">
                    <ThumbGuideGraphic />
                  </div>

                  <div className="ml-auto text-right text-[8.5px] font-mono text-slate-500 print:text-black hidden xs:block">
                    FORMULIR MODEL C6-KWK
                  </div>
                </div>

                {/* Subtle Cut Mark Guide for Double Column Print */}
                {printLayout === 'a5_two_cols' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-mono text-slate-400 print:text-black no-print">
                    ✂ - - - - - - - - - - - - - - - - - - ✂
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
