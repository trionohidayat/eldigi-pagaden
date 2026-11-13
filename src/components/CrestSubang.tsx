import React from 'react';

interface CrestSubangProps {
  className?: string;
  size?: number;
  alt?: string;
}

/**
 * Lambang Resmi Pemerintah Kabupaten Subang
 * Moto: BENTENG PANCASILA • KARYA UTAMA SATYA NEGARA
 * Perisai hijau berbingkai kuning emas dengan pohon beringin dan benteng biru.
 */
export const CrestSubang: React.FC<CrestSubangProps> = ({
  className = '',
  size = 64,
  alt = 'Lambang Kabupaten Subang'
}) => {
  // Aspek rasio gambar lambang Kabupaten Subang: 461 x 521 (~ 1 : 1.13)
  const height = Math.round(size * 1.13);

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 461 521"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={className}
      role="img"
      aria-label={`${alt} - BENTENG PANCASILA • KARYA UTAMA SATYA NEGARA`}
    >
      <title>{`${alt} - BENTENG PANCASILA • KARYA UTAMA SATYA NEGARA`}</title>
      <desc>
        Lambang Resmi Kabupaten Subang: Perisai hijau berbingkai emas, Bintang Pancasila, Pohon Beringin, Benteng Biru, serta semboyan BENTENG PANCASILA dan KARYA UTAMA SATYA NEGARA.
      </desc>

      {/* Silhouette Perisai Dasar */}
      <path
        d="M230.5 16C370 16 430 46 430 110C430 310 320 440 230.5 505C141 440 31 310 31 110C31 46 91 16 230.5 16Z"
        fill="#15803d"
        stroke="#f59e0b"
        strokeWidth="10"
      />

      {/* Gambar Resmi Lambang Kabupaten Subang (Resolusi Tinggi) */}
      <image
        href="/images/lambang-kabupaten-subang.png"
        xlinkHref="/images/lambang-kabupaten-subang.png"
        x="0"
        y="0"
        width="461"
        height="521"
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  );
};
