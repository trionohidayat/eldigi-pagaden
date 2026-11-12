import { describe, it, expect } from 'vitest';
import { INITIAL_DPT } from './dpt';

describe('DPT Simulasi Desa Pagaden', () => {
  it('harus memuat data pemilih simulasi awal yang tidak kosong', () => {
    expect(INITIAL_DPT.length).toBeGreaterThan(0);
  });

  it('setiap pemilih harus memiliki NIK 16 digit yang unik', () => {
    const niks = INITIAL_DPT.map(v => v.nik);
    expect(new Set(niks).size).toBe(INITIAL_DPT.length);
    niks.forEach(nik => {
      expect(nik).toHaveLength(16);
      expect(/^\d{16}$/.test(nik)).toBe(true);
    });
  });

  it('semua pemilih awal harus berstatus "belum" memilih', () => {
    INITIAL_DPT.forEach(v => {
      expect(v.status).toBe('belum');
    });
  });

  it('pemilih harus mewakili dusun-dusun di Desa Pagaden', () => {
    const dusunSet = new Set(INITIAL_DPT.map(v => v.dusun));
    expect(dusunSet.has('Dusun I Krajan')).toBe(true);
    expect(dusunSet.has('Dusun II Pagaden')).toBe(true);
    expect(dusunSet.has('Dusun III Sukamaju')).toBe(true);
    expect(dusunSet.has('Dusun IV Mekarwangi')).toBe(true);
  });
});
