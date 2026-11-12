import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CrestSubang } from './CrestSubang';

describe('CrestSubang Component', () => {
  it('harus merender elemen SVG dengan aria-label yang benar', () => {
    const html = renderToStaticMarkup(React.createElement(CrestSubang));
    expect(html).toContain('<svg');
    expect(html).toContain('aria-label="Lambang Kabupaten Subang"');
  });

  it('harus memuat moto resmi Subang KARYA BHUMI BHAKTI', () => {
    const html = renderToStaticMarkup(React.createElement(CrestSubang));
    expect(html).toContain('KARYA BHUMI BHAKTI');
  });

  it('harus menerima prop size dan custom className', () => {
    const html = renderToStaticMarkup(
      React.createElement(CrestSubang, { size: 80, className: 'custom-crest' })
    );
    expect(html).toContain('width="80"');
    expect(html).toContain('class="custom-crest"');
  });
});
