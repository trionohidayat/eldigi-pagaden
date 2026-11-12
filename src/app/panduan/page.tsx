'use client';

import React from 'react';
import Link from 'next/link';
import { useVote } from '@/context/VoteContext';
import {
  BookOpen,
  CheckCircle2,
  HandMetal,
  Printer,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  Vote,
  Sparkles
} from 'lucide-react';

export default function PanduanPage() {
  const { language } = useVote();

  const steps = [
    {
      step: '1',
      title: language === 'su' ? 'Daptar di Méja KPPS' : 'Daftar di Meja KPPS',
      desc:
        language === 'su'
          ? 'Tunjukkeun KTP atanapi serat uleman ka patugas KPPS. Patugas bakal mariksa nami anjeun dina daptar DPT.'
          : 'Tunjukkan e-KTP atau formulir C6 undangan kepada petugas KPPS. Petugas akan mencocokkan data Anda pada daftar pemilih (DPT).',
      badge: language === 'su' ? 'Léngkah Kahiji' : 'Langkah 1',
      color: 'bg-sky-600',
      audioText:
        'Langkah 1. Datang ke TPS membawa e-KTP atau undangan, lalu daftarkan diri di meja petugas KPPS.'
    },
    {
      step: '2',
      title: language === 'su' ? 'Toel Foto Calon di Layar' : 'Sentuh Foto Calon di Layar',
      desc:
        language === 'su'
          ? 'Lebet ka bilik sora. Di payuneun anjeun aya layar toel (tablet). Toel foto atanapi nomer calon Kuwu anu dipikahoyong.'
          : 'Masuk ke bilik suara. Di hadapan Anda tersedia layar sentuh tablet. Sentuh (toel) foto atau nomor urut calon Kepala Desa pilihan Anda.',
      badge: language === 'su' ? 'Léngkah Kadua' : 'Langkah 2',
      color: 'bg-emerald-600',
      audioText:
        'Langkah 2. Masuk ke bilik suara dan sentuh foto calon Kepala Desa pilihan Anda pada layar monitor.'
    },
    {
      step: '3',
      title: language === 'su' ? 'Konfirmasi Pilihan (Tombol Hejo)' : 'Konfirmasi Pilihan (Tombol Hijau)',
      desc:
        language === 'su'
          ? 'Layar bakal nampilkeun konfirmasi. Upami parantos leres, toel tombol hejo LERES. Upami lepat, toel tombol BATAL kanggo ngulang.'
          : 'Layar akan memunculkan dialog konfirmasi. Jika sudah mantap, tekan tombol hijau YA. Jika ingin mengganti, tekan tombol BATAL untuk memilih ulang.',
      badge: language === 'su' ? 'Léngkah Katilu' : 'Langkah 3',
      color: 'bg-amber-600',
      audioText:
        'Langkah 3. Periksa nama calon di layar konfirmasi. Tekan tombol hijau YA jika sudah yakin, atau tekan BATAL jika ingin memilih ulang.'
    },
    {
      step: '4',
      title:
        language === 'su'
          ? 'Candak Struk & Celupkeun Ramo kana Mangsi'
          : 'Ambil Struk & Celupkan Jari ke Tinta',
      desc:
        language === 'su'
          ? 'Struk kertas bakal kaluar otomatis tina printer. Candak strukna, lebetkeun kana kotak sora fisik, teras celupkeun ramo kana mangsi biru.'
          : 'Struk kertas fisik akan tercetak otomatis. Ambil struk tersebut, lipat, masukkan ke kotak suara fisik, lalu celupkan jari ke tinta tanda telah memilih.',
      badge: language === 'su' ? 'Léngkah Kaopat' : 'Langkah 4',
      color: 'bg-indigo-600',
      audioText:
        'Langkah 4. Ambil struk bukti pemilihan, masukkan ke kotak suara fisik, lalu celupkan jari Anda ke tinta pemilu.'
    }
  ];

  const faqs = [
    {
      q: 'Upami abdi lepat noel foto, naha tiasa digentos?',
      qId: 'Bagaimana jika saya salah menyentuh foto calon?',
      a: 'Bisa pisan! Saatos anjeun noel foto, sistem bakal naroskeun heula dina layar konfirmasi. Upami salah, kantun toel tombol abu-abu BATAL / PILIH DEUI sarta anjeun tiasa milih deui calon anu leres.',
      aId: 'Sangat bisa! Setelah menyentuh foto, sistem akan menampilkan jendela konfirmasi terlebih dahulu. Jika salah sentuh, cukup tekan tombol BATAL / PILIH ULANG dan Anda bisa memilih kembali foto yang benar.'
    },
    {
      q: 'Naha sora abdi tiasa kanyahoan ku batur?',
      qId: 'Apakah pilihan saya bisa diketahui oleh orang lain atau panitia?',
      a: 'Henteu pisan! Sistem e-voting ieu ngajamin prinsip RAHASIA. Data identitas pemilih di meja KPPS dipisahkeun sacara otomatis tina data sora anu dipilih di bilik.',
      aId: 'Sama sekali tidak! Sistem e-voting menjamin asas RAHASIA. Data pendaftaran di meja KPPS dipisahkan secara otomatis dari pilihan calon di bilik suara, sehingga tidak ada yang bisa melihat siapa memilih siapa.'
    },
    {
      q: 'Kunaon bet aya keneh struk kertas anu kaluar?',
      qId: 'Mengapa masih ada struk kertas fisik yang keluar dari mesin?',
      a: 'Struk kertas ieu namina VVPAT (Voter Verified Paper Audit Trail). Gunana nyaeta supados aya bukti fisik asli anu tiasa diitung sacara manual upami aya sengketa atanapi mamang.',
      aId: 'Struk kertas fisik ini disebut VVPAT (Voter Verified Paper Audit Trail). Tujuannya adalah sebagai bukti fisik berwujud nyata yang dimasukkan ke kotak suara agar dapat dihitung ulang secara manual jika sewaktu-waktu ada sengketa.'
    },
    {
      q: 'Kumaha upami di desa pareum lampu (mati listrik)?',
      qId: 'Bagaimana jika listrik di desa padam saat pemilihan?',
      a: 'Perangkat tablet bilik sora parantos dilengkepan ku batere internal anu tiasa tahan dugi ka sababaraha jam, sarta data sora parantos kasimpen sacara aman di jero memori lokal.',
      aId: 'Perangkat tablet bilik suara telah dilengkapi baterai internal yang tahan berjam-jam, dan data suara tersimpan aman di memori lokal perangkat tanpa perlu khawatir hilang saat listrik padam.'
    }
  ];

  return (
    <div className="flex-1 bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 text-center max-w-3xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-purple-600/30 mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold text-purple-700 uppercase tracking-widest bg-purple-100 px-3 py-1 rounded-full">
            Sosialisasi Warga Desa Pagaden
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mt-3">
            {language === 'su'
              ? '4 Léngkah Gampil Milih Kuwu Digital'
              : '4 Langkah Mudah Memilih Kepala Desa Digital'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl mx-auto">
            {language === 'su'
              ? 'Henteu kedah sieun atanapi hariwang, milih kuwu nganggo layar toel teh langkung gampil, gancang, sarta beresih.'
              : 'Tidak perlu takut atau cemas, memilih kepala desa menggunakan layar sentuh jauh lebih praktis, cepat, dan bersih.'}
          </p>
        </div>

        {/* 4 Steps Roadmap */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map(s => (
            <div
              key={s.step}
              className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow ${s.color}`}
                  >
                    {s.step}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase">{s.badge}</span>
                </div>

                <h3 className="text-xl font-black text-slate-900">{s.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">{s.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Sangat Mudah &amp; Cepat</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA to practice in the booth */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-black">
              {language === 'su' ? 'Hayu Praktékkeun Ayeuna!' : 'Ayo Praktikkan Sekarang!'}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-lg">
              {language === 'su'
                ? 'Langsung cobi toel foto calon dina layar bilik sora simulasi supados langkung paham.'
                : 'Langsung coba sentuh foto calon pada layar bilik suara simulasi agar semakin percaya diri.'}
            </p>
          </div>

          <Link
            href="/bilik"
            className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg shadow-amber-500/25 transition active:scale-95 flex-shrink-0"
          >
            <Vote className="w-5 h-5" />
            <span>{language === 'su' ? 'Buka Kamar Sora' : 'Buka Bilik Suara'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2.5 mb-6">
            <HelpCircle className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {language === 'su'
                ? 'Patarosan Anu Kerap Ditaroskeun ku Wargi'
                : 'Pertanyaan yang Sering Diajukan Warga'}
            </h2>
          </div>

          <div className="space-y-4 divide-y divide-slate-100">
            {faqs.map((faq, idx) => (
              <div key={idx} className="pt-4 first:pt-0">
                <h4 className="font-bold text-sm sm:text-base text-slate-900 flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">Q:</span>
                  <span>{language === 'su' ? faq.q : faq.qId}</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 pl-6 leading-relaxed">
                  {language === 'su' ? faq.a : faq.aId}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
