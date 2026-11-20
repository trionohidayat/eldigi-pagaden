'use client';

import React from 'react';
import { Candidate } from '@/data/candidates';
import { CandidateAvatar } from './CandidateAvatar';
import { Check, RotateCcw } from 'lucide-react';

interface ConfirmationModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  language: 'id' | 'su';
  isSubmitting?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  candidate,
  isOpen,
  onConfirm,
  onCancel,
  language,
  isSubmitting = false
}) => {
  if (!isOpen || !candidate) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
  };

  const displayNumber = parseInt(candidate.number, 10) || candidate.id;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-150">
      <div
        className="bg-white border-2 border-black max-w-md w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 md:p-8 landscape:p-4 shadow-2xl flex flex-col items-center text-center rounded-xs animate-in zoom-in-95 duration-150"
        style={{ touchAction: 'manipulation' }}
      >
        {/* Header */}
        <h3 className="text-lg sm:text-2xl font-black text-black uppercase tracking-wide font-sans">
          {language === 'su' ? 'Konfirmasi Pilihan' : 'Konfirmasi Pilihan'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-0.5 sm:mt-1">
          {language === 'su'
            ? 'Pastikeun pilihan anjeun parantos saluyu sareng manah'
            : 'Pastikan pilihan Anda sudah benar sebelum dicetak'}
        </p>

        {/* Candidate Ballot Preview */}
        <div className="my-3 sm:my-5 landscape:my-2 flex flex-col items-center">
          <div className="w-28 sm:w-36 landscape:w-24 border-2 border-black bg-white p-2 sm:p-3 flex flex-col items-center shadow-md">
            <span className="text-xl sm:text-2xl landscape:text-lg font-black text-black font-sans mb-1">
              {displayNumber}
            </span>
            <div className="w-full aspect-[3/4] border border-black overflow-hidden relative">
              <CandidateAvatar
                gender={candidate.avatarStyle?.gender || 'male'}
                photoUrl={candidate.photoUrl}
                name={candidate.name}
              />
            </div>
          </div>

          <h4 className="mt-2 sm:mt-3 text-base sm:text-xl font-bold text-black font-sans">
            {candidate.name}
            {candidate.title ? `, ${candidate.title}` : ''}
          </h4>
          <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
            Calon Nomor Urut {displayNumber}
          </span>
        </div>

        {/* Confirmation Question */}
        <p className="text-xs sm:text-base font-bold text-slate-900 max-w-xs">
          {language === 'su'
            ? `Naha anjeun yakin milih calon nomer ${displayNumber}?`
            : `Apakah Anda yakin memilih Calon No. ${displayNumber}?`}
        </p>

        {/* Action Buttons: Minimalist Ulangi & Ya */}
        <div className="w-full grid grid-cols-2 gap-2.5 sm:gap-3 mt-4 sm:mt-6">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="py-2.5 sm:py-3.5 px-3 sm:px-4 border-2 border-black bg-white hover:bg-slate-100 active:scale-95 text-black font-bold text-xs sm:text-base flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-700" />
            <span>{language === 'su' ? 'ULANGI' : 'ULANGI'}</span>
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="py-2.5 sm:py-3.5 px-3 sm:px-4 border-2 border-blue-600 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-xs sm:text-base flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/30 transition cursor-pointer"
          >
            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[3]" />
            <span>{language === 'su' ? 'PILIH' : 'PILIH'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
