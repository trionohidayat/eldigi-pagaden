import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CandidateAvatar } from './CandidateAvatar';

describe('CandidateAvatar Component', () => {
  it('harus merender pas foto merah resmi untuk calon pria dengan peci dan dasi', () => {
    const html = renderToStaticMarkup(
      React.createElement(CandidateAvatar, { gender: 'male' })
    );
    expect(html).toContain('fill="#db2424"'); // Solid red background
    expect(html).toContain('fill="#09090b"'); // Black songkok/peci
    expect(html).toContain('fill="#ffffff"'); // White collar
    expect(html).toContain('fill="#0f172a"'); // Black tie
  });

  it('harus merender pas foto merah resmi untuk calon wanita dengan hijab', () => {
    const html = renderToStaticMarkup(
      React.createElement(CandidateAvatar, { gender: 'female' })
    );
    expect(html).toContain('fill="#db2424"'); // Solid red background
    expect(html).toContain('fill="#111827"'); // Black hijab
    expect(html).toContain('fill="#ffffff"'); // White inner blouse
  });

  it('harus merender foto asli ketika photoUrl disediakan', () => {
    const html = renderToStaticMarkup(
      React.createElement(CandidateAvatar, {
        gender: 'female',
        photoUrl: '/images/candidates/uly-emarita-ad.jpg',
        name: 'Uly Emarita AD'
      })
    );
    expect(html).toContain('src=');
    expect(html).toContain('uly-emarita-ad.jpg');
    expect(html).toContain('alt="Uly Emarita AD"');
  });
});
