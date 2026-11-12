export interface Voter {
  nik: string;
  name: string;
  gender: 'L' | 'P';
  age: number;
  rt: string;
  rw: string;
  dusun: string;
  status: 'belum' | 'hadir' | 'sudah_memilih';
  votedAt?: string;
  token?: string;
}

export const INITIAL_DPT: Voter[] = [
  {
    nik: '3211012801750001',
    name: 'Asep Saepuloh',
    gender: 'L',
    age: 49,
    rt: '001',
    rw: '001',
    dusun: 'Dusun I Krajan',
    status: 'belum'
  },
  {
    nik: '3211015504820002',
    name: 'Siti Aminah',
    gender: 'P',
    age: 42,
    rt: '001',
    rw: '001',
    dusun: 'Dusun I Krajan',
    status: 'belum'
  },
  {
    nik: '3211011209990003',
    name: 'Dadan Ramdani',
    gender: 'L',
    age: 25,
    rt: '002',
    rw: '001',
    dusun: 'Dusun I Krajan',
    status: 'belum'
  },
  {
    nik: '3211016010680004',
    name: 'Enok Maryati',
    gender: 'P',
    age: 56,
    rt: '002',
    rw: '002',
    dusun: 'Dusun II Pagaden',
    status: 'belum'
  },
  {
    nik: '3211011503850005',
    name: 'Cecep Supriatna',
    gender: 'L',
    age: 39,
    rt: '003',
    rw: '002',
    dusun: 'Dusun II Pagaden',
    status: 'belum'
  },
  {
    nik: '3211014207930006',
    name: 'Neng Ratnasari',
    gender: 'P',
    age: 31,
    rt: '001',
    rw: '003',
    dusun: 'Dusun III Sukamaju',
    status: 'belum'
  },
  {
    nik: '3211010811550007',
    name: 'Abah Engkos Kosasih',
    gender: 'L',
    age: 69,
    rt: '002',
    rw: '003',
    dusun: 'Dusun III Sukamaju',
    status: 'belum'
  },
  {
    nik: '3211016508010008',
    name: 'Rina Nurmalasari',
    gender: 'P',
    age: 23,
    rt: '001',
    rw: '004',
    dusun: 'Dusun IV Mekarwangi',
    status: 'belum'
  },
  {
    nik: '3211012002700009',
    name: 'Mang Ujang Sudrajat',
    gender: 'L',
    age: 54,
    rt: '002',
    rw: '004',
    dusun: 'Dusun IV Mekarwangi',
    status: 'belum'
  },
  {
    nik: '3211014512030010',
    name: 'Tita Rosita',
    gender: 'P',
    age: 21,
    rt: '003',
    rw: '004',
    dusun: 'Dusun IV Mekarwangi',
    status: 'belum'
  }
];
