import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { QRScannerGate, getCameraConstraints } from './QRScannerGate';
import { VoteProvider } from '@/context/VoteContext';

describe('QRScannerGate & Tablet Camera Support', () => {
  describe('getCameraConstraints', () => {
    it('harus secara default mengembalikan constraint kamera belakang (environment) untuk tablet', () => {
      const constraints = getCameraConstraints();
      expect(constraints).toEqual({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
    });

    it('harus mengembalikan constraint kamera belakang ketika parameter environment diberikan secara eksplisit', () => {
      const constraints = getCameraConstraints('environment');
      expect(constraints).toEqual({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
    });

    it('harus mengembalikan constraint kamera depan ketika parameter user diberikan', () => {
      const constraints = getCameraConstraints('user');
      expect(constraints).toEqual({
        video: {
          facingMode: { ideal: 'user' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
    });
  });

  describe('QRScannerGate Component Render (Ultra-Clean Kiosk View)', () => {
    it('harus merender area viewfinder kamera ultra-clean dengan target frame hijau dan animasi laser', () => {
      const onAuthorized = vi.fn();
      const html = renderToStaticMarkup(
        React.createElement(
          VoteProvider,
          null,
          React.createElement(QRScannerGate, { onAuthorized })
        )
      );

      // Target badge di tengah frame kamera
      expect(html).toContain('Letakkan QR code di dalam frame');
      // Sudut L-shapes hijau dan garis laser
      expect(html).toContain('border-[#22c55e]');
      expect(html).toContain('scanner-laser');
      // Elemen video dan canvas
      expect(html).toContain('<video');
      expect(html).toContain('<canvas');
    });

    it('harus memastikan semua elemen yang disilang merah benar-benar terhapus dari tampilan bilik suara', () => {
      const onAuthorized = vi.fn();
      const html = renderToStaticMarkup(
        React.createElement(
          VoteProvider,
          null,
          React.createElement(QRScannerGate, { onAuthorized })
        )
      );

      // 1. Header atas tidak boleh ada
      expect(html).not.toContain('SURAT SUARA DIGITAL');
      expect(html).not.toContain('PEMILIHAN KEPALA DESA PAGADEN');
      expect(html).not.toContain('Google Voice: Aktif');
      expect(html).not.toContain('Langkah 1: Pindai Kartu Suara Pemilih');

      // 2. Info card mengambang di atas kamera tidak boleh ada
      expect(html).not.toContain('Arahkan kamera ke QR code');
      expect(html).not.toContain('Pastikan QR code terlihat jelas');
      expect(html).not.toContain('Total pemilih:');

      // 3. Pill status bawah di dalam kamera tidak boleh ada
      expect(html).not.toContain('Siap melakukan pemindaian');

      // 4. Panel kontrol bawah di luar kamera tidak boleh ada
      expect(html).not.toContain('Kamera Belakang (Tablet)');
      expect(html).not.toContain('Ganti Kamera');
      expect(html).not.toContain('Scan dengan USB scanner');
      expect(html).not.toContain('Verifikasi');
      expect(html).not.toContain('Simulasi Cepat (Pilih Warga DPT):');
      expect(html).not.toContain('Cetak Kartu QR');
    });

    it('harus merender container viewfinder kamera berukuran optimal dan berpusat', () => {
      const onAuthorized = vi.fn();
      const html = renderToStaticMarkup(
        React.createElement(
          VoteProvider,
          null,
          React.createElement(QRScannerGate, { onAuthorized })
        )
      );

      expect(html).toContain('max-w-5xl');
      expect(html).toContain('aspect-[4/3]');
    });
  });
});
