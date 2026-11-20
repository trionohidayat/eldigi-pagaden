'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CANDIDATES } from '@/data/candidates';
import { INITIAL_DPT, Voter } from '@/data/dpt';
import { speakText, stopSpeech, playSoundEffect, SoundEffectType } from '@/utils/voiceHelper';
import {
  connectBluetoothPrinter as requestBluetooth,
  connectSerialPrinter as requestSerial,
  disconnectPrinter as closePrinter,
  printVVPATReceipt as printReceipt,
  printDiagnosticTest as printTest
} from '@/utils/bluetoothPrinter';

export type LanguageMode = 'id' | 'su';

export interface LastVoteInfo {
  candidateId: number;
  candidateNumber: string;
  candidateName: string;
  candidateTitle: string;
  timestamp: string;
  receiptCode: string;
  tps: string;
  desa: string;
}

export interface TPSConfig {
  tpsNumber: string;
  dusun: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  tahun: string;
}

interface VoteContextType {
  votes: Record<number, number>;
  totalVotes: number;
  voters: Voter[];
  activeVoter: Voter | null;
  language: LanguageMode;
  tpsConfig: TPSConfig;
  lastVote: LastVoteInfo | null;
  isVoiceEnabled: boolean;
  isPrinterConnected: boolean;
  printerDeviceName: string | null;
  isAutoPrintEnabled: boolean;
  castVote: (candidateId: number) => LastVoteInfo;
  authorizeVoter: (nik: string) => boolean;
  completeActiveVoter: () => void;
  resetAllData: (pin: string) => boolean;
  toggleLanguage: () => void;
  setLanguage: (lang: LanguageMode) => void;
  toggleVoice: () => void;
  toggleAutoPrint: () => void;
  connectPrinter: () => Promise<{ success: boolean; deviceName?: string; error?: string }>;
  connectUsbPrinter: () => Promise<{ success: boolean; deviceName?: string; error?: string }>;
  disconnectPrinterDevice: () => void;
  printReceiptDirectly: (lastVote: LastVoteInfo, voterName?: string) => Promise<{ success: boolean; error?: string }>;
  printTestReceipt: () => Promise<{ success: boolean; error?: string }>;
  speak: (text: string, options?: { lang?: string; rate?: number }) => void;
  playBeep: (type?: SoundEffectType) => void;
}

const DEFAULT_TPS: TPSConfig = {
  tpsNumber: 'TPS 01',
  dusun: 'Dusun I Krajan',
  desa: 'Desa Pagaden',
  kecamatan: 'Pagaden',
  kabupaten: 'Subang',
  provinsi: 'Jawa Barat',
  tahun: '2026'
};

const VoteContext = createContext<VoteContextType | undefined>(undefined);

const STORAGE_KEYS = {
  VOTES: 'eldigi_votes_v1',
  VOTERS: 'eldigi_voters_v1',
  LANG: 'eldigi_lang_v1',
  LAST_VOTE: 'eldigi_last_vote_v1',
  VOICE: 'eldigi_voice_v1',
  AUTO_PRINT: 'eldigi_autoprint_v1'
};

