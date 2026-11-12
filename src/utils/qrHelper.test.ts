import { describe, it, expect } from 'vitest';
import { extractNikFromQR, generateQRCodeSVG, generateQRCodeDataURL } from './qrHelper';

describe('qrHelper utility', () => {
  it('harus mengekstrak NIK dari raw string 16 digit', () => {
    const raw = '3211012801750001';
    expect(extractNikFromQR(raw)).toBe('3211012801750001');
  });

  it('harus mengekstrak NIK dari format JSON payload', () => {
    const jsonStr = JSON.stringify({ nik: '3211015504820002', name: 'Siti Aminah' });
    expect(extractNikFromQR(jsonStr)).toBe('3211015504820002');
  });

  it('harus mengekstrak NIK dari string berawalan teks NIK:', () => {
    const raw = 'NIK: 3211011209990003 - TPS 01';
    expect(extractNikFromQR(raw)).toBe('3211011209990003');
  });

  it('harus menghasilkan kode QR dalam format SVG', async () => {
    const svg = await generateQRCodeSVG('3211012801750001');
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
  });

  it('harus menghasilkan kode QR dalam format DataURL', async () => {
    const dataUrl = await generateQRCodeDataURL('3211012801750001');
    expect(dataUrl).toMatch(/^data:image\/png;base64,/);
  });
});
