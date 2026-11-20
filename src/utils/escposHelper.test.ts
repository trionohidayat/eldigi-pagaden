import { describe, it, expect } from 'vitest';
import { formatTwoColumns, createVVPATReceiptBytes, createTestReceiptBytes } from './escposHelper';
import { LastVoteInfo } from '@/context/VoteContext';

describe('escposHelper for 58mm Thermal Receipt Printer (VSC TM-58V)', () => {
  const mockLastVote: LastVoteInfo = {
    candidateId: 2,
    candidateNumber: '02',
    candidateName: 'Uly Emarita AD',
    candidateTitle: '',
    timestamp: '20 Nov 2026, 18:36 WIB',
    receiptCode: 'PGD-TPS01-02-B7X9',
    tps: 'TPS 01 (Dusun I Krajan)',
    desa: 'Desa Pagaden, Kec. Pagaden'
  };

  it('formatTwoColumns memformat 2 teks rata kiri dan kanan tepat 32 karakter', () => {
    const formatted = formatTwoColumns('TPS:', 'TPS 01', 32);
    // remove trailing \n
    const line = formatted.replace('\n', '');
    expect(line.length).toBe(32);
    expect(line.startsWith('TPS:')).toBe(true);
    expect(line.endsWith('TPS 01')).toBe(true);
  });

  it('createVVPATReceiptBytes menghasilkan buffer biner ESC/POS yang valid', () => {
    const bytes = createVVPATReceiptBytes(mockLastVote, 'Cecep Supriatna');
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBeGreaterThan(50);

    // Initial ESC @ (0x1B, 0x40)
    expect(bytes[0]).toBe(0x1b);
    expect(bytes[1]).toBe(0x40);

    const textDecoder = new TextDecoder();
    const textOutput = textDecoder.decode(bytes);

    // Memuat identitas daerah & TPS
    expect(textOutput).toContain('KABUPATEN SUBANG');
    expect(textOutput).toContain('PILKADES DESA PAGADEN');
    expect(textOutput).toContain('BUKTI SUARA DIGITAL (VVPAT)');
    expect(textOutput).toContain('PGD-TPS01-02-B7X9');
    expect(textOutput).toContain('Cecep Supriatna');

    // Kerahasiaan suara terjamin: TIDAK memuat nama calon kades yang dipilih
    expect(textOutput).not.toContain('Uly Emarita AD');
    expect(textOutput).not.toContain('PILIHAN KEPALA DESA');
  });

  it('createTestReceiptBytes menghasilkan data uji coba printer', () => {
    const bytes = createTestReceiptBytes();
    expect(bytes).toBeInstanceOf(Uint8Array);
    const textOutput = new TextDecoder().decode(bytes);
    expect(textOutput).toContain('UJI COBA PRINTER THERMAL');
    expect(textOutput).toContain('VSC TM-58V');
  });
});
