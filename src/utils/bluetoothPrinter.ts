/**
 * Web Bluetooth and Web Serial Manager for Thermal Receipt Printers (VSC TM-58V, 58mm)
 */

import { LastVoteInfo } from '@/context/VoteContext';
import { createVVPATReceiptBytes, createTestReceiptBytes } from './escposHelper';

// Standard 16-bit / 128-bit Bluetooth Service UUIDs for thermal POS printers
export const PRINTER_SERVICE_UUIDS = [
  '000018f0-0000-1000-8000-00805f9b34fb', // Standard 0x18F0 service
  '0000ffe0-0000-1000-8000-00805f9b34fb', // Standard 0xFFE0 / HM-10 service
  '0000ff00-0000-1000-8000-00805f9b34fb', // Generic 0xFF00 vendor serial service
  '49535343-fe7d-4ae5-8fa9-9fafd205e455', // ISSC transparent UART
  'e7810a71-73ae-499d-8c15-faa9aef0c3f2', // POS thermal printer service
  '0000ae00-0000-1000-8000-00805f9b34fb',
  '0000af00-0000-1000-8000-00805f9b34fb'
];

// Minimal Web Bluetooth API types when @types/web-bluetooth is not globally installed
interface BluetoothCharacteristicProperties {
  write?: boolean;
  writeWithoutResponse?: boolean;
}

interface BluetoothRemoteGATTCharacteristic {
  properties: BluetoothCharacteristicProperties;
  writeValueWithoutResponse?(data: BufferSource): Promise<void>;
  writeValue?(data: BufferSource): Promise<void>;
}

interface BluetoothRemoteGATTServer {
  connected: boolean;
  connect(): Promise<BluetoothRemoteGATTServer>;
  disconnect(): void;
  getPrimaryService(service: string): Promise<BluetoothRemoteGATTService>;
  getPrimaryServices(): Promise<BluetoothRemoteGATTService[]>;
}

interface BluetoothRemoteGATTService {
  getCharacteristics(): Promise<BluetoothRemoteGATTCharacteristic[]>;
}

interface BluetoothDevice extends EventTarget {
  name?: string;
  gatt?: BluetoothRemoteGATTServer;
  addEventListener(type: string, listener: (this: BluetoothDevice, ev: Event) => void): void;
}

interface SerialPortLike {
  open(options: { baudRate: number }): Promise<void>;
  close(): Promise<void>;
  readable?: unknown;
  writable?: {
    getWriter(): {
      write(data: Uint8Array): Promise<void>;
      releaseLock(): void;
    };
  };
}

interface ExtendedNavigator {
  bluetooth?: {
    requestDevice(options: {
      acceptAllDevices?: boolean;
      optionalServices?: string[];
    }): Promise<BluetoothDevice>;
  };
  serial?: {
    requestPort(): Promise<SerialPortLike>;
  };
}

interface BluetoothConnection {
  device: BluetoothDevice;
  characteristic: BluetoothRemoteGATTCharacteristic;
}

// Global active connection reference in browser session
let activeBluetoothConnection: BluetoothConnection | null = null;
let activeSerialPort: SerialPortLike | null = null;

// Helper to access navigator with Web Bluetooth and Web Serial
function getNavigator(): ExtendedNavigator | null {
  return typeof navigator !== 'undefined' ? (navigator as unknown as ExtendedNavigator) : null;
}

/**
 * Check if Web Bluetooth API is supported by the current browser
 */
export function isBluetoothSupported(): boolean {
  const nav = getNavigator();
  return Boolean(nav && 'bluetooth' in nav);
}

/**
 * Check if Web Serial API is supported (for USB cable connection on VSC TM-58V)
 */
export function isSerialSupported(): boolean {
  const nav = getNavigator();
  return Boolean(nav && 'serial' in nav);
}

/**
 * Connect to Bluetooth Thermal Printer (e.g. VSC TM-58V)
 */
export async function connectBluetoothPrinter(): Promise<{
  success: boolean;
  deviceName?: string;
  error?: string;
}> {
  if (!isBluetoothSupported()) {
    return {
      success: false,
      error: 'Web Bluetooth tidak didukung pada peramban ini. Gunakan Google Chrome atau Microsoft Edge.'
    };
  }

  try {
    // Disconnect existing if any
    if (activeBluetoothConnection?.device?.gatt?.connected) {
      activeBluetoothConnection.device.gatt.disconnect();
    }
    activeBluetoothConnection = null;

    // Prompt user to select Bluetooth device (accept all devices to easily find VSC TM-58V)
    const nav = getNavigator();
    if (!nav?.bluetooth) {
      return { success: false, error: 'Web Bluetooth tidak tersedia.' };
    }
    const device = await nav.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: PRINTER_SERVICE_UUIDS
    });

    if (!device.gatt) {
      return { success: false, error: 'Perangkat tidak memiliki GATT Server.' };
    }

    const server = await device.gatt.connect();

    // Find the writable characteristic across advertised services
    let writeChar: BluetoothRemoteGATTCharacteristic | null = null;

    for (const serviceUuid of PRINTER_SERVICE_UUIDS) {
      try {
        const service = await server.getPrimaryService(serviceUuid);
        const characteristics = await service.getCharacteristics();

        for (const char of characteristics) {
          if (char.properties.write || char.properties.writeWithoutResponse) {
            writeChar = char;
            break;
          }
        }
        if (writeChar) break;
      } catch {
        // Continue searching other service UUIDs
      }
    }

    // Fallback: search any primary service if specified UUIDs did not match
    if (!writeChar) {
      try {
        const services = await server.getPrimaryServices();
        for (const service of services) {
          const characteristics = await service.getCharacteristics();
          for (const char of characteristics) {
            if (char.properties.write || char.properties.writeWithoutResponse) {
              writeChar = char;
              break;
            }
          }
          if (writeChar) break;
        }
      } catch {}
    }

    if (!writeChar) {
      return {
        success: false,
        deviceName: device.name || 'Printer Bluetooth',
        error: 'Karakteristik cetak tulis (Write Characteristic) tidak ditemukan pada printer ini.'
      };
    }

    activeBluetoothConnection = {
      device,
      characteristic: writeChar
    };

    device.addEventListener('gattserverdisconnected', () => {
      activeBluetoothConnection = null;
    });

    return {
      success: true,
      deviceName: device.name || 'VSC TM-58V'
    };
  } catch (err: unknown) {
    const error = err as { name?: string; message?: string } | undefined;
    if (error?.name === 'NotFoundError') {
      return { success: false, error: 'Pencarian printer dibatalkan oleh pengguna.' };
    }
    return {
      success: false,
      error: error?.message || 'Gagal menghubungkan ke printer Bluetooth.'
    };
  }
}

