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
});
