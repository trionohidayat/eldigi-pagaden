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
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
    });

    it('harus mengembalikan constraint kamera belakang ketika parameter environment diberikan secara eksplisit', () => {
      const constraints = getCameraConstraints('environment');
      expect(constraints).toEqual({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
    });

    it('harus mengembalikan constraint kamera depan ketika parameter user diberikan', () => {
      const constraints = getCameraConstraints('user');
      expect(constraints).toEqual({
        video: {
          facingMode: { ideal: 'user' },
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
    });
  });

  describe('QRScannerGate Component Render', () => {
    it('harus merender judul Surat Suara Digital dan petunjuk scan kartu', () => {
      const onAuthorized = vi.fn();
      const html = renderToStaticMarkup(
        React.createElement(
          VoteProvider,
          null,
          React.createElement(QRScannerGate, { onAuthorized })
        )
      );

      expect(html).toContain('SURAT SUARA DIGITAL');
      expect(html).toContain('Langkah 1: Pindai Kartu Suara Pemilih');
      expect(html).toContain('Arahkan QR Code ke Kamera');
    });

    it('harus menampilkan indikator Kamera Belakang (Tablet) secara default', () => {
      const onAuthorized = vi.fn();
      const html = renderToStaticMarkup(
        React.createElement(
          VoteProvider,
          null,
          React.createElement(QRScannerGate, { onAuthorized })
        )
      );

      expect(html).toContain('Kamera Belakang (Tablet)');
      expect(html).toContain('Ganti Kamera');
    });

    it('harus merender form input NIK manual / barcode USB scanner', () => {
      const onAuthorized = vi.fn();
      const html = renderToStaticMarkup(
        React.createElement(
          VoteProvider,
          null,
          React.createElement(QRScannerGate, { onAuthorized })
        )
      );

      expect(html).toContain('Scan dengan USB scanner / ketik NIK...');
      expect(html).toContain('Verifikasi');
    });

    it('harus merender tombol simulasi cepat daftar warga DPT', () => {
      const onAuthorized = vi.fn();
      const html = renderToStaticMarkup(
        React.createElement(
          VoteProvider,
          null,
          React.createElement(QRScannerGate, { onAuthorized })
        )
      );

      expect(html).toContain('Simulasi Cepat (Pilih Warga DPT):');
      expect(html).toContain('Cetak Kartu QR');
    });

    it('harus merender tombol toggle fitur Google Voice di header pemindai', () => {
      const onAuthorized = vi.fn();
      const html = renderToStaticMarkup(
        React.createElement(
          VoteProvider,
          null,
          React.createElement(QRScannerGate, { onAuthorized })
        )
      );

      expect(html).toContain('Google Voice: Aktif');
    });
  });
});