/**
 * Connect to Thermal Printer via USB Cable (Web Serial API)
 */
export async function connectSerialPrinter(baudRate = 9600): Promise<{
  success: boolean;
  deviceName?: string;
  error?: string;
}> {
  if (!isSerialSupported()) {
    return {
      success: false,
      error: 'Web Serial tidak didukung pada peramban ini.'
    };
  }

  try {
    const nav = getNavigator();
    if (!nav?.serial) {
      return { success: false, error: 'Web Serial tidak tersedia.' };
    }
    const port = await nav.serial.requestPort();
    await port.open({ baudRate });
    activeSerialPort = port;

    return {
      success: true,
      deviceName: 'VSC TM-58V (USB Serial)'
    };
  } catch (err: unknown) {
    const error = err as Error | undefined;
    return {
      success: false,
      error: error?.message || 'Gagal menghubungkan via kabel USB.'
    };
  }
}

/**
 * Disconnect any active printer connection
 */
export function disconnectPrinter(): void {
  try {
    if (activeBluetoothConnection?.device?.gatt?.connected) {
      activeBluetoothConnection.device.gatt.disconnect();
    }
  } catch {}
  activeBluetoothConnection = null;

  try {
    if (activeSerialPort) {
      activeSerialPort.close();
    }
  } catch {}
  activeSerialPort = null;
}

/**
 * Check if a printer is currently connected
 */
export function isPrinterConnected(): boolean {
  if (activeBluetoothConnection?.device?.gatt?.connected) {
    return true;
  }
  if (activeSerialPort && activeSerialPort.readable) {
    return true;
  }
  return false;
}

/**
 * Get current connected device name
 */
export function getConnectedDeviceName(): string | null {
  if (activeBluetoothConnection?.device?.gatt?.connected) {
    return activeBluetoothConnection.device.name || 'VSC TM-58V (Bluetooth)';
  }
  if (activeSerialPort) {
    return 'VSC TM-58V (USB Serial)';
  }
  return null;
}

/**
 * Send raw binary bytes to printer in safe chunks (preventing BLE MTU buffer overrun)
 */
export async function sendBytesToPrinter(data: Uint8Array): Promise<{ success: boolean; error?: string }> {
  // Option 1: Bluetooth GATT
  if (activeBluetoothConnection?.device?.gatt?.connected && activeBluetoothConnection.characteristic) {
    try {
      const char = activeBluetoothConnection.characteristic;
      const chunkSize = 64; // Safe chunk size for BLE 58mm printer microcontrollers
      for (let offset = 0; offset < data.length; offset += chunkSize) {
        const slice = data.slice(offset, offset + chunkSize);
        if (char.properties.writeWithoutResponse && char.writeValueWithoutResponse) {
          await char.writeValueWithoutResponse(slice);
        } else if (char.writeValue) {
          await char.writeValue(slice);
        }
        // Small delay between packets to ensure printer buffer processes smoothly
        await new Promise(r => setTimeout(r, 20));
      }
      return { success: true };
    } catch (err: unknown) {
      const error = err as Error | undefined;
      return { success: false, error: error?.message || 'Gagal mengirim data ke printer Bluetooth.' };
    }
  }

  // Option 2: Web Serial (USB)
  if (activeSerialPort && activeSerialPort.writable) {
    try {
      const writer = activeSerialPort.writable.getWriter();
      await writer.write(data);
      writer.releaseLock();
      return { success: true };
    } catch (err: unknown) {
      const error = err as Error | undefined;
      return { success: false, error: error?.message || 'Gagal mengirim data ke port serial USB.' };
    }
  }

  return {
    success: false,
    error: 'Printer Bluetooth belum terhubung. Silakan hubungkan printer terlebih dahulu.'
  };
}

/**
 * Print VVPAT receipt directly to connected thermal printer
 */
export async function printVVPATReceipt(
  lastVote: LastVoteInfo,
  voterName?: string
): Promise<{ success: boolean; error?: string }> {
  const bytes = createVVPATReceiptBytes(lastVote, voterName);
  return sendBytesToPrinter(bytes);
}

/**
 * Print diagnostic test receipt
 */
export async function printDiagnosticTest(): Promise<{ success: boolean; error?: string }> {
  const bytes = createTestReceiptBytes();
  return sendBytesToPrinter(bytes);
}
