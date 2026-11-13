export interface Candidate {
  id: number;
  number: string;
  name: string;
  title: string;
  slogan: string;
  vision: string;
  missions: string[];
  photoUrl?: string;
  themeColor: {
    primary: string;
    secondary: string;
    badgeBg: string;
    badgeText: string;
    border: string;
    ring: string;
    cardBg: string;
    btnBg: string;
    btnHover: string;
  };
  avatarStyle: {
    bgGradient: string;
    initials: string;
    gender: 'female' | 'male';
    badgeLabel: string;
  };
}

export const CANDIDATES: Candidate[] = [
  {
    id: 1,
    number: '01',
    name: 'Nomor Urut 1',
    title: '',
    slogan: 'Pagaden Mandiri, Tangguh, & Berkeadilan',
    vision: 'Transformasi infrastruktur desa terpadu, kemandirian pangan petani, dan pemerataan fasilitas publik di seluruh dusun.',
    missions: [
      'Pembangunan jalan lingkungan mulus dan drainase bebas banjir.',
      'Jaminan ketersediaan pupuk, bibit unggul, dan modernisasi alat tani.',
      'Fasilitas wifi gratis di balai dusun dan sarana olahraga generasi muda.'
    ],
    themeColor: {
      primary: '#d97706', // Amber-600
      secondary: '#fef3c7',
      badgeBg: 'bg-amber-600',
      badgeText: 'text-white',
      border: 'border-amber-300 hover:border-amber-500',
      ring: 'focus:ring-amber-500',
      cardBg: 'bg-gradient-to-b from-amber-50 to-white',
      btnBg: 'bg-amber-600',
      btnHover: 'hover:bg-amber-700'
    },
    avatarStyle: {
      bgGradient: 'from-amber-500 to-orange-700',
      initials: '01',
      gender: 'male',
      badgeLabel: 'Calon No. 01'
    }
  },
  {
    id: 2,
    number: '02',
    name: 'Uly Emarita AD',
    title: 'S.E., M.M.',
    slogan: 'Pagaden Maju, Transparan, & Berdaya',
    photoUrl: '/images/candidates/uly-emarita-ad.jpg',
    vision: 'Mewujudkan tata kelola desa berbasis digital, pelayanan publik transparan, serta penguatan ekonomi UMKM dan perempuan.',
    missions: [
      'Pelayanan administrasi desa cepat & bebas pungli berbasis digital.',
      'Bantuan modal dan pendampingan pemasaran digital untuk UMKM desa.',
      'Transparansi penuh anggaran APBDes yang dapat dipantau seluruh warga.'
    ],
    themeColor: {
      primary: '#0284c7', // Sky-600
      secondary: '#e0f2fe',
      badgeBg: 'bg-sky-600',
      badgeText: 'text-white',
      border: 'border-sky-300 hover:border-sky-500',
      ring: 'focus:ring-sky-500',
      cardBg: 'bg-gradient-to-b from-sky-50 to-white',
      btnBg: 'bg-sky-600',
      btnHover: 'hover:bg-sky-700'
    },
    avatarStyle: {
      bgGradient: 'from-sky-500 to-indigo-600',
      initials: 'UE',
      gender: 'female',
      badgeLabel: 'Calon No. 02'
    }
  },
  {
    id: 3,
    number: '03',
    name: 'Nomor Urut 3',
    title: '',
    slogan: 'Pagaden Sauyunan, Religius, & Sejahtera',
    vision: 'Membangun Pagaden yang guyub rukun, berkarakter mulia, serta unggul dalam kualitas kesehatan balita-lansia dan pendidikan.',
    missions: [
      'Peningkatan insentif berkala bagi guru ngaji, kader Posyandu, dan RT/RW.',
      'Penyediaan ambulans desa gratis siaga 24 jam untuk warga Pagaden.',
      'Beasiswa desa untuk anak berprestasi dan pelatihan kerja pemuda karang taruna.'
    ],
    themeColor: {
      primary: '#059669', // Emerald-600
      secondary: '#d1fae5',
      badgeBg: 'bg-emerald-600',
      badgeText: 'text-white',
      border: 'border-emerald-300 hover:border-emerald-500',
      ring: 'focus:ring-emerald-500',
      cardBg: 'bg-gradient-to-b from-emerald-50 to-white',
      btnBg: 'bg-emerald-600',
      btnHover: 'hover:bg-emerald-700'
    },
    avatarStyle: {
      bgGradient: 'from-emerald-500 to-teal-700',
      initials: '03',
      gender: 'female',
      badgeLabel: 'Calon No. 03'
    }
  }
];
