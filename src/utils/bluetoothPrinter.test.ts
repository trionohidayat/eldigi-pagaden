import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  isBluetoothSupported,
  isSerialSupported,
  connectBluetoothPrinter,
  isPrinterConnected,
  disconnectPrinter,
  getConnectedDeviceName,
  sendBytesToPrinter
} from './bluetoothPrinter';

describe('bluetoothPrinter manager', () => {
  beforeEach(() => {
    disconnectPrinter();
    vi.restoreAllMocks();
  });

  it('mengembalikan status dukungan Web Bluetooth dan Web Serial di environment server/test', () => {
    expect(typeof isBluetoothSupported()).toBe('boolean');
    expect(typeof isSerialSupported()).toBe('boolean');
  });

  it('mengembalikan error yang jelas jika Web Bluetooth tidak tersedia di peramban saat connect dipanggil', async () => {
    // When navigator.bluetooth is not present in Node/test environment
    const res = await connectBluetoothPrinter();
    expect(res.success).toBe(false);
    expect(res.error).toBeDefined();
  });

  it('isPrinterConnected mengembalikan false jika belum terhubung', () => {
    expect(isPrinterConnected()).toBe(false);
    expect(getConnectedDeviceName()).toBeNull();
  });

  it('sendBytesToPrinter mengembalikan error jika printer belum terhubung', async () => {
    const res = await sendBytesToPrinter(new Uint8Array([0x1b, 0x40]));
    expect(res.success).toBe(false);
    expect(res.error).toContain('Printer Bluetooth belum terhubung');
  });
});
