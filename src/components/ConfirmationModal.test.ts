import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ConfirmationModal } from './ConfirmationModal';
import { CANDIDATES } from '@/data/candidates';

describe('ConfirmationModal Component', () => {
  const candidate = CANDIDATES[1]; // Uly Emarita AD (Nomor 02)

  it('tidak merender apapun ketika isOpen bernilai false', () => {
    const html = renderToStaticMarkup(
      React.createElement(ConfirmationModal, {
        candidate,
        isOpen: false,
        onConfirm: () => {},
        onCancel: () => {},
        language: 'id'
      })
    );
    expect(html).toBe('');
  });

  it('merender judul konfirmasi, data calon terpilih, dan tombol konfirmasi saat isOpen true', () => {
    const html = renderToStaticMarkup(
      React.createElement(ConfirmationModal, {
        candidate,
        isOpen: true,
        onConfirm: () => {},
        onCancel: () => {},
        language: 'id'
      })
    );
    expect(html).toContain('Konfirmasi Pilihan');
    expect(html).toContain('Pastikan pilihan Anda sudah benar sebelum dicetak');
    expect(html).toContain('Uly Emarita AD');
    expect(html).toContain('Calon Nomor Urut 2');
    expect(html).toContain('BATAL');
    expect(html).toContain('YA, YAKIN');
  });

  it('mendukung bahasa Sunda dalam dialog konfirmasi', () => {
    const html = renderToStaticMarkup(
      React.createElement(ConfirmationModal, {
        candidate,
        isOpen: true,
        onConfirm: () => {},
        onCancel: () => {},
        language: 'su'
      })
    );
    expect(html).toContain('Pastikeun pilihan anjeun parantos saluyu sareng manah');
    expect(html).toContain('Naha anjeun yakin milih calon nomer 2?');
  });
});
