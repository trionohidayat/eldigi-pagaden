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

  it('harus menampilkan nomor dan nama kandidat yang dipilih pada struk', () => {
    const html = renderToStaticMarkup(
      React.createElement(ThermalReceipt, {
        lastVote: mockLastVote,
        onFinish: () => {},
        language: 'id'
      })
    );
    expect(html).toContain('NOMOR 2');
    expect(html).toContain('Uly Emarita AD');
    expect(html).toContain('PGD-TPS01-02-X7K9');
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
});
