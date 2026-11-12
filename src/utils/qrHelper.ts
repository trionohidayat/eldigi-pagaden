import QRCode from 'qrcode';

/**
 * Extracts and sanitizes NIK from scanned QR raw content.
 * Supports raw 16-digit NIK, JSON { nik: '...' }, or prefixed strings like "NIK: ...".
 */
export function extractNikFromQR(raw: string): string {
  if (!raw) return '';
  const trimmed = raw.trim();

  // Try parsing JSON format
  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && parsed.nik) {
      return String(parsed.nik).trim();
    }
  } catch {
    // Not JSON, continue with regex
  }

  // Find 16-digit sequence typical for Indonesian NIK
  const match = trimmed.match(/\b\d{16}\b/);
  if (match) {
    return match[0];
  }

  // Fallback to removing all non-digits if length matches
  const digitsOnly = trimmed.replace(/\D/g, '');
  if (digitsOnly.length === 16) {
    return digitsOnly;
  }

  return trimmed;
}

/**
 * Generates an SVG string representation of a QR Code for high-resolution printing.
 */
export async function generateQRCodeSVG(text: string): Promise<string> {
  return QRCode.toString(text, {
    type: 'svg',
    margin: 1,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });
}

/**
 * Generates a base64 Data URL representation of a QR Code for <img> tags.
 */
export async function generateQRCodeDataURL(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    margin: 1,
    width: 256,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });
}
