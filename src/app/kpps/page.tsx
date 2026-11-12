'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useVote } from '@/context/VoteContext';
import { Voter } from '@/data/dpt';
import {
  Users,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  UserCheck,
  BadgeCheck,
  Building2,
  Filter
} from 'lucide-react';

export default function KPPSPage() {
  const { voters, authorizeVoter, activeVoter, language, tpsConfig } = useVote();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDusun, setFilterDusun] = useState('Semua');
  const [successModal, setSuccessModal] = useState<Voter | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const dusunList = [
    'Semua',
    'Dusun I Krajan',
    'Dusun II Pagaden',
    'Dusun III Sukamaju',
    'Dusun IV Mekarwangi'
  ];

  const filteredVoters = voters.filter(voter => {
    const matchesSearch =
      voter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voter.nik.includes(searchQuery);
    const matchesDusun = filterDusun === 'Semua' || voter.dusun === filterDusun;
    return matchesSearch && matchesDusun;
  });

  const totalDPT = voters.length;
  const sudahMemilih = voters.filter(v => v.status === 'sudah_memilih').length;
  const sedangDiBilik = voters.filter(v => v.status === 'hadir').length;
  const belumHadir = voters.filter(v => v.status === 'belum').length;
  const partisipasi = totalDPT > 0 ? Math.round((sudahMemilih / totalDPT) * 100) : 0;

  const handleAuthorize = (voter: Voter) => {
    setErrorNotice(null);
    if (voter.status === 'sudah_memilih') {
      setErrorNotice(
        `Warga atas nama "${voter.name}" sudah menggunakan hak suara pada pukul ${voter.votedAt || 'tadi'}. Sistem mencegah pemilihan ganda (Anti-Double Voting).`
      );
      return;
    }

    const ok = authorizeVoter(voter.nik);
    if (ok) {
      const authorized = voters.find(v => v.nik === voter.nik);
      setSuccessModal(authorized || voter);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-lg shadow-sky-600/30 flex-shrink-0">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-sky-100 text-sky-800 text-xs font-bold px-2 py-0.5 rounded-full">
                  Meja Pendaftaran
                </span>
                <span className="text-xs font-bold text-slate-500 uppercase">
                  {tpsConfig.tpsNumber} • {tpsConfig.desa}
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 mt-0.5">
                Verifikasi DPT &amp; Registrasi Pemilih
              </h1>
            </div>
          </div>

          <Link
            href="/bilik"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/20 transition active:scale-95"
          >
            <span>Buka Layar Bilik Suara</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500">Total DPT Simulasi</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{totalDPT}</div>
            <span className="text-[11px] text-slate-400">Pemilih Terdaftar</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-emerald-600">Sudah Memilih</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">{sudahMemilih}</div>
            <span className="text-[11px] text-emerald-600 font-medium">Suara Masuk Sah</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-sky-600">Sedang Di Bilik</span>
            <div className="text-2xl sm:text-3xl font-black text-sky-700 mt-1">{sedangDiBilik}</div>
            <span className="text-[11px] text-sky-600 font-medium">Membawa Token</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500">Tingkat Partisipasi</span>
            <div className="text-2xl sm:text-3xl font-black text-indigo-700 mt-1">{partisipasi}%</div>
            <span className="text-[11px] text-slate-400">Kehadiran Warga</span>
          </div>
        </div>

        {/* Notice on Double Voting Error */}
        {errorNotice && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in">
            <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">Peringatan Integritas Suara: </span>
              <span>{errorNotice}</span>
            </div>
            <button
              onClick={() => setErrorNotice(null)}
              className="text-rose-500 hover:text-rose-700 font-bold text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari Nama warga atau NIK..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Filter by Dusun */}
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
              {dusunList.map(dusun => (
                <button
                  key={dusun}
                  onClick={() => setFilterDusun(dusun)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    filterDusun === dusun
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {dusun}
                </button>
              ))}
            </div>
          </div>

          {/* DPT Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Nama Lengkap</th>
                  <th className="py-3 px-4">NIK (Simulasi)</th>
                  <th className="py-3 px-4">Wilayah Dusun</th>
                  <th className="py-3 px-4">RT/RW</th>
                  <th className="py-3 px-4">Status Hak Suara</th>
                  <th className="py-3 px-4 text-center">Aksi Petugas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVoters.map((voter, idx) => (
                  <tr key={voter.nik} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </span>
                        <div>
                          <div>{voter.name}</div>
                          <span className="text-[10px] text-slate-400">
                            {voter.gender === 'L' ? 'Laki-laki' : 'Perempuan'} • {voter.age} Tahun
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {voter.nik.slice(0, 6)}******{voter.nik.slice(-4)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {voter.dusun}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      RT {voter.rt} / RW {voter.rw}
                    </td>
                    <td className="py-3.5 px-4">
                      {voter.status === 'sudah_memilih' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Sudah Memilih</span>
                        </span>
                      ) : voter.status === 'hadir' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
                          <Clock className="w-3.5 h-3.5 text-sky-600 animate-spin" />
                          <span>Di Bilik (Token #{voter.token || '...'})</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                          <span>Belum Hadir</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {voter.status === 'sudah_memilih' ? (
                        <span className="text-[11px] text-slate-400 italic font-mono">
                          {voter.votedAt}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAuthorize(voter)}
                          className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm shadow-sky-600/30 transition active:scale-95"
                        >
                          Panggil ke Bilik
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Sukses Otorisasi */}
      {successModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4">
              <UserCheck className="w-8 h-8" />
            </div>
            <h3 className="font-black text-slate-900 text-lg">Pemilih Diverifikasi!</h3>
            <p className="text-xs text-slate-500 mt-1">
              Data pemilih berhasil dicocokkan dengan DPT Desa Pagaden.
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 my-4 text-left space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Nama:</span>
                <span className="font-bold text-slate-900">{successModal.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Wilayah:</span>
                <span className="font-semibold text-slate-700">{successModal.dusun}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="text-slate-500">Token Bilik:</span>
                <span className="font-mono font-black text-sky-700 text-sm">
                  #{successModal.token || '7492'}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSuccessModal(null)}
                className="flex-1 py-2.5 px-3 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Tutup
              </button>
              <Link
                href="/bilik"
                onClick={() => setSuccessModal(null)}
                className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition"
              >
                <span>Masuk Bilik</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
