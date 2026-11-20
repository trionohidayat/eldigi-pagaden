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
    className={`w-11 h-15 sm:w-13 sm:h-17 flex-shrink-0 ${className}`}
    aria-label="Posisi Ibu Jari pada Ujung Kertas"
  >
    {/* Base shadow */}
    <ellipse cx="26" cy="62" rx="15" ry="2" fill="#CBD5E1" />

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
        className="w-28 h-28 sm:w-34 sm:h-34 opacity-85 -rotate-8 text-purple-700 filter drop-shadow-2xs"
        fill="currentColor"
      >
        {/* Outer Ring */}
        <circle cx="80" cy="80" r="74" fill="none" stroke="currentColor" strokeWidth="2.8" />
        {/* Middle Ring */}
        <circle cx="80" cy="80" r="67" fill="none" stroke="currentColor" strokeWidth="1.4" />
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
        className="absolute w-28 h-14 text-blue-900 pointer-events-none -rotate-3"
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
  // Default to 1 full A4 page as requested by user
  const [printLayout, setPrintLayout] = useState<'a4_single' | 'a5_two_cols'>('a4_single');

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
    <div className="w-full min-h-screen bg-slate-200/80 text-slate-900 flex flex-col font-sans">
      {/* Print CSS Stylesheet specifically tailored for 1 Full A4 Page per Voter */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
          .a4-sheet {
            width: 210mm !important;
            min-height: 297mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
            padding: 14mm 15mm 12mm 15mm !important;
            box-sizing: border-box !important;
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            border: 2px solid black !important;
            margin: 0 auto !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
          }
          .a5-sheet {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

      {/* Non-print Top Controls Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 px-3 sm:px-8 py-3 sm:py-4 shadow-sm print:hidden">
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
                <span>Surat Undangan Pemungutan Suara (A4 Penuh)</span>
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

            {/* Layout Toggle (Default: 1 Halaman Penuh A4) */}
            <div className="inline-flex rounded-xl border border-slate-300 bg-slate-100 p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPrintLayout('a4_single')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  printLayout === 'a4_single'
                    ? 'bg-red-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-black'
                }`}
              >
                1 Halaman Penuh A4
              </button>
              <button
                type="button"
                onClick={() => setPrintLayout('a5_two_cols')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  printLayout === 'a5_two_cols'
                    ? 'bg-red-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-black'
                }`}
              >
                2 Undangan / Lembar
              </button>
            </div>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="w-full sm:w-auto justify-center px-4 sm:px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Undangan A4 ({filteredVoters.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Info Banner for Panitia */}
        <div className="mb-6 print:hidden bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
          <span className="text-xl">📄</span>
          <div className="space-y-1">
            <div className="font-bold text-amber-950">
              Format Standar: 1 Halaman Penuh Berukuran A4 (Model C6-KWK Resmi):
            </div>
            <p className="text-[12px] leading-relaxed text-amber-900">
              Setiap pemilih akan dicetak pada **1 lembar kertas A4 penuh**. Tata letak telah disesuaikan dengan proporsi kertas A4 (210 x 297 mm) lengkap dengan **Kop Surat Daerah**, **QR Code resolusi tinggi**, **Kotak Rahasia Merah**, **Detail Alamat &amp; Bilik Suara**, **Cap Stempel Ungu Panitia**, serta **Petunjuk Posisi Ibu Jari di Ujung Bawah** untuk memudahkan proses scan di bilik suara.
            </p>
          </div>
        </div>

        {/* Invitation Letters Container */}
        <div
          className={
            printLayout === 'a4_single'
              ? 'space-y-10 print:space-y-0 max-w-4xl mx-auto'
              : 'grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4 print:p-0'
          }
        >
          {filteredVoters.map((voter, index) => {
            const bilikNumber = (index % 3) + 1;
            const dptNumber = String(900 + index + 1);

            return (
              <div
                key={voter.nik}
                className={
                  printLayout === 'a4_single'
                    ? 'a4-sheet relative bg-white border-2 border-black rounded-xs p-6 sm:p-10 flex flex-col justify-between shadow-xl print:shadow-none print:border-2 print:border-black text-black font-sans mx-auto'
                    : 'a5-sheet relative bg-white border-2 border-black rounded-xs p-4 sm:p-5 flex flex-col justify-between shadow-md print:shadow-none print:border-2 print:border-black text-black font-sans'
                }
                style={{
                  // Authentic A4 proportion for desktop preview: width 794px, minHeight 1123px (standard 96 DPI A4)
                  maxWidth: printLayout === 'a4_single' ? '794px' : undefined,
                  minHeight: printLayout === 'a4_single' ? '1060px' : '520px'
                }}
              >
                {/* 1. TOP HEADER: Kop Surat Undangan Resmi */}
                <div className="flex items-center justify-between border-b-2 border-black pb-3 sm:pb-4 mb-3 sm:mb-4">
                  {/* Left: Lambang Daerah Subang */}
                  <div className="w-16 sm:w-20 flex-shrink-0 flex items-center justify-start">
                    <CrestSubang size={printLayout === 'a4_single' ? 58 : 46} className="sm:scale-105" />
                  </div>

                  {/* Center: Title */}
                  <div className="text-center flex-1 px-2">
                    <h2
                      className={`font-black tracking-tight uppercase leading-tight text-black font-sans ${
                        printLayout === 'a4_single' ? 'text-base sm:text-xl' : 'text-xs sm:text-sm'
                      }`}
                    >
                      SURAT UNDANGAN
                    </h2>
                    <h2
                      className={`font-black tracking-tight uppercase leading-tight text-black font-sans ${
                        printLayout === 'a4_single' ? 'text-base sm:text-xl' : 'text-xs sm:text-sm'
                      }`}
                    >
                      PEMUNGUTAN SUARA
                    </h2>
                    <h3
                      className={`font-black tracking-wider uppercase leading-tight text-black font-sans mt-0.5 ${
                        printLayout === 'a4_single' ? 'text-sm sm:text-base' : 'text-[11px] sm:text-xs'
                      }`}
                    >
                      KEPADA PEMILIH
                    </h3>
                  </div>

                  {/* Right: No Urut DPT */}
                  <div className="w-22 sm:w-26 flex-shrink-0 text-center font-sans">
                    <div
                      className={`font-bold text-black uppercase leading-tight ${
                        printLayout === 'a4_single' ? 'text-xs sm:text-sm' : 'text-[10px] sm:text-[11px]'
                      }`}
                    >
                      No Urut DPT
                    </div>
                    <div
                      className={`font-black text-black leading-none mt-1 font-mono ${
                        printLayout === 'a4_single' ? 'text-2xl sm:text-4xl' : 'text-lg sm:text-2xl'
                      }`}
                    >
                      {dptNumber}
                    </div>
                  </div>
                </div>

                {/* 2. ROW 2: High Resolution QR Code (Left) & Two Outlined Warning Boxes (Right) */}
                <div
                  className={`flex items-center gap-4 sm:gap-6 ${
                    printLayout === 'a4_single' ? 'mb-5 sm:mb-6' : 'mb-2.5'
                  }`}
                >
                  {/* High Quality Square QR Code */}
                  <div
                    className={`border-2 border-black p-1.5 bg-white flex items-center justify-center flex-shrink-0 ${
                      printLayout === 'a4_single'
                        ? 'w-34 h-34 sm:w-42 sm:h-42'
                        : 'w-26 h-26 sm:w-30 sm:h-30'
                    }`}
                  >
                    {qrSVGs[voter.nik] ? (
                      <div
                        className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                        dangerouslySetInnerHTML={{ __html: qrSVGs[voter.nik] }}
                      />
                    ) : (
                      <div className="text-xs font-mono text-slate-400 text-center animate-pulse">
                        Memuat QR...
                      </div>
                    )}
                  </div>

                  {/* Two Stacked Outlined Boxes */}
                  <div
                    className={`flex-1 flex flex-col justify-center ${
                      printLayout === 'a4_single' ? 'gap-3 sm:gap-4' : 'gap-2'
                    }`}
                  >
                    {/* Top Box: Red Border, Red Bold Text */}
                    <div
                      className={`border-[2px] border-red-600 bg-red-50/50 text-center rounded-2xs ${
                        printLayout === 'a4_single' ? 'py-2.5 sm:py-3.5 px-3' : 'py-1.5 px-2'
                      }`}
                    >
                      <span
                        className={`font-black text-red-600 tracking-wide uppercase font-sans ${
                          printLayout === 'a4_single' ? 'text-xs sm:text-sm' : 'text-[10px] sm:text-[11px]'
                        }`}
                      >
                        SURAT UNDANGAN INI BERSIFAT RAHASIA
                      </span>
                    </div>

                    {/* Bottom Box: Black Border, Black Text */}
                    <div
                      className={`border-2 border-black text-center rounded-2xs bg-white ${
                        printLayout === 'a4_single' ? 'py-2.5 sm:py-3 px-3' : 'py-1.5 px-2'
                      }`}
                    >
                      <span
                        className={`font-bold text-black font-sans leading-tight ${
                          printLayout === 'a4_single' ? 'text-xs sm:text-sm' : 'text-[10px] sm:text-[11px]'
                        }`}
                      >
                        Tunjukan QRcode berikut saat akan memilih
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. NOTICE BODY PARAGRAPH */}
                <div
                  className={`text-black leading-relaxed font-sans ${
                    printLayout === 'a4_single' ? 'text-xs sm:text-sm mb-4 sm:mb-5' : 'text-[10.5px] sm:text-[11.5px] mb-1.5'
                  }`}
                >
                  <p className="mb-1">
                    Bersama ini diberitahukan bahwa Panitia Pemilihan mengundang Saudara/i:
                  </p>
                  <div className="flex flex-wrap items-baseline gap-2 mb-1">
                    <span
                      className={`font-black uppercase text-black ${
                        printLayout === 'a4_single' ? 'text-sm sm:text-base' : 'text-[11px] sm:text-[12px]'
                      }`}
                    >
                      {voter.name}
                    </span>
                    <span className="text-slate-800">
                      (NIK: <span className="font-mono font-bold tracking-wider">{voter.nik}</span>)
                    </span>
                    <span className="text-slate-800">
                      untuk memberikan suara pada pemilihan:
                    </span>
                  </div>
                  <p
                    className={`font-black uppercase tracking-tight text-black ${
                      printLayout === 'a4_single' ? 'text-sm sm:text-base mt-1' : 'text-[11px] sm:text-[12px]'
                    }`}
                  >
                    PEMILIHAN KEPALA DESA {cleanDesaName.toUpperCase()} yang akan dilaksanakan pada:
                  </p>
                </div>

                {/* 4. ALIGNED DETAILS TABLE */}
                <table
                  className={`w-full font-sans text-black ${
                    printLayout === 'a4_single' ? 'text-xs sm:text-sm mb-4 sm:mb-5' : 'text-[10.5px] sm:text-[11.5px] mb-1.5'
                  }`}
                >
                  <tbody>
                    <tr>
                      <td
                        className={`font-semibold ${
                          printLayout === 'a4_single' ? 'w-36 sm:w-44 py-1.5' : 'w-28 sm:w-32 py-0.5'
                        }`}
                      >
                        Hari/Tanggal
                      </td>
                      <td className="w-3 text-center">:</td>
                      <td className="font-bold py-1">Minggu, 08 November 2026</td>
                    </tr>
                    <tr>
                      <td className="font-semibold py-1">Pukul</td>
                      <td className="text-center">:</td>
                      <td className="font-bold py-1">07:00 s/d 13:00 WIB</td>
                    </tr>
                    <tr>
                      <td className="font-semibold py-1">Nomor TPS</td>
                      <td className="text-center">:</td>
                      <td className="font-bold py-1">{tpsConfig.tpsNumber}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold py-1 align-top">Alamat TPS</td>
                      <td className="text-center align-top">:</td>
                      <td className="font-bold py-1 uppercase leading-snug">
                        {voter.dusun} RT. {voter.rt} RW. {voter.rw} DESA {cleanDesaName.toUpperCase()} KEC. {tpsConfig.kecamatan.toUpperCase()}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold py-1">Nomor Bilik Suara</td>
                      <td className="text-center">:</td>
                      <td className="font-bold py-1">Bilik Suara Nomor {bilikNumber}</td>
                    </tr>
                  </tbody>
                </table>

                {/* 5. CATATAN RESMI */}
                <div
                  className={`text-justify leading-relaxed text-slate-900 font-sans border-t-2 border-b-2 border-dashed border-slate-400 ${
                    printLayout === 'a4_single' ? 'text-xs sm:text-[13px] py-3 my-4 sm:my-5' : 'text-[9.5px] sm:text-[10px] py-1.5 my-1.5'
                  }`}
                >
                  <span className="font-bold">Catatan : </span>
                  Surat Undangan ini beserta KTP Elektronik harus dibawa pada saat pencoblosan dan tidak boleh diwakilkan. Surat Undangan ini tidak boleh disebarluaskan, duplikasi atau diperlihatkan kepada pihak yang tidak berkepentingan.
                </div>

                {/* 6. SIGNATURES & OFFICIAL STAMP */}
                <div
                  className={`grid grid-cols-2 gap-4 font-sans text-black ${
                    printLayout === 'a4_single'
                      ? 'text-xs sm:text-sm pt-2 mb-4 sm:mb-6 min-h-[110px] sm:min-h-[130px]'
                      : 'text-[10px] sm:text-[11px] pt-1 mb-1 min-h-[80px]'
                  }`}
                >
                  {/* Left: Yang Menerima */}
                  <div className="flex flex-col justify-between text-center">
                    <div>
                      <div className="text-slate-600">........................ 2026</div>
                      <div className="font-semibold mt-0.5">Yang Menerima,</div>
                    </div>
                    <div
                      className={`font-bold ${
                        printLayout === 'a4_single' ? 'pt-8 sm:pt-12 text-sm sm:text-base' : 'pt-4 text-[10px] sm:text-[11px]'
                      }`}
                    >
                      ( {voter.name} )
                    </div>
                  </div>

                  {/* Right: Panitia Pemilihan + Purple Stamp */}
                  <div className="flex flex-col justify-between text-center relative">
                    <div>
                      <div>{cleanDesaName}, 02 November 2026</div>
                      <div className="font-bold uppercase tracking-wider mt-0.5">PANITIA PEMILIHAN</div>
                    </div>

                    {/* Official Purple Stamp & Signature */}
                    <div
                      className={`relative flex items-center justify-center ${
                        printLayout === 'a4_single' ? 'my-1 h-14' : 'my-0.5 h-10'
                      }`}
                    >
                      <PanitiaStamp
                        desaName={cleanDesaName}
                        className={`absolute ${printLayout === 'a4_single' ? '-top-8 sm:-top-10' : '-top-6'}`}
                      />
                    </div>

                    <div>
                      <div
                        className={`font-black underline uppercase ${
                          printLayout === 'a4_single' ? 'text-xs sm:text-sm' : 'text-[10px] sm:text-[11px]'
                        }`}
                      >
                        Drs. H. Maman Suryaman, S.Pd.I
                      </div>
                      <div
                        className={`text-slate-600 font-mono mt-0.5 ${
                          printLayout === 'a4_single' ? 'text-[10px] sm:text-xs' : 'text-[8.5px] sm:text-[9px]'
                        }`}
                      >
                        Tgl cetak: 02/11/2026 15:14 WIB
                      </div>
                    </div>
                  </div>
                </div>

                {/* 7. BOTTOM INSTRUCTION: Kotak Panduan Pegang Surat & Ikon Jempol */}
                <div
                  className={`flex items-center justify-start gap-4 pt-3 border-t-2 border-black mt-auto ${
                    printLayout === 'a4_single' ? 'pb-1' : 'pt-1.5'
                  }`}
                >
                  {/* Outlined Instruction Box */}
                  <div
                    className={`border-2 border-black font-sans text-black font-bold text-center bg-white ${
                      printLayout === 'a4_single'
                        ? 'p-2.5 sm:p-3 text-[11px] sm:text-xs max-w-[280px] sm:max-w-[320px] leading-snug'
                        : 'p-1.5 sm:p-2 text-[8.5px] sm:text-[9px] max-w-[210px] leading-tight'
                    }`}
                  >
                    Letakan posisi tangan ditengah-tengah ujung bawah persis seperti pada gambar untuk memudahkan proses scan QRCode
                  </div>

                  {/* Thumb Illustration resting upright on the bottom edge */}
                  <div className="flex items-end justify-start">
                    <ThumbGuideGraphic />
                  </div>

                  <div className="ml-auto text-right font-mono font-bold text-slate-600 print:text-black hidden xs:block text-xs sm:text-sm">
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
