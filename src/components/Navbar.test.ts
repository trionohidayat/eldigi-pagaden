import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Navbar } from './Navbar';
import { VoteProvider } from '@/context/VoteContext';

// Mock usePathname from next/navigation
const mockPathname = vi.fn();
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname()
}));

describe('Navbar Component Responsiveness & Navigation', () => {
  it('harus mengembalikan null ketika berada di halaman bilik suara (/bilik) atau root (/) agar mode kios hening & minimalis', () => {
    mockPathname.mockReturnValue('/bilik');

    const html = renderToStaticMarkup(
      React.createElement(VoteProvider, null, React.createElement(Navbar))
    );

    expect(html).toBe('');
  });

  it('harus merender navigasi lengkap dan menu responsif ketika berada di halaman /kpps', () => {
    mockPathname.mockReturnValue('/kpps');

    const html = renderToStaticMarkup(
      React.createElement(VoteProvider, null, React.createElement(Navbar))
    );

    // Verifikasi link kembali ke bilik
    expect(html).toContain('Kembali ke Surat Suara');
    expect(html).toContain('Bilik Suara');

    // Verifikasi link navigasi utama
    expect(html).toContain('Meja KPPS');
    expect(html).toContain('Rekapitulasi');
    expect(html).toContain('Panduan');
    expect(html).toContain('Cetak Kartu QR');

    // Verifikasi kontrol navigasi mobile responsif
    expect(html).toContain('Buka menu navigasi');
  });

  it('harus merender navigasi di halaman /rekapitulasi', () => {
    mockPathname.mockReturnValue('/rekapitulasi');

    const html = renderToStaticMarkup(
      React.createElement(VoteProvider, null, React.createElement(Navbar))
    );

    expect(html).toContain('Meja KPPS');
    expect(html).toContain('Rekapitulasi');
  });
});
