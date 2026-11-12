import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CandidateCard } from './CandidateCard';
import { CANDIDATES } from '@/data/candidates';

describe('CandidateCard Component', () => {
  const candidate1 = CANDIDATES[0];

  it('harus merender nomor urut calon tunggal 1 persis seperti surat suara fisik di gambar', () => {
    const html = renderToStaticMarkup(
      React.createElement(CandidateCard, {
        candidate: candidate1,
        onSelect: () => {},
        isSelected: false
      })
    );
    expect(html).toContain('1');
    expect(html).toContain('border-black');
  });

  it('harus merender nama calon di bawah foto', () => {
    const html = renderToStaticMarkup(
      React.createElement(CandidateCard, {
        candidate: candidate1,
        onSelect: () => {},
        isSelected: false
      })
    );
    expect(html).toContain(candidate1.name);
  });

  it('harus merender status terpilih jika isSelected bernilai true', () => {
    const html = renderToStaticMarkup(
      React.createElement(CandidateCard, {
        candidate: candidate1,
        onSelect: () => {},
        isSelected: true
      })
    );
    expect(html).toContain('Terpilih');
    expect(html).toContain('border-red-600');
  });
});
