import { describe, it, expect, vi, beforeEach } from 'vitest';
import { speakText, stopSpeech, playSoundEffect } from './voiceHelper';

describe('voiceHelper (Google Voice & Audio Feedback)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('speakText', () => {
    it('tidak melempar error saat window/speechSynthesis tidak tersedia di environment server/test', () => {
      expect(() => speakText('Halo uji suara')).not.toThrow();
    });

    it('memanggil speechSynthesis.speak ketika objek browser tersedia', () => {
      const mockCancel = vi.fn();
      const mockSpeak = vi.fn();
      const mockGetVoices = vi.fn().mockReturnValue([
        { name: 'Google Bahasa Indonesia', lang: 'id-ID' }
      ]);

      const testGlobals = globalThis as unknown as {
        window?: unknown;
        SpeechSynthesisUtterance?: unknown;
      };

      // Mock global window and speechSynthesis
      const originalWindow = global.window;
      testGlobals.window = {
        speechSynthesis: {
          cancel: mockCancel,
          speak: mockSpeak,
          getVoices: mockGetVoices
        }
      };

      // Mock SpeechSynthesisUtterance constructor
      class MockUtterance {
        text: string;
        lang = '';
        rate = 1;
        pitch = 1;
        voice = null;
        constructor(text: string) {
          this.text = text;
        }
      }
      testGlobals.SpeechSynthesisUtterance = MockUtterance;

      speakText('Arahkan kamera ke QR code');

      expect(mockCancel).toHaveBeenCalled();
      expect(mockSpeak).toHaveBeenCalled();

      // Restore
      global.window = originalWindow;
    });
  });

  describe('stopSpeech', () => {
    it('memanggil cancel pada speechSynthesis jika tersedia', () => {
      const mockCancel = vi.fn();
      const originalWindow = global.window;
      const testGlobals = globalThis as unknown as {
        window?: unknown;
      };
      testGlobals.window = {
        speechSynthesis: {
          cancel: mockCancel
        }
      };

      stopSpeech();
      expect(mockCancel).toHaveBeenCalled();
      global.window = originalWindow;
    });
  });

  describe('playSoundEffect', () => {
    it('menjalankan efek suara tanpa melempar exception', () => {
      expect(() => playSoundEffect('click')).not.toThrow();
      expect(() => playSoundEffect('success')).not.toThrow();
      expect(() => playSoundEffect('warning')).not.toThrow();
      expect(() => playSoundEffect('print')).not.toThrow();
      expect(() => playSoundEffect('beep')).not.toThrow();
    });
  });
});
