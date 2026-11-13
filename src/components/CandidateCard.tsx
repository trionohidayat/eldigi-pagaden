'use client';

import React from 'react';
import { Candidate } from '@/data/candidates';
import { CandidateAvatar } from './CandidateAvatar';

interface CandidateCardProps {
  candidate: Candidate;
  onSelect: (candidate: Candidate) => void;
  isSelected?: boolean;
  language?: 'id' | 'su';
  disabled?: boolean;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  onSelect,
  isSelected = false,
  disabled = false
}) => {
  const handleClick = () => {
    if (disabled) return;
    onSelect(candidate);
  };

  // Convert "01", "02", "03" to single integer number like in the reference image ("1", "2", "3")
  const displayNumber = parseInt(candidate.number, 10) || candidate.id;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Calon nomor ${displayNumber}: ${candidate.name}`}
      className={`group relative flex flex-col items-center bg-white border-2 transition-all duration-150 cursor-pointer select-none w-full max-w-[260px] sm:max-w-[210px] md:max-w-[230px] lg:max-w-[240px] landscape:max-w-[155px] sm:landscape:max-w-[210px] md:landscape:max-w-[230px] ${
        isSelected
          ? 'border-red-600 ring-4 ring-red-500/40 shadow-2xl scale-[1.02]'
          : 'border-black hover:border-black hover:shadow-lg'
      } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      style={{
        touchAction: 'manipulation'
      }}
    >
      {/* Top Number - Exactly like reference image: bold black number centered above photo */}
      <div className="w-full pt-2 sm:pt-3 pb-1 sm:pb-2 landscape:pt-1.5 landscape:pb-1 text-center">
        <span className="text-xl sm:text-2xl md:text-3xl landscape:text-lg sm:landscape:text-2xl font-extrabold text-black font-sans tracking-tight">
          {displayNumber}
        </span>
      </div>

      {/* Photo Frame - Crisp black border, red background */}
      <div className="w-[88%] aspect-[3/4] border border-black overflow-hidden relative shadow-inner">
        <CandidateAvatar
          gender={candidate.avatarStyle?.gender || 'male'}
          photoUrl={candidate.photoUrl}
          name={candidate.name}
        />

        {/* Selected Checkmark Badge (Subtle, top-right of photo) */}
        {isSelected && (
          <div className="absolute top-1.5 right-1.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white text-red-600 font-black text-[10px] sm:text-xs flex items-center justify-center shadow-md border border-red-600">
            ✓
          </div>
        )}
      </div>

      {/* Candidate Name below photo - Clear & Formal ballot style */}
      <div className="w-full px-2 py-2 sm:py-3 landscape:py-1.5 text-center min-h-[48px] sm:min-h-[56px] md:min-h-[64px] flex flex-col items-center justify-center">
        <h3 className="text-[11px] sm:text-xs md:text-sm font-bold text-black uppercase tracking-tight leading-snug line-clamp-2">
          {candidate.name}
          {candidate.title ? `, ${candidate.title}` : ''}
        </h3>
        {isSelected && (
          <span className="mt-1 text-[9px] sm:text-[10px] font-bold text-red-600 uppercase tracking-widest bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
            Terpilih
          </span>
        )}
      </div>
    </div>
  );
};
