'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useVote } from '@/context/VoteContext';
import { CANDIDATES } from '@/data/candidates';
import { CrestSubang } from '@/components/CrestSubang';
import {
  BarChart3,
  Trophy,
  Printer,
  ShieldCheck,
  FileText
} from 'lucide-react';

export default function RekapitulasiPage() {
  const { votes, totalVotes, tpsConfig } = useVote();
  const [showC1Modal, setShowC1Modal] = useState(false);

  // Find leading candidate
  let leaderId: number | null = null;
  let maxVotes = 0;
  let isTie = false;

  Object.entries(votes).forEach(([cIdStr, count]) => {
    const cId = Number(cIdStr);
    if (count > maxVotes) {
      maxVotes = count;
      leaderId = cId;
      isTie = false;
    } else if (count === maxVotes && maxVotes > 0) {
      isTie = true;
    }
  });

  const leadingCandidate = leaderId && !isTie ? CANDIDATES.find(c => c.id === leaderId) : null;

  return (
    <div className="flex-1 bg-slate-50 py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 flex-shrink-0">
              <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-100 text-amber-800 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full">
                  Real-time Quick Count
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">
                  {tpsConfig.tpsNumber} • {tpsConfig.desa}
                </span>
              </div>
              <h1 className="text-lg sm:text-2xl font-black text-slate-900 mt-0.5">
                Rekapitulasi Hasil Pemungutan Suara
              </h1>
            </div>
          </div>

          <div className="w-full sm:w-auto flex items-center gap-2.5">
            <button
              onClick={() => setShowC1Modal(true)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>C1 Elektronik (Berita Acara)</span>
            </button>
          </div>
        </div>

        {/* Lead Summary Banner */}
        {totalVotes > 0 && leadingCandidate && (
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 text-left">
              {leadingCandidate.photoUrl ? (
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md flex-shrink-0">
                  <Image
                    src={leadingCandidate.photoUrl}
                    alt={leadingCandidate.name}
                    fill
                    className="object-cover object-top"
                    sizes="56px"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-amber-300 animate-bounce" />
                </div>
              )}
              <div>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-200">
                  Perolehan Suara Tertinggi Sementara
                </span>
                <h3 className="text-lg sm:text-2xl font-black mt-0.5">
                  Calon No. {leadingCandidate.number}: {leadingCandidate.name}
                </h3>
                <p className="text-[11px] sm:text-xs text-emerald-100">
                  Meraih {votes[leadingCandidate.id]} suara (
                  {Math.round((votes[leadingCandidate.id] / totalVotes) * 100)}% dari total suara masuk)
                </p>
              </div>
            </div>

            <div className="w-full sm:w-auto bg-white/15 px-4 py-2 rounded-2xl border border-white/20 text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-200">
                Status Penghitungan
              </span>
              <div className="text-base sm:text-lg font-black font-mono">100% REAL-TIME</div>
            </div>
          </div>
        )}

        {/* 3 Candidates Vote Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {CANDIDATES.map(candidate => {
            const count = votes[candidate.id] || 0;
            const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
            const isLeading = leadingCandidate?.id === candidate.id;

            return (
              <div
                key={candidate.id}
                className={`bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 shadow-sm flex flex-col justify-between relative overflow-hidden transition ${
                  isLeading ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20' : candidate.themeColor.border
                }`}
              >
                {isLeading && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black uppercase px-2.5 sm:px-3 py-1 rounded-bl-xl flex items-center gap-1 shadow-sm">
                    <Trophy className="w-3 h-3 text-amber-300" />
                    <span>Memimpin</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-black text-xl sm:text-2xl text-white shadow flex-shrink-0 ${candidate.themeColor.badgeBg}`}
                    >
                      {candidate.number}
                    </div>
                    {candidate.photoUrl && (
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shadow border border-slate-200 flex-shrink-0">
                        <Image
                          src={candidate.photoUrl}
                          alt={candidate.name}
                          fill
                          className="object-cover object-top"
                          sizes="56px"
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase">
                        Calon No. {candidate.number}
                      </span>
                      <h4 className="text-base sm:text-lg lg:text-xl font-black text-slate-900 leading-tight line-clamp-2">
                        {candidate.name}
                      </h4>
                      {candidate.title ? (
                        <p className="text-xs text-slate-500 font-semibold truncate">{candidate.title}</p>
                      ) : null}
                    </div>
                  </div>

                  {/* Vote Numbers */}
                  <div className="bg-slate-50 rounded-2xl p-3 sm:p-4 border border-slate-100 my-3 sm:my-4 text-center">
                    <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Perolehan Suara
                    </span>
                    <div className="text-3xl sm:text-5xl font-black text-slate-900 my-0.5 sm:my-1">
                      {count}
                      <span className="text-xs sm:text-sm font-bold text-slate-400 ml-1.5">suara</span>
                    </div>
                    <div className="text-sm sm:text-base font-extrabold text-emerald-700">
                      {percentage}%
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full h-2.5 sm:h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`h-full transition-all duration-500 ${candidate.themeColor.btnBg}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-100 text-[10px] sm:text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Slogan:</span>
                  <span className="italic font-medium text-slate-600 truncate max-w-[160px] sm:max-w-[180px]">
                    &ldquo;{candidate.slogan}&rdquo;
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Audit & Integrity Box */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                Integritas Suara Terjamin &amp; Dapat Diaudit (VVPAT)
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Setiap 1 suara digital tercatat otomatis bersama 1 struk fisik yang dimasukkan ke kotak suara. Tidak ada selisih data.
              </p>
            </div>
          </div>

          <div className="w-full md:w-auto flex items-center justify-center gap-4 text-center">
            <div className="w-full md:w-auto px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Suara Masuk</span>
              <div className="text-base sm:text-lg font-black text-slate-900">{totalVotes}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Pratinjau Lembar Model C1 Digital */}
      {showC1Modal && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-4 sm:p-8 shadow-2xl border border-slate-300 my-auto text-slate-900">
            {/* Header C1 */}
            <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
              <div className="flex justify-center mb-2">
                <CrestSubang size={48} />
              </div>
              <h3 className="font-black text-base uppercase tracking-wider">
                BERITA ACARA PEMUNGUTAN DAN PENGHITUNGAN SUARA
              </h3>
              <h4 className="font-extrabold text-sm uppercase">
                PEMILIHAN KEPALA DESA SERENTAK • DESA PAGADEN TAHUN {tpsConfig.tahun}
              </h4>
              <p className="text-xs font-mono text-slate-600">
                MODEL C1-DIGITAL • {tpsConfig.tpsNumber} ({tpsConfig.dusun})
              </p>
            </div>

            {/* Table of C1 Results */}
            <div className="my-6 space-y-4">
              <table className="w-full text-left text-xs sm:text-sm border border-slate-300">
                <thead className="bg-slate-100 border-b border-slate-300 font-bold">
                  <tr>
                    <th className="py-2.5 px-3 border-r border-slate-300 text-center w-12">No</th>
                    <th className="py-2.5 px-3 border-r border-slate-300">Nama Calon Kepala Desa</th>
                    <th className="py-2.5 px-3 border-r border-slate-300 text-center w-28">Perolehan Suara</th>
                    <th className="py-2.5 px-3 text-center w-20">Persen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {CANDIDATES.map(c => (
                    <tr key={c.id}>
                      <td className="py-2.5 px-3 border-r border-slate-300 text-center font-bold">
                        {c.number}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-300 font-sans font-bold">
                        {c.name}{c.title ? `, ${c.title}` : ''}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-300 text-center font-bold text-sm">
                        {votes[c.id] || 0}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {totalVotes > 0 ? Math.round(((votes[c.id] || 0) / totalVotes) * 100) : 0}%
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100 font-bold">
                    <td colSpan={2} className="py-2.5 px-3 border-r border-slate-300 text-right font-sans">
                      JUMLAH TOTAL SUARA SAH:
                    </td>
                    <td className="py-2.5 px-3 border-r border-slate-300 text-center text-sm">
                      {totalVotes}
                    </td>
                    <td className="py-2.5 px-3 text-center">100%</td>
                  </tr>
                </tbody>
              </table>

              {/* Signatures simulation */}
              <div className="grid grid-cols-2 gap-6 pt-6 text-center text-xs">
                <div>
                  <p className="text-slate-500">Saksi-Saksi Calon</p>
                  <div className="h-16 flex items-center justify-center font-mono text-[10px] text-emerald-700 italic">
                    [Tervalidasi Digital]
                  </div>
                  <p className="font-bold border-t border-slate-400 pt-1">Saksi Paslon 01, 02, 03</p>
                </div>
                <div>
                  <p className="text-slate-500">Ketua KPPS {tpsConfig.tpsNumber}</p>
                  <div className="h-16 flex items-center justify-center font-mono text-[10px] text-emerald-700 italic">
                    [Tervalidasi Digital]
                  </div>
                  <p className="font-bold border-t border-slate-400 pt-1">Panitia Pemungutan Suara</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end border-t border-slate-200 pt-4">
              <button
                onClick={() => setShowC1Modal(false)}
                className="py-2 px-4 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Lembar C1</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
