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

    // Verify QRScannerGate is rendered with clean kiosk viewfinder
    expect(html).toContain('Letakkan QR code di dalam frame');
    expect(html).toContain('scanner-laser');
    expect(html).toContain('Menu Petugas KPPS');
  });
});
