import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import BilikSuaraPage from './page';
import { VoteProvider } from '@/context/VoteContext';

describe('BilikSuaraPage Component', () => {
  it('secara default merender QRScannerGate saat belum ada pemilih yang memindai kartu QR', () => {
    const html = renderToStaticMarkup(
      React.createElement(
        VoteProvider,
        null,
        React.createElement(BilikSuaraPage)
      )
    );

    // Verify QRScannerGate is rendered
    expect(html).toContain('SURAT SUARA DIGITAL');
    expect(html).toContain('Arahkan QR Code ke Kamera');
    expect(html).toContain('Langkah 1: Pindai Kartu Suara Pemilih');
  });
});
