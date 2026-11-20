import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PrintableQRCards } from './PrintableQRCards';
import { VoteProvider } from '@/context/VoteContext';

describe('PrintableQRCards Component (Surat Undangan Pemungutan Suara C6)', () => {
  it('harus merender kop surat undangan dengan teks SURAT UNDANGAN PEMUNGUTAN SUARA KEPADA PEMILIH', () => {
    const html = renderToStaticMarkup(
      React.createElement(VoteProvider, null, React.createElement(PrintableQRCards))
    );
    expect(html).toContain('SURAT UNDANGAN');
    expect(html).toContain('PEMUNGUTAN SUARA');
    expect(html).toContain('KEPADA PEMILIH');
    expect(html).toContain('No Urut DPT');
    expect(html).toContain('SURAT UNDANGAN INI BERSIFAT RAHASIA');
    expect(html).toContain('Tunjukan QRcode berikut saat akan memilih');
    expect(html).toContain('Cetak Undangan');
  });

  it('harus memuat nama pemilih dari data DPT dan petunjuk posisi tangan/jempol', () => {
    const html = renderToStaticMarkup(
      React.createElement(VoteProvider, null, React.createElement(PrintableQRCards))
    );
    expect(html).toContain('Asep Saepuloh');
    expect(html).toContain('3211012801750001');
    expect(html).toContain('PANITIA PEMILIHAN');
    expect(html).toContain('Letakan posisi tangan ditengah-tengah ujung bawah persis seperti pada gambar untuk memudahkan proses scan QRCode');
  });
});
