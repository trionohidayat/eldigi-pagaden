import React from 'react';

interface CrestSubangProps {
  className?: string;
  size?: number;
}

export const CrestSubang: React.FC<CrestSubangProps> = ({
  className = '',
  size = 64
}) => {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.15)}
      viewBox="0 0 100 115"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Lambang Kabupaten Subang"
    >
      {/* Outer Shield Border (Gold) */}
      <path
        d="M50 4C78 4 94 14 94 36C94 72 68 96 50 104C32 96 6 72 6 36C6 14 22 4 50 4Z"
        fill="#b45309"
        stroke="#78350f"
        strokeWidth="1.5"
      />
      
      {/* Inner Green Shield */}
      <path
        d="M50 7C75 7 90 16 90 37C90 70 66 92 50 100C34 92 10 70 10 37C10 16 25 7 50 7Z"
        fill="#15803d"
        stroke="#fef08a"
        strokeWidth="1.5"
      />

      {/* Sky Field Inside Shield */}
      <path
        d="M50 10C72 10 86 18 86 38C86 52 80 66 70 76C60 84 54 88 50 92C46 88 40 84 30 76C20 66 14 52 14 38C14 18 28 10 50 10Z"
        fill="#f8fafc"
      />

      {/* Blue Water / Reservoir Field */}
      <path
        d="M16 52C24 50 36 55 50 55C64 55 76 50 84 52C85 62 80 72 70 80C60 86 54 90 50 92C46 90 40 86 30 80C20 72 15 62 16 52Z"
        fill="#0284c7"
      />

      {/* Mountain Silhouette (Gunung Tangkuban Parahu) */}
      <path
        d="M20 54L38 32L50 40L62 30L80 54Z"
        fill="#166534"
      />
      <path
        d="M32 42L44 26L52 34L64 24L74 44Z"
        fill="#14532d"
        opacity="0.8"
      />

      {/* Water Waves */}
      <path
        d="M24 64C32 62 38 66 50 66C62 66 68 62 76 64"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M28 72C36 70 42 74 50 74C58 74 64 70 72 72"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M36 80C42 78 46 81 50 81C54 81 58 78 64 80"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Central Spire / Kujang / Tugu Monumen */}
      <path
        d="M50 18L52.5 30L51.5 54H48.5L47.5 30L50 18Z"
        fill="#f8fafc"
        stroke="#334155"
        strokeWidth="0.8"
      />

      {/* Golden Star at top */}
      <polygon
        points="50,11 51.5,15 56,15.5 52.5,18.5 53.5,23 50,20.5 46.5,23 47.5,18.5 44,15.5 48.5,15"
        fill="#facc15"
        stroke="#ca8a04"
        strokeWidth="0.5"
      />

      {/* Padi & Kapas (Left and Right Garlands) */}
      {/* Rice sprig (Left - Golden) */}
      <path
        d="M24 28C22 36 22 46 25 54"
        stroke="#eab308"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="21" cy="30" r="1.8" fill="#facc15" />
      <circle cx="20" cy="36" r="1.8" fill="#facc15" />
      <circle cx="21" cy="42" r="1.8" fill="#facc15" />
      <circle cx="23" cy="48" r="1.8" fill="#facc15" />

      {/* Cotton sprig (Right - White & Green) */}
      <path
        d="M76 28C78 36 78 46 75 54"
        stroke="#15803d"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="79" cy="30" r="2" fill="#ffffff" stroke="#15803d" strokeWidth="0.8" />
      <circle cx="80" cy="36" r="2" fill="#ffffff" stroke="#15803d" strokeWidth="0.8" />
      <circle cx="79" cy="42" r="2" fill="#ffffff" stroke="#15803d" strokeWidth="0.8" />
      <circle cx="77" cy="48" r="2" fill="#ffffff" stroke="#15803d" strokeWidth="0.8" />

      {/* Ribbon Banner at Bottom */}
      <path
        d="M12 94L22 90L24 99L12 103Z"
        fill="#b45309"
      />
      <path
        d="M88 94L78 90L76 99L88 103Z"
        fill="#b45309"
      />
      <path
        d="M18 92C32 96 68 96 82 92L84 100C68 105 32 105 16 100L18 92Z"
        fill="#f59e0b"
        stroke="#b45309"
        strokeWidth="1"
      />

      {/* Ribbon Fold shadow */}
      <path
        d="M22 92L24 99L26 92Z"
        fill="#78350f"
      />
      <path
        d="M78 92L76 99L74 92Z"
        fill="#78350f"
      />

      {/* Subang Motto on Ribbon */}
      <text
        x="50"
        y="98.5"
        textAnchor="middle"
        fontSize="4.8"
        fontWeight="bold"
        fill="#78350f"
        fontFamily="sans-serif"
        letterSpacing="0.3"
      >
        KARYA BHUMI BHAKTI
      </text>
    </svg>
  );
};
