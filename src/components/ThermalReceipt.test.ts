import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThermalReceipt } from './ThermalReceipt';
import { LastVoteInfo } from '@/context/VoteContext';

describe('ThermalReceipt Component', () => {
  const mockLastVote: LastVoteInfo = {
    candidateId: 2,
    candidateNumber: '02',
    candidateName: 'Uly Emarita AD',
    candidateTitle: 'S.E., M.M.',
    timestamp: '13 Nov 2026, 06:00 WIB',
    receiptCode: 'PGD-TPS01-02-X7K9',
    tps: 'TPS 01 (Dusun I Krajan)',
    desa: 'Desa Pagaden, Kec. Pagaden'
  };

  it('harus merender halaman pencetakan struk suara dengan status pencetakan', () => {
    const html = renderToStaticMarkup(
      React.createElement(ThermalReceipt, {
        lastVote: mockLastVote,
        onFinish: () => {},
        language: 'id'
      })
    );
    expect(html).toContain('STRUK BUKTI SUARA DIGITAL (VVPAT)');
    expect(html).toContain('Sedang Mencetak Struk Suara (VVPAT)...');
  });

  it('harus merahasiakan pilihan kepala desa pada struk (tidak menampilkan nomor & nama calon, hanya QR/Barcode & kode hash)', () => {
    const html = renderToStaticMarkup(
      React.createElement(ThermalReceipt, {
        lastVote: mockLastVote,
        onFinish: () => {},
        language: 'id'
      })
    );
    // Asas Rahasia: Struk tidak menampilkan nomor kandidat, nama kandidat, atau teks PILIHAN KEPALA DESA
    expect(html).not.toContain('PILIHAN KEPALA DESA:');
    expect(html).not.toContain('NOMOR 2');
    expect(html).not.toContain('Uly Emarita AD');

    // Struk tetap memuat bukti verifikasi autentik berupa KODE HASH VERIFIKASI dan instruksi kotak suara
    expect(html).toContain('PGD-TPS01-02-X7K9');
    expect(html).toContain('KODE HASH VERIFIKASI');
    expect(html).toContain('PILKADES PAGADEN');
    expect(html).not.toContain('PILKADES DESA PAGADEN');
    expect(html).toContain('Struk fisik ini adalah bukti sah pilihan Anda');
  });

  it('harus menampilkan pesan TERIMA KASIH dan konfirmasi Pilihan Anda Tersimpan', () => {
    const html = renderToStaticMarkup(
      React.createElement(ThermalReceipt, {
        lastVote: mockLastVote,
        onFinish: () => {},
        language: 'id'
      })
    );
    expect(html).toContain('TERIMA KASIH');
    expect(html).toContain('Pilihan Anda Tersimpan');
    expect(html).toContain('Otomatis kembali ke halaman scan QR dalam');
    expect(html).toContain('5');
    expect(html).toContain('detik');
  });

  it('harus menampilkan nama pemilih jika parameter voterName disediakan', () => {
    const html = renderToStaticMarkup(
      React.createElement(ThermalReceipt, {
        lastVote: mockLastVote,
        voterName: 'Ahmad Subagja',
        onFinish: () => {},
        language: 'id'
      })
    );
    expect(html).toContain('Pemilih: Ahmad Subagja');
  });

  it('harus mendukung bahasa Sunda dengan teks HATUR NUHUN dan Pilihan Anjeun Parantos Kasimpen', () => {
    const html = renderToStaticMarkup(
      React.createElement(ThermalReceipt, {
        lastVote: mockLastVote,
        onFinish: () => {},
        language: 'su'
      })
    );
    expect(html).toContain('HATUR NUHUN');
    expect(html).toContain('Pilihan Anjeun Parantos Kasimpen');
  });

  it('harus menyediakan tombol koneksi printer Bluetooth VSC TM-58V', () => {
    const html = renderToStaticMarkup(
      React.createElement(ThermalReceipt, {
        lastVote: mockLastVote,
        onFinish: () => {},
        language: 'id'
      })
    );
    expect(html).toContain('Hubungkan Printer Bluetooth (VSC TM-58V)');
    expect(html).toContain('Cetak Fisik');
  });
});
