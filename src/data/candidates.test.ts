import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { CANDIDATES } from './candidates';

describe('CANDIDATES Master Data', () => {
  it('harus memiliki tepat 3 kandidat Kepala Desa Pagaden', () => {
    expect(CANDIDATES).toHaveLength(3);
  });

  it('harus memuat Calon No 01 Bilal Salsabil Agusti dengan benar', () => {
    const candidate01 = CANDIDATES.find(c => c.number === '01');
    expect(candidate01).toBeDefined();
    expect(candidate01?.id).toBe(1);
    expect(candidate01?.name).toBe('Bilal Salsabil Agusti');
    expect(candidate01?.title).toBe('S.T.');
    expect(candidate01?.slogan).toContain('Pagaden Mandiri');
    expect(candidate01?.avatarStyle.badgeLabel).toBe('Calon No. 01');
  });

  it('harus memuat Calon No 02 Uly Emarita AD beserta foto resminya dengan benar', () => {
    const candidate02 = CANDIDATES.find(c => c.number === '02');
    expect(candidate02).toBeDefined();
    expect(candidate02?.id).toBe(2);
    expect(candidate02?.name).toBe('Uly Emarita AD');
    expect(candidate02?.title).toBe('S.E., M.M.');
    expect(candidate02?.slogan).toContain('Pagaden Maju');
    expect(candidate02?.avatarStyle.badgeLabel).toBe('Calon No. 02');
    expect(candidate02?.photoUrl).toBe('/images/candidates/uly-emarita-ad.jpg');
  });

  it('setiap photoUrl kandidat yang terpasang harus memiliki file aset di folder public', () => {
    CANDIDATES.forEach(c => {
      if (c.photoUrl) {
        const assetPath = join(process.cwd(), 'public', c.photoUrl.replace(/^\//, ''));
        expect(existsSync(assetPath)).toBe(true);
      }
    });
  });

  it('harus memuat Calon No 03 Dewi Puspita Sari dengan benar', () => {
    const candidate03 = CANDIDATES.find(c => c.number === '03');
    expect(candidate03).toBeDefined();
    expect(candidate03?.id).toBe(3);
    expect(candidate03?.name).toBe('Dewi Puspita Sari');
    expect(candidate03?.title).toBe('S.Pd.');
    expect(candidate03?.slogan).toContain('Pagaden Sauyunan');
    expect(candidate03?.avatarStyle.badgeLabel).toBe('Calon No. 03');
  });

  it('urutan array CANDIDATES harus sesuai dengan nomor urut 01, 02, 03', () => {
    expect(CANDIDATES.map(c => c.number)).toEqual(['01', '02', '03']);
    expect(CANDIDATES.map(c => c.id)).toEqual([1, 2, 3]);
  });

  it('setiap calon harus memiliki nomor urut dan ID yang unik', () => {
    const ids = CANDIDATES.map(c => c.id);
    const numbers = CANDIDATES.map(c => c.number);
    expect(new Set(ids).size).toBe(3);
    expect(new Set(numbers).size).toBe(3);
  });

  it('setiap calon harus memiliki atribut warna tema dan avatar yang lengkap', () => {
    CANDIDATES.forEach(c => {
      expect(c.themeColor.primary).toBeDefined();
      expect(c.themeColor.badgeBg).toBeDefined();
      expect(c.themeColor.btnBg).toBeDefined();
      expect(c.avatarStyle.initials).toBeDefined();
      expect(c.missions.length).toBeGreaterThan(0);
    });
  });
});