export const VoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [votes, setVotes] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0 });
  const [voters, setVoters] = useState<Voter[]>(INITIAL_DPT);
  const [activeVoter, setActiveVoter] = useState<Voter | null>(null);
  const [language, setLanguageState] = useState<LanguageMode>('id');
  const [lastVote, setLastVote] = useState<LastVoteInfo | null>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isPrinterConnected, setIsPrinterConnected] = useState(false);
  const [printerDeviceName, setPrinterDeviceName] = useState<string | null>(null);
  const [isAutoPrintEnabled, setIsAutoPrintEnabled] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedVotes = localStorage.getItem(STORAGE_KEYS.VOTES);
        if (savedVotes) {
          setVotes(JSON.parse(savedVotes));
        }

        const savedVoters = localStorage.getItem(STORAGE_KEYS.VOTERS);
        if (savedVoters) {
          setVoters(JSON.parse(savedVoters));
        }

        const savedLang = localStorage.getItem(STORAGE_KEYS.LANG);
        if (savedLang === 'id' || savedLang === 'su') {
          setLanguageState(savedLang);
        }

        const savedLastVote = localStorage.getItem(STORAGE_KEYS.LAST_VOTE);
        if (savedLastVote) {
          setLastVote(JSON.parse(savedLastVote));
        }

        const savedVoice = localStorage.getItem(STORAGE_KEYS.VOICE);
        if (savedVoice !== null) {
          setIsVoiceEnabled(savedVoice !== 'false');
        }

        const savedAutoPrint = localStorage.getItem(STORAGE_KEYS.AUTO_PRINT);
        if (savedAutoPrint !== null) {
          setIsAutoPrintEnabled(savedAutoPrint !== 'false');
        }
      } catch {
        // Storage access error handling
      }
      setIsHydrated(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.VOICE, String(isVoiceEnabled));
    } catch {}
  }, [isVoiceEnabled, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.AUTO_PRINT, String(isAutoPrintEnabled));
    } catch {}
  }, [isAutoPrintEnabled, isHydrated]);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(votes));
    } catch {}
  }, [votes, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.VOTERS, JSON.stringify(voters));
    } catch {}
  }, [voters, isHydrated]);

  const totalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0);

  const castVote = (candidateId: number): LastVoteInfo => {
    const candidate = CANDIDATES.find(c => c.id === candidateId) || CANDIDATES[0];
    
    // Increment count
    setVotes(prev => ({
      ...prev,
      [candidateId]: (prev[candidateId] || 0) + 1
    }));

    // Generate simulated cryptographic receipt code
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const date = new Date();
    const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    const receiptCode = `PGD-${DEFAULT_TPS.tpsNumber.replace(/\s+/g, '')}-${candidate.number}-${randomHex}`;

    const newLastVote: LastVoteInfo = {
      candidateId: candidate.id,
      candidateNumber: candidate.number,
      candidateName: candidate.name,
      candidateTitle: candidate.title,
      timestamp: `${dateStr}, ${timeStr} WIB`,
      receiptCode,
      tps: `${DEFAULT_TPS.tpsNumber} (${DEFAULT_TPS.dusun})`,
      desa: `${DEFAULT_TPS.desa}, Kec. ${DEFAULT_TPS.kecamatan}`
    };

    setLastVote(newLastVote);
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_VOTE, JSON.stringify(newLastVote));
    } catch {}

    // If active voter exists, update status in DPT list and keep active voter until session completes
    if (activeVoter) {
      const updatedStatusVoter = {
        ...activeVoter,
        status: 'sudah_memilih' as const,
        votedAt: `${timeStr} WIB`
      };

      setVoters(prev =>
        prev.map(v => (v.nik === activeVoter.nik ? updatedStatusVoter : v))
      );

      setActiveVoter(updatedStatusVoter);
    }

    return newLastVote;
  };

  const authorizeVoter = (nik: string): boolean => {
    const voter = voters.find(v => v.nik === nik);
    if (!voter || voter.status === 'sudah_memilih') {
      return false;
    }

    const token = Math.floor(1000 + Math.random() * 9000).toString();
    const updated = voters.map(v =>
      v.nik === nik ? { ...v, status: 'hadir' as const, token } : v
    );

    setVoters(updated);
    setActiveVoter({ ...voter, status: 'hadir', token });
    return true;
  };

  const completeActiveVoter = () => {
    if (activeVoter) {
      setActiveVoter(null);
    }
  };

  const resetAllData = (pin: string): boolean => {
    if (pin === '1234') {
      const freshVotes = { 1: 0, 2: 0, 3: 0 };
      setVotes(freshVotes);
      setVoters(INITIAL_DPT);
      setActiveVoter(null);
      setLastVote(null);
      try {
        localStorage.removeItem(STORAGE_KEYS.VOTES);
        localStorage.removeItem(STORAGE_KEYS.VOTERS);
        localStorage.removeItem(STORAGE_KEYS.LAST_VOTE);
      } catch {}
      return true;
    }
    return false;
  };

  const setLanguage = (lang: LanguageMode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEYS.LANG, lang);
    } catch {}
  };

  const toggleLanguage = () => {
    const nextLang = language === 'id' ? 'su' : 'id';
    setLanguage(nextLang);
  };

  const toggleVoice = useCallback(() => {
    setIsVoiceEnabled(prev => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEYS.VOICE, String(next));
      } catch {}

      if (!next) {
        stopSpeech();
      } else {
        playSoundEffect('success');
        speakText('Panduan suara Google Voice diaktifkan.');
      }
      return next;
    });
  }, []);

  const speak = useCallback(
    (text: string, options?: { lang?: string; rate?: number }) => {
      if (!isVoiceEnabled) return;
      speakText(text, options);
    },
    [isVoiceEnabled]
  );

  const playBeep = useCallback(
    (type: SoundEffectType = 'beep') => {
      if (!isVoiceEnabled) return;
      playSoundEffect(type);
    },
    [isVoiceEnabled]
  );

  const toggleAutoPrint = useCallback(() => {
    setIsAutoPrintEnabled(prev => !prev);
  }, []);

  const connectPrinter = useCallback(async () => {
    const res = await requestBluetooth();
    if (res.success) {
      setIsPrinterConnected(true);
      setPrinterDeviceName(res.deviceName || 'VSC TM-58V');
      playSoundEffect('success');
      if (isVoiceEnabled) {
        speakText('Printer Bluetooth VSC TM-58V berhasil terhubung.');
      }
    }
    return res;
  }, [isVoiceEnabled]);

  const connectUsbPrinter = useCallback(async () => {
    const res = await requestSerial();
    if (res.success) {
      setIsPrinterConnected(true);
      setPrinterDeviceName(res.deviceName || 'VSC TM-58V (USB)');
      playSoundEffect('success');
    }
    return res;
  }, []);

  const disconnectPrinterDevice = useCallback(() => {
    closePrinter();
    setIsPrinterConnected(false);
    setPrinterDeviceName(null);
  }, []);

  const printReceiptDirectly = useCallback(
    async (voteData: LastVoteInfo, voter?: string) => {
      const res = await printReceipt(voteData, voter);
      if (res.success) {
        playSoundEffect('print');
      }
      return res;
    },
    []
  );

  const printTestReceipt = useCallback(async () => {
    const res = await printTest();
    if (res.success) {
      playSoundEffect('print');
    }
    return res;
  }, []);

  return (
    <VoteContext.Provider
      value={{
        votes,
        totalVotes,
        voters,
        activeVoter,
        language,
        tpsConfig: DEFAULT_TPS,
        lastVote,
        isVoiceEnabled,
        isPrinterConnected,
        printerDeviceName,
        isAutoPrintEnabled,
        castVote,
        authorizeVoter,
        completeActiveVoter,
        resetAllData,
        toggleLanguage,
        setLanguage,
        toggleVoice,
        toggleAutoPrint,
        connectPrinter,
        connectUsbPrinter,
        disconnectPrinterDevice,
        printReceiptDirectly,
        printTestReceipt,
        speak,
        playBeep
      }}
    >
      {children}
    </VoteContext.Provider>
  );
};

export const useVote = () => {
  const context = useContext(VoteContext);
  if (!context) {
    throw new Error('useVote must be used within a VoteProvider');
  }
  return context;
};
