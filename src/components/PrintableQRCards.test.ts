import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PrintableQRCards } from './PrintableQRCards';
import { VoteProvider } from '@/context/VoteContext';

describe('PrintableQRCards Component', () => {
  it('harus merender kop kartu pemilih dengan teks KARTU PEMILIH TETAP', () => {
    const html = renderToStaticMarkup(
      React.createElement(VoteProvider, null, React.createElement(PrintableQRCards))
    );
    expect(html).toContain('KARTU PEMILIH TETAP (DPT) DIGITAL');
    expect(html).toContain('PEMERINTAH KABUPATEN SUBANG');
    expect(html).toContain('Cetak Kartu');
  });

  it('harus memuat nama pemilih dari data DPT', () => {
    const html = renderToStaticMarkup(
      React.createElement(VoteProvider, null, React.createElement(PrintableQRCards))
    );
    expect(html).toContain('Asep Saepuloh');
    expect(html).toContain('3211012801750001');
  });
});
