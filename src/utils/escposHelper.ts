/**
 * ESC/POS Utility for 58mm Thermal Receipt Printers (e.g. VSC TM-58V)
 * Standard paper width: 58mm (32 characters per line in Font A)
 */

import { LastVoteInfo } from '@/context/VoteContext';

// Basic ESC/POS control byte constants
const ESC = 0x1b;
const GS = 0x1d;

/**
 * Format two strings into a 32-character single line (Left label + Right value)
 */
export function formatTwoColumns(left: string, right: string, maxCols = 32): string {
  const combinedLength = left.length + right.length;
  if (combinedLength >= maxCols) {
    return left.slice(0, maxCols - right.length - 1) + ' ' + right + '\n';
  }
  const spaces = ' '.repeat(maxCols - combinedLength);
  return left + spaces + right + '\n';
}

/**
 * Generates ESC/POS byte sequence for thermal receipt (58mm)
 */
export function createVVPATReceiptBytes(lastVote: LastVoteInfo, _voterName?: string): Uint8Array {
  void _voterName;
  const encoder = new TextEncoder();
  const buffer: number[] = [];

  const addBytes = (...bytes: number[]) => {
    buffer.push(...bytes);
  };

  const addText = (text: string) => {
    const encoded = encoder.encode(text);
    for (let i = 0; i < encoded.length; i++) {
      buffer.push(encoded[i]);
    }
  };

  // 1. Initialize printer (ESC @)
  addBytes(ESC, 0x40);

  // Set line spacing default (ESC 2)
  addBytes(ESC, 0x32);

  // 2. Center Align (ESC a 1)
  addBytes(ESC, 0x61, 0x01);

  // Double-height & bold header (GS ! 0x01 + ESC E 1)
  addBytes(ESC, 0x45, 0x01);
  addBytes(GS, 0x21, 0x01);
  addText('KABUPATEN SUBANG\n');
  addBytes(GS, 0x21, 0x00);
  addText('PILKADES PAGADEN\n');
  addBytes(ESC, 0x45, 0x00);

  addText('BUKTI SUARA DIGITAL (VVPAT)\n');
  addText('--------------------------------\n');

  // 3. Center Align for QR & Barcode (ESC a 1)
  addBytes(ESC, 0x61, 0x01);
  addBytes(ESC, 0x45, 0x01);
  addText('KODE HASH VERIFIKASI\n');
  addBytes(ESC, 0x45, 0x00);
  addText(`${lastVote.receiptCode}\n\n`);

  // Print native QR Code via ESC/POS (Model 2, size 5, Error correction L)
  const qrData = encoder.encode(lastVote.receiptCode);
  const pL = (qrData.length + 3) & 0xff;
  const pH = ((qrData.length + 3) >> 8) & 0xff;

  // QR Model 2 (GS ( k 04 00 31 41 32 00)
  addBytes(GS, 0x28, 0x6b, 0x04, 0x00, 0x31, 0x41, 0x32, 0x00);
  // QR Module Size 5 (GS ( k 03 00 31 43 05)
  addBytes(GS, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, 0x05);
  // QR Error Correction L (GS ( k 03 00 31 45 30)
  addBytes(GS, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x45, 0x30);
  // Store QR Data (GS ( k pL pH 31 50 30 <data>)
  addBytes(GS, 0x28, 0x6b, pL, pH, 0x31, 0x50, 0x30, ...qrData);
  // Print QR Data (GS ( k 03 00 31 51 30)
  addBytes(GS, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x51, 0x30);

  addText('\n');

  // Barcode (CODE128): Height 48, Width 2, HRI text below
  addBytes(GS, 0x68, 48); // Height
  addBytes(GS, 0x77, 2); // Width
  addBytes(GS, 0x48, 2); // HRI Below
  addBytes(GS, 0x66, 0); // Font A
  // CODE128 command (GS k 73 len data)
  const barcodeData = encoder.encode(lastVote.receiptCode);
  addBytes(GS, 0x6b, 73, barcodeData.length, ...barcodeData);

  addText('\n--------------------------------\n');
  addText('Struk fisik ini adalah bukti sah\npilihan Anda. Lipat & masukkan\nke dalam kotak suara fisik.\n');
  addText('================================\n');

  // Feed 4 lines for easy tear-off on VSC TM-58V (ESC d 4)
  addBytes(ESC, 0x64, 0x04);

  // Partial cut / full cut if cutter hardware present (GS V 0)
  addBytes(GS, 0x56, 0x00);

  return new Uint8Array(buffer);
}

/**
 * Generates ESC/POS test receipt for printer diagnostic
 */
export function createTestReceiptBytes(): Uint8Array {
  const encoder = new TextEncoder();
  const buffer: number[] = [];

  const addBytes = (...bytes: number[]) => {
    buffer.push(...bytes);
  };
  const addText = (text: string) => {
    const encoded = encoder.encode(text);
    for (let i = 0; i < encoded.length; i++) {
      buffer.push(encoded[i]);
    }
  };

  addBytes(ESC, 0x40); // Init
  addBytes(ESC, 0x61, 0x01); // Center
  addBytes(ESC, 0x45, 0x01); // Bold
  addText('UJI COBA PRINTER THERMAL\n');
  addText('VSC TM-58V (58mm)\n');
  addBytes(ESC, 0x45, 0x00); // Bold off

  const now = new Date().toLocaleString('id-ID');
  addText(`Waktu Uji: ${now}\n`);
  addText('--------------------------------\n');
  addText('Koneksi Bluetooth / USB: AKTIF\n');
  addText('Sistem Siap Digunakan di TPS\n');
  addText('--------------------------------\n\n');

  // Test barcode
  addBytes(GS, 0x68, 40);
  addBytes(GS, 0x77, 2);
  addBytes(GS, 0x48, 2);
  const testCode = encoder.encode('VSC-TM58V-OK');
  addBytes(GS, 0x6b, 73, testCode.length, ...testCode);

  addBytes(ESC, 0x64, 0x04); // Feed 4 lines
  addBytes(GS, 0x56, 0x00);

  return new Uint8Array(buffer);
}
