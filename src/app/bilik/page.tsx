'use client';

import React, { useState } from 'react';
import { useVote, LastVoteInfo } from '@/context/VoteContext';
import { CANDIDATES, Candidate } from '@/data/candidates';
import { CandidateCard } from '@/components/CandidateCard';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { ThermalReceipt } from '@/components/ThermalReceipt';
import { CrestSubang } from '@/components/CrestSubang';
import { KioskDrawer } from '@/components/KioskDrawer';
import { QRScannerGate } from '@/components/QRScannerGate';
import { UserCheck, X } from 'lucide-react';

export default function BilikSuaraPage() {
  const {
    language,
    activeVoter,
    completeActiveVoter,
    castVote
  } = useVote();

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptData, setReceiptData] = useState<LastVoteInfo | null>(null);
  const [selectionHint, setSelectionHint] = useState(false);

  // If no voter has scanned their QR yet, show the QR Scanner Gate!
  if (!activeVoter) {
    return (
      <div className="relative flex-1 min-h-screen flex flex-col justify-between">
        <KioskDrawer />
        <QRScannerGate onAuthorized={() => {}} />
      </div>
    );
  }

  // Handle touching/clicking a candidate card - selects candidate, does NOT immediately show popup
  const handleSelectCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setSelectionHint(false);
  };

  // Handle clicking the red bottom bar "PILIH KANDIDAT INI" - triggers confirmation popup
  const handleBottomBarClick = () => {
    if (!selectedCandidate) {
      setSelectionHint(true);
      setTimeout(() => setSelectionHint(false), 2500);
      return;
    }

    setIsModalOpen(true);
  };

  const handleCancelVote = () => {
    setIsModalOpen(false);
  };

  const handleConfirmVote = () => {
    if (!selectedCandidate) return;

    setIsSubmitting(true);
    const voteResult = castVote(selectedCandidate.id);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsModalOpen(false);
      setReceiptData(voteResult);
    }, 400);
  };

  // After receipt is printed / finished, reset active voter and return automatically to QR Scanner!
  const handleFinishSession = () => {
    setReceiptData(null);
    setSelectedCandidate(null);
    completeActiveVoter();
  };

  return (
    <div
      className="relative flex-1 min-h-screen flex flex-col justify-between select-none overflow-x-hidden"
      style={{
        background: 'linear-gradient(180deg, #cbe8d6 0%, #e0f2e7 22%, #f5faf7 48%, #ffffff 75%)'
      }}
    >
      {/* Discreet Panitia/KPPS Settings Drawer trigger */}
      <KioskDrawer />

      {/* Main Ballot Content Area */}
      <div className="flex-1 flex flex-col justify-between items-center py-5 sm:py-7 px-4 w-full">
        {/* Top Header: Crest + Surat Suara + Pemilihan Kepala Desa */}
        <div className="flex flex-col items-center text-center mt-1 sm:mt-2">
          {/* Official Emblem of Kabupaten Subang */}
          <div className="mb-2 sm:mb-3">
            <CrestSubang size={56} className="drop-shadow-xs" />
          </div>

          {/* Heading 1: SURAT SUARA */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wider text-black font-sans uppercase">
            SURAT SUARA
          </h1>

          {/* Heading 2: PEMILIHAN KEPALA DESA */}
          <p className="text-xs sm:text-sm md:text-base font-semibold tracking-widest text-black font-sans uppercase mt-1">
            PEMILIHAN KEPALA DESA
          </p>

          {/* Verified Voter Status Pill */}
          <div className="mt-2.5 inline-flex items-center gap-2 bg-white/80 border border-emerald-300 text-emerald-950 px-3.5 py-1 rounded-full text-xs font-semibold shadow-xs">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span className="font-bold">{activeVoter.name}</span>
            <span className="text-slate-300">•</span>
            <span className="font-mono text-[11px] text-slate-600">NIK: {activeVoter.nik}</span>
            <button
              type="button"
              onClick={completeActiveVoter}
              title="Batal / Kembali ke Layar Scan QR"
              className="ml-1 p-0.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Candidate Ballot Cards Row */}
        <div className="my-auto py-4 sm:py-6 w-full max-w-5xl flex flex-row flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 px-2">
          {CANDIDATES.map(candidate => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              isSelected={selectedCandidate?.id === candidate.id}
              onSelect={handleSelectCandidate}
              language={language}
              disabled={Boolean(receiptData)}
            />
          ))}
        </div>

        {/* Hint if voter clicks bottom button before selecting any candidate */}
        <div className="h-6 flex items-center justify-center">
          {selectionHint && (
            <span className="text-xs font-bold text-red-600 bg-white/90 border border-red-300 px-3 py-1 rounded-full shadow-sm animate-bounce">
              Silakan sentuh salah satu kotak calon di atas terlebih dahulu
            </span>
          )}
        </div>
      </div>

      {/* Bottom Bar: Full-Width Red Bar with White Text "PILIH KANDIDAT INI" */}
      <div className="w-full">
        <button
          type="button"
          onClick={handleBottomBarClick}
          disabled={Boolean(receiptData)}
          className={`w-full h-14 sm:h-16 text-white font-bold text-base sm:text-lg tracking-wider font-sans uppercase flex items-center justify-center transition-colors duration-150 cursor-pointer shadow-md ${
            selectedCandidate
              ? 'bg-[#ef4444] hover:bg-[#dc2626] active:bg-[#b91c1c]'
              : 'bg-[#ef4444] hover:bg-[#dc2626] active:bg-[#b91c1c] opacity-90'
          }`}
          style={{ touchAction: 'manipulation' }}
        >
          PILIH KANDIDAT INI
        </button>
      </div>

      {/* Confirmation Modal - Only appears after clicking "PILIH KANDIDAT INI" */}
      <ConfirmationModal
        candidate={selectedCandidate}
        isOpen={isModalOpen}
        onConfirm={handleConfirmVote}
        onCancel={handleCancelVote}
        language={language}
        isSubmitting={isSubmitting}
      />

      {/* VVPAT Thermal Receipt Simulation */}
      {receiptData && (
        <ThermalReceipt
          lastVote={receiptData}
          onFinish={handleFinishSession}
          language={language}
          autoResetSeconds={8}
        />
      )}
    </div>
  );
}
