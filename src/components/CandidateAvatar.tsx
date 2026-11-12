import React from 'react';
import Image from 'next/image';

interface CandidateAvatarProps {
  gender?: 'male' | 'female';
  photoUrl?: string;
  name?: string;
  className?: string;
}

export const CandidateAvatar: React.FC<CandidateAvatarProps> = ({
  gender = 'male',
  photoUrl,
  name = 'Kandidat',
  className = ''
}) => {
  // If official photo is available, display the real candidate photo
  if (photoUrl) {
    return (
      <div className={`w-full h-full relative overflow-hidden bg-[#dc2626] ${className}`}>
        <Image
          src={photoUrl}
          alt={name}
          fill
          className="object-cover object-top"
          sizes="(max-width: 640px) 180px, 240px"
          priority
        />
      </div>
    );
  }

  // Otherwise, render the exact minimalist vector portrait
  return (
    <div className={`w-full h-full relative overflow-hidden bg-[#db2424] ${className}`}>
      {gender === 'male' ? (
        /* Male Candidate: Peci Hitam + Jas Hitam + Dasi Hitam + Kemeja Putih */
        <svg
          viewBox="0 0 200 240"
          className="w-full h-full object-cover"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Solid Red Background */}
          <rect width="200" height="240" fill="#db2424" />

          {/* Neck */}
          <path d="M85 140 H115 V175 H85 Z" fill="#fed7aa" />
          <path d="M85 140 C95 150 105 150 115 140 V152 C105 158 95 158 85 152 Z" fill="#fbcfe8" opacity="0.3" />

          {/* White Shirt Collar */}
          <polygon points="76,170 100,195 124,170 114,162 100,172 86,162" fill="#ffffff" />

          {/* Black Necktie */}
          <polygon points="96,172 104,172 106,183 94,183" fill="#0f172a" />
          <polygon points="94,183 106,183 108,240 92,240" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />

          {/* Shoulders & Formal Black Suit Jacket */}
          <path
            d="M20 240 L35 180 C40 172 55 166 75 168 L92 240 H20 Z"
            fill="#111827"
          />
          <path
            d="M180 240 L165 180 C160 172 145 166 125 168 L108 240 H180 Z"
            fill="#111827"
          />

          {/* Suit Lapels */}
          <path d="M75 168 L88 215 L100 240 L84 240 L52 178 Z" fill="#1f2937" />
          <path d="M125 168 L112 215 L100 240 L116 240 L148 178 Z" fill="#1f2937" />

          {/* Left Ear */}
          <ellipse cx="64" cy="112" rx="6" ry="11" fill="#fed7aa" />
          {/* Right Ear */}
          <ellipse cx="136" cy="112" rx="6" ry="11" fill="#fed7aa" />

          {/* Face (Smooth Minimalist Silhouette) */}
          <path
            d="M66 98 C66 65 134 65 134 98 C134 135 118 152 100 152 C82 152 66 135 66 98 Z"
            fill="#fed7aa"
          />

          {/* Black Songkok / Peci */}
          <path
            d="M64 88 C64 54 75 42 100 42 C125 42 136 54 136 88 C136 91 133 93 100 93 C67 93 64 91 64 88 Z"
            fill="#09090b"
          />
          {/* Peci Velvet Sheen / Detail */}
          <path
            d="M67 86 C72 58 84 45 100 45 C116 45 128 58 133 86 C124 88 76 88 67 86 Z"
            fill="#18181b"
          />
        </svg>
      ) : (
        /* Female Candidate: Hijab Hitam + Jas/Blazer Hitam + Inner Putih */
        <svg
          viewBox="0 0 200 240"
          className="w-full h-full object-cover"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Solid Red Background */}
          <rect width="200" height="240" fill="#db2424" />

          {/* Hijab Back Drapery */}
          <path
            d="M45 120 C35 150 30 190 25 240 H175 C170 190 165 150 155 120 C155 70 145 42 100 42 C55 42 45 70 45 120 Z"
            fill="#09090b"
          />

          {/* White Blouse Inner / Collar at V */}
          <polygon points="82,175 100,210 118,175" fill="#ffffff" />

          {/* Formal Blazer / Jas Hitam Wanita */}
          <path
            d="M20 240 L35 185 C42 176 60 172 80 175 L95 240 H20 Z"
            fill="#111827"
          />
          <path
            d="M180 240 L165 185 C158 176 140 172 120 175 L105 240 H180 Z"
            fill="#111827"
          />

          {/* Blazer Lapels */}
          <path d="M80 175 L94 218 L100 240 L82 240 L55 185 Z" fill="#1f2937" />
          <path d="M120 175 L106 218 L100 240 L118 240 L145 185 Z" fill="#1f2937" />

          {/* Black Hijab Front Draping around face and neck */}
          <path
            d="M52 105 C52 52 70 45 100 45 C130 45 148 52 148 105 C148 145 138 185 100 185 C62 185 52 145 52 105 Z"
            fill="#111827"
          />

          {/* Face Oval Opening (Smooth Skin Silhouette) */}
          <path
            d="M68 96 C68 68 80 62 100 62 C120 62 132 68 132 96 C132 130 120 146 100 146 C80 146 68 130 68 96 Z"
            fill="#fed7aa"
          />

          {/* Inner Hijab shadow / frame */}
          <path
            d="M66 94 C68 64 80 58 100 58 C120 58 132 64 134 94 C132 72 120 66 100 66 C80 66 68 72 66 94 Z"
            fill="#09090b"
            opacity="0.85"
          />
        </svg>
      )}
    </div>
  );
};
